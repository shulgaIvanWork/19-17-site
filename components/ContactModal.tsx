'use client';

import { useId, useState } from 'react';
import { Button } from './Button';
import { ChoiceRow } from './ChoiceRow';
import { Consent } from './Consent';
import { Field } from './Field';
import { Overlay } from './Overlay';
import { consentCopy, policyVersion } from '@/content/legal';
import { contactCopy } from '@/content/site';
import styles from './ContactModal.module.css';

type Props = {
  interest: string;
  onInterestChange: (value: string) => void;
  onClose: () => void;
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactModal({ interest, onInterestChange, onClose }: Props) {
  const titleId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function send(event: React.FormEvent) {
    event.preventDefault();

    // Правовое основание обработки. Проверяется и здесь, и на сервере.
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
        body: JSON.stringify({ name, email, company, interest, consent, policyVersion }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        // Ошибка — это предложение, а не красная рамка.
        setMessage(result.error ?? 'Отправить не получилось. Попробуйте ещё раз или напишите нам на почту.');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setMessage('Отправить не получилось. Попробуйте ещё раз или напишите нам на почту.');
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
      {/* noValidate: нативные пузыри браузера — это красная рамка, которой в
          системе нет. Проверяем сами и отвечаем предложением. Атрибуты required
          на полях оставлены — их читает скринридер. */}
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

        <div className={styles.fields}>
          <Field
            label="Имя и фамилия"
            name="name"
            value={name}
            onChange={setName}
            placeholder="Введите имя и фамилию"
            autoComplete="name"
            required
          />
          <Field
            label="Рабочая почта"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Введите рабочую почту"
            autoComplete="email"
            required
          />
          <Field
            label="Компания"
            name="company"
            value={company}
            onChange={setCompany}
            placeholder="Введите название компании"
            autoComplete="organization"
            required
          />
          <ChoiceRow
            label={contactCopy.interestLabel}
            options={contactCopy.interests}
            value={interest}
            onChange={onInterestChange}
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
