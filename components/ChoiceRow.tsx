'use client';

import styles from './ChoiceRow.module.css';

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

/** Single-select chips. Ash + graphite unselected, Electric Blue + white selected
 *  — one of the accent's four authorised jobs. */
export function ChoiceRow({ label, options, value, onChange }: Props) {
  return (
    <div className={styles.group} role="radiogroup" aria-label={label}>
      <div className={styles.label}>{label}</div>
      <div className={styles.row}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              className={[styles.chip, selected ? styles.selected : ''].filter(Boolean).join(' ')}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
