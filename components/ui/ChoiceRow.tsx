'use client';

import styles from './ChoiceRow.module.css';

type Props<T extends string> = {
  label: string;
  options: readonly T[];
  value: T[];
  onChange: (value: T[]) => void;
};

/** Независимые чипы: повторное нажатие снимает выбор.
 *
 *  Параметр типа держит связь со списком вариантов: форма заявки передает сюда
 *  темы из реестра услуг, и обратно приходят они же, а не произвольные строки. */
export function ChoiceRow<T extends string>({ label, options, value, onChange }: Props<T>) {
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
