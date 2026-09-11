'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Consent } from './Consent';
import { ChoiceRow } from '@/components/ui/ChoiceRow';
import { Field } from '@/components/ui/Field';
import { Overlay } from '@/components/ui/Overlay';
import { policyVersion } from '@/content/legal';
import { phoneHref, phoneLabel } from '@/content/nav';
import { contactCopy } from '@/content/site';
import { checkEnquiry } from '@/lib/enquiry';
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
  const [trap, setTrap] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function send(event: React.FormEvent) {
    event.preventDefault();

    // Та же проверка, что на сервере (lib/enquiry): одни правила и одни тексты.
    const checked = checkEnquiry({ name, email, phone, interests, consent });
    if (!checked.ok) {
      setMessage(checked.error);
      setStatus('error');
      return;
    }

    setStatus('sending');
    setMessage('');
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...checked.value, policyVersion, website: trap }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        setMessage(result.error ?? contactCopy.errors.send);
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setMessage(contactCopy.errors.send);
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

        {/* Ловушка для ботов: поле убрано за край экрана, из порядка табуляции
            и от скринридера, его заполняют только автоматические отправители.
            Сервер отвечает на такую заявку успехом, но письмо не отправляет. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={trap}
          onChange={(event) => setTrap(event.target.value)}
          style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }}
        />

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
