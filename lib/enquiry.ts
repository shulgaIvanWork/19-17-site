/** Проверка заявки: один модуль для формы и для API.
 *
 *  Раньше одни и те же регулярки и тексты ошибок жили отдельно в ContactModal
 *  и в маршруте API и уже успели разойтись: форма не проверяла имя, а сервер
 *  проверял. Так же в прошлый раз появился баг, когда форма отправляла
 *  направление, которого не было в списке сервера.
 *
 *  Модуль без зависимостей от браузера и Node, его импортируют обе стороны.
 *  Сервер вызывает ту же проверку целиком, включая согласие на обработку ПДн:
 *  клиентскую проверку можно обойти, а принимать данные без правового
 *  основания нельзя. Порядок проверок совпадает с порядком полей в форме. */

import { consentCopy } from '@/content/legal';
import { contactCopy } from '@/content/site';

export type EnquiryInput = {
  name: string;
  email: string;
  phone: string;
  interests: string[];
  consent: true;
};

export type EnquiryCheck = { ok: true; value: EnquiryInput } | { ok: false; error: string };

const MAX = 200;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function checkEnquiry(raw: unknown): EnquiryCheck {
  const errors = contactCopy.errors;
  if (typeof raw !== 'object' || raw === null) return { ok: false, error: errors.name };
  const value = raw as Record<string, unknown>;

  const text = (key: string) => {
    const entry = value[key];
    return typeof entry === 'string' ? entry.trim() : '';
  };

  const name = text('name');
  const email = text('email');
  const phone = text('phone');
  const interests = Array.isArray(value.interests)
    ? value.interests.filter((entry): entry is string => typeof entry === 'string').map((entry) => entry.trim())
    : [];

  if (!name || name.length > MAX) return { ok: false, error: errors.name };
  if (!email && !phone) return { ok: false, error: errors.contact };
  if (email && (email.length > MAX || !EMAIL.test(email))) return { ok: false, error: errors.email };
  if (phone && (phone.length < 6 || phone.length > 40)) return { ok: false, error: errors.phone };
  if (interests.length === 0 || interests.some((interest) => !contactCopy.interests.includes(interest))) {
    return { ok: false, error: errors.interests };
  }
  if (value.consent !== true) return { ok: false, error: consentCopy.error };

  return { ok: true, value: { name, email, phone, interests, consent: true } };
}
