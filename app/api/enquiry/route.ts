import { NextResponse } from 'next/server';
import { policyVersion } from '@/content/legal';
import { contactCopy } from '@/content/site';
import { checkEnquiry, type EnquiryInput } from '@/lib/enquiry';

/** The site's only backend need: the enquiry behind Send Enquiry.
 *
 *  Delivery is not wired up - no provider credentials exist yet. Set
 *  ENQUIRY_WEBHOOK_URL to post the enquiry somewhere (a Bitrix24 inbound
 *  webhook is the obvious destination, since the firm sells that integration),
 *  or replace deliver() with an SMTP/provider call. Until then the route
 *  validates and logs in development, and refuses in production rather than
 *  swallowing a real enquiry. */

type Enquiry = EnquiryInput & {
  /** Редакция политики, с которой согласился отправитель, и момент согласия -
   *  это и есть доказательство согласия по 152-ФЗ. Храните их вместе с заявкой. */
  policyVersion: string;
  consentAt: string;
};

async function deliver(enquiry: Enquiry): Promise<boolean> {
  const url = process.env.ENQUIRY_WEBHOOK_URL;

  if (!url) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[enquiry] no ENQUIRY_WEBHOOK_URL set - logging instead:', enquiry);
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
    return NextResponse.json({ ok: false, error: contactCopy.errors.send }, { status: 400 });
  }

  const checked = checkEnquiry(body);
  if (!checked.ok) {
    // Ошибка - это предложение, а не красная рамка.
    return NextResponse.json({ ok: false, error: checked.error }, { status: 400 });
  }

  const sentVersion = (body as Record<string, unknown>).policyVersion;
  const enquiry: Enquiry = {
    ...checked.value,
    policyVersion: typeof sentVersion === 'string' ? sentVersion : policyVersion,
    consentAt: new Date().toISOString(),
  };

  try {
    const delivered = await deliver(enquiry);
    if (!delivered) {
      return NextResponse.json(
        { ok: false, error: contactCopy.errors.delivery },
        { status: 503 },
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: contactCopy.errors.delivery },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
