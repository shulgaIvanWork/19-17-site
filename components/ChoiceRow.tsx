'use client';

import styles from './ChoiceRow.module.css';

type Props = {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
};

/** Independent chips: repeated click removes an option from the selection. */
export function ChoiceRow({ label, options, value, onChange }: Props) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      <div className={styles.label}>{label}</div>
      <div className={styles.row}>
        {options.map((option) => {
          const selected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              className={[styles.chip, selected ? styles.selected : ''].filter(Boolean).join(' ')}
              onClick={() => onChange(selected ? value.filter((item) => item !== option) : [...value, option])}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
