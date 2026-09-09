import { NextResponse } from 'next/server';
import { consentCopy, policyVersion } from '@/content/legal';
import { contactCopy } from '@/content/site';

/** The site's only backend need: the enquiry behind Send Enquiry.
 *
 *  Delivery is not wired up — no provider credentials exist yet. Set
 *  ENQUIRY_WEBHOOK_URL to post the enquiry somewhere (a Bitrix24 inbound
 *  webhook is the obvious destination, since the firm sells that integration),
 *  or replace deliver() with an SMTP/provider call. Until then the route
 *  validates and logs in development, and refuses in production rather than
 *  swallowing a real enquiry. */

type Enquiry = {
  name: string;
  email: string;
  company: string;
  interest: string;
  /** Отметка согласия на обработку ПДн. Без неё заявка не принимается. */
  consent: true;
  /** Редакция политики, с которой согласился отправитель, и момент согласия —
   *  это и есть доказательство согласия по 152-ФЗ. Храните их вместе с заявкой. */
  policyVersion: string;
  consentAt: string;
};

const MAX = 200;

type ParseResult = { ok: true; enquiry: Enquiry } | { ok: false; error: string };

function parse(body: unknown): ParseResult {
  const invalid = { ok: false as const, error: 'Проверьте имя, рабочую почту и компанию и отправьте ещё раз.' };
  if (typeof body !== 'object' || body === null) return invalid;
  const value = body as Record<string, unknown>;

  const field = (key: string) => {
    const raw = value[key];
    return typeof raw === 'string' ? raw.trim() : '';
  };

  const name = field('name');
  const email = field('email');
  const company = field('company');
  const interest = field('interest');

  if (!name || !email || !company) return invalid;
  if ([name, email, company, interest].some((entry) => entry.length > MAX)) return invalid;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return invalid;
  if (!contactCopy.interests.includes(interest)) return invalid;

  // Согласие проверяется на сервере отдельно: клиентскую проверку можно обойти,
  // а принимать данные без основания нельзя.
  if (value.consent !== true) return { ok: false, error: consentCopy.error };

  return {
    ok: true,
    enquiry: {
      name,
      email,
      company,
      interest,
      consent: true,
      policyVersion: typeof value.policyVersion === 'string' ? value.policyVersion : policyVersion,
      consentAt: new Date().toISOString(),
    },
  };
}

async function deliver(enquiry: Enquiry): Promise<boolean> {
  const url = process.env.ENQUIRY_WEBHOOK_URL;

  if (!url) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[enquiry] no ENQUIRY_WEBHOOK_URL set — logging instead:', enquiry);
      return true;
    }
    return false;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...enquiry, receivedAt: new Date().toISOString() }),
  });

  return response.ok;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Отправить не получилось. Попробуйте ещё раз.' }, { status: 400 });
  }

  const parsed = parse(body);
  if (!parsed.ok) {
    // Ошибка — это предложение, а не красная рамка.
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const delivered = await deliver(parsed.enquiry);
    if (!delivered) {
      return NextResponse.json(
        { ok: false, error: 'Сейчас не удалось принять заявку. Напишите нам на почту, мы её увидим.' },
        { status: 503 },
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Сейчас не удалось принять заявку. Напишите нам на почту, мы её увидим.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
