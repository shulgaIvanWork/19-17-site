import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { policyVersion } from '@/content/legal';
import { contactCopy } from '@/content/site';
import { checkEnquiry, type EnquiryInput } from '@/lib/enquiry';

/** Единственный бэкенд сайта: прием заявки из формы.
 *
 *  Заявка уходит письмом через SMTP почты Яндекс 360. Настройки только в
 *  переменных окружения (образец в .env.example): SMTP_USER - ящик, от имени
 *  которого пишет сайт, SMTP_PASS - пароль приложения этого ящика, ENQUIRY_TO -
 *  куда присылать (по умолчанию тот же ящик). SMTP_HOST и SMTP_PORT по
 *  умолчанию smtp.yandex.ru и 465. Сервис российский: политика обещает, что
 *  данные не передаются за границу (content/legal.ts).
 *
 *  Без SMTP_USER и SMTP_PASS в разработке заявка пишется в консоль, в проде
 *  маршрут отвечает 503, а не проглатывает заявку молча. */

type Enquiry = EnquiryInput & {
  /** Редакция политики, с которой согласился отправитель, и момент согласия -
   *  это и есть доказательство согласия по 152-ФЗ. Храните их вместе с заявкой:
   *  они есть в каждом письме. */
  policyVersion: string;
  consentAt: string;
  /** Что о редакции сообщила страница, если это не действующая редакция.
   *  Пусто в обычном случае. */
  claimedVersion?: string;
};

/** Не больше LIMIT заявок с одного адреса за WINDOW_MS. Счетчик в памяти
 *  процесса: сбрасывается при перезапуске сервера и не делится между
 *  несколькими экземплярами, для одного сервера этого достаточно. */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function tooMany(ip: string, now: number): boolean {
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(key);
  }
  return recent.length > LIMIT;
}

/** Адрес клиента из заголовков прокси хостинга. Без прокси заголовок может
 *  подделать сам клиент, поэтому это ограничение частоты, а не защита. */
function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Одна строка: перевод строки в теме письма ломает заголовки. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function mailText(enquiry: Enquiry): string {
  const consentAt = new Date(enquiry.consentAt).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  return [
    `Имя: ${enquiry.name}`,
    `Почта: ${enquiry.email || 'не указана'}`,
    `Телефон: ${enquiry.phone || 'не указан'}`,
    `Направления: ${enquiry.interests.join(', ')}`,
    '',
    `Согласие на обработку персональных данных: да, редакция политики ${enquiry.policyVersion}, ${consentAt} (МСК).`,
    ...(enquiry.claimedVersion
      ? [`Страница при отправке назвала другую редакцию: ${oneLine(enquiry.claimedVersion)}.`]
      : []),
    '',
    enquiry.email ? 'Ответ на это письмо уйдет на почту клиента.' : 'Клиент оставил только телефон.',
  ].join('\n');
}

async function deliver(enquiry: Enquiry): Promise<boolean> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[enquiry] SMTP_USER / SMTP_PASS not set - logging instead:', enquiry);
      return true;
    }
    return false;
  }

  const port = Number(process.env.SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.yandex.ru',
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  // Яндекс принимает письмо только с From, совпадающим с ящиком авторизации,
  // поэтому адрес клиента идет в Reply-To.
  await transport.sendMail({
    from: { name: 'Заявка с сайта', address: user },
    to: process.env.ENQUIRY_TO || user,
    replyTo: enquiry.email || undefined,
    subject: `Заявка с сайта: ${oneLine(enquiry.name)}`,
    text: mailText(enquiry),
  });
  return true;
}

export async function POST(request: Request) {
  if (tooMany(clientIp(request), Date.now())) {
    return NextResponse.json({ ok: false, error: contactCopy.errors.tooMany }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: contactCopy.errors.send }, { status: 400 });
  }

  // Ловушка для ботов: поле website в форме скрыто от людей. Заполнил -
  // отвечаем как обычно, чтобы бот не подстраивался, но письмо не отправляем.
  const trap = (body as Record<string, unknown> | null)?.website;
  if (typeof trap === 'string' && trap.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const checked = checkEnquiry(body);
  if (!checked.ok) {
    // Ошибка - это предложение, а не красная рамка.
    return NextResponse.json({ ok: false, error: checked.error }, { status: 400 });
  }

  // Редакцию политики пишет сервер, а не страница. Раньше поле принималось
  // из тела запроса как есть, и доказательство согласия по 152-ФЗ
  // подделывалось подменой строки (аудит 2026-09-22). Прислала страница что-то
  // другое - это идет в письмо отдельной строкой: так видно и открытую
  // старую вкладку, и подлог, а действующей редакцией остается серверная.
  const sentVersion = (body as Record<string, unknown>).policyVersion;
  const claimed = typeof sentVersion === 'string' ? sentVersion.slice(0, 40) : '';
  const enquiry: Enquiry = {
    ...checked.value,
    policyVersion,
    consentAt: new Date().toISOString(),
    claimedVersion: claimed && claimed !== policyVersion ? claimed : undefined,
  };

  try {
    const delivered = await deliver(enquiry);
    if (!delivered) {
      return NextResponse.json(
        { ok: false, error: contactCopy.errors.delivery },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error('[enquiry] delivery failed:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { ok: false, error: contactCopy.errors.delivery },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
