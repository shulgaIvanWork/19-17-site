'use client';

import styles from './Field.module.css';

type Props = {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
};

/** Underline-only input without a visible label (по просьбе заказчика
 *  2026-09-11): label goes to aria-label, so screen readers still name the
 *  field. The rule goes Electric Blue on focus. There is no red border
 *  anywhere: an error is a sentence. */
export function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: Props) {
  return (
    <div className={styles.field}>
      <input
        aria-label={label}
        name={name}
        type={type}
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  );
}
