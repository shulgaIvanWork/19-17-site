'use client';

import Link from 'next/link';
import { useId, type ReactNode } from 'react';
import { consentCopy } from '@/content/legal';
import styles from './Consent.module.css';

type CheckRowProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  required?: boolean;
};

/** Квадрат 4px из системы: светлый без отметки, синий с галочкой. */
export function CheckRow({ checked, onChange, children, required }: CheckRowProps) {
  const id = useId();

  return (
    <div className={styles.row}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        required={required}
      />
      <label htmlFor={id} className={styles.label}>
        <span className={styles.box} aria-hidden="true" />
        <span className={styles.text}>{children}</span>
      </label>
    </div>
  );
}

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Галочка согласия на обработку персональных данных.
 *
 *  Без нее форму отправить нельзя: это правовое основание обработки по 152-ФЗ,
 *  а не украшение. Отметка не проставлена заранее - предварительно отмеченная
 *  галочка согласием не считается. */
export function Consent({ checked, onChange }: Props) {
  return (
    <CheckRow checked={checked} onChange={onChange} required>
      {consentCopy.before}
      <Link href={consentCopy.href} className={styles.link} target="_blank" rel="noopener">
        {consentCopy.linkText}
      </Link>
      {consentCopy.after}
    </CheckRow>
  );
}
