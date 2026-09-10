'use client';

import { useId, useState } from 'react';
import { Button } from './Button';
import { Consent } from './Consent';
import { ChoiceRow } from './ChoiceRow';
import { Field } from './Field';
import { Overlay } from './Overlay';
import { consentCopy, policyVersion } from '@/content/legal';
import { phoneHref, phoneLabel } from '@/content/nav';
import { contactCopy } from '@/content/site';
import styles from './ContactModal.module.css';

type Props = {
  interests: string[];
  onInterestsChange: (value: string[]) => void;
  onClose: () => void;
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactModal({ interests, onInterestsChange, onClose }: Props) {
  const titleId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function send(event: React.FormEvent) {
    event.preventDefault();

    if (interests.length === 0) {
      setMessage('Выберите хотя бы одно направление.');
      setStatus('error');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setMessage('Укажите почту или номер телефона — достаточно одного.');
      setStatus('error');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage('Проверьте адрес электронной почты.');
      setStatus('error');
      return;
    }

    if (phone.trim() && (phone.trim().length < 6 || phone.trim().length > 40)) {
      setMessage('Проверьте номер телефона.');
      setStatus('error');
      return;
    }

    if (!consent) {
      setMessage(consentCopy.error);
      setStatus('error');
      return;
    }

    setStatus('sending');
    setMessage('');
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          interests,
          consent,
          policyVersion,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        setMessage(result.error ?? 'Отправить не получилось. Попробуйте еще раз.');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setMessage('Отправить не получилось. Попробуйте еще раз.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <Overlay onClose={onClose} labelledBy={titleId} focusOn="sent">
        <div className={styles.confirm} role="status" aria-live="polite">
          <div className={styles.mark} aria-hidden="true" />
          <h2 className="h2" id={titleId} style={{ fontSize: 24, lineHeight: '30px' }}>
            {contactCopy.sentTitle}
          </h2>
          <p className="body" style={{ maxWidth: '34ch' }}>
            {contactCopy.sentBody}
          </p>
          <Button variant="blue" hero onClick={onClose} style={{ marginTop: 8 }}>
            Готово
          </Button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose} labelledBy={titleId} focusOn="form">
      {/* noValidate: нативные подсказки браузера - это та самая красная рамка,
          которой в дизайн-системе нет. Проверяем сами и отвечаем предложением;
          атрибуты required оставлены для скринридера. */}
      <form onSubmit={send} noValidate>
        <div className={styles.head}>
          <h2 className="h2" id={titleId} style={{ fontSize: 24, lineHeight: '30px', marginRight: 'auto' }}>
            {contactCopy.title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <p className="body" style={{ marginTop: 8 }}>
          {contactCopy.body}
        </p>

        <p className={styles.call}>
          {contactCopy.call}{' '}
          <a className={styles.phone} href={phoneHref}>
            {phoneLabel}
          </a>
        </p>

        <div className={styles.fields}>
          <Field
            label="Имя"
            name="name"
            value={name}
            onChange={setName}
            placeholder="Как к вам обращаться"
            autoComplete="name"
            required
          />
          <Field
            label="Почта"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="name@company.ru"
            autoComplete="email"
          />
          <Field
            label="Телефон"
            name="phone"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="+7 (999) 000-00-00"
            autoComplete="tel"
          />
          <p className={styles.hint}>{contactCopy.contactHint}</p>
          <ChoiceRow
            label={contactCopy.interestLabel}
            options={contactCopy.interests}
            value={interests}
            onChange={onInterestsChange}
          />
          <Consent checked={consent} onChange={setConsent} />
        </div>

        {message && (
          <p className="body" role="alert" style={{ marginTop: 20 }}>
            {message}
          </p>
        )}

        <div className={styles.actions}>
          <Button variant="blue" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Отправляем' : 'Отправить заявку'}
          </Button>
          <Button variant="white" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </form>
    </Overlay>
  );
}
