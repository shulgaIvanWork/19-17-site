'use client';

import Link from 'next/link';
import { useId } from 'react';
import { consentCopy } from '@/content/legal';
import styles from './Consent.module.css';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Галочка согласия на обработку персональных данных.
 *
 *  Без неё форму отправить нельзя: это правовое основание обработки по 152-ФЗ,
 *  а не украшение. Отметка не проставлена заранее — предварительно отмеченная
 *  галочка согласием не считается.
 *
 *  В дизайн-системе чекбокса нет, поэтому собран из её же элементов: квадрат
 *  4px, светлая заливка без отметки и синяя с отметкой — ровно как у чипов
 *  выбора, а синий цвет там разрешён именно как «выбранный вариант». Галочка
 *  внутри нарисована на CSS: набора иконок в системе нет, а состояние нельзя
 *  передавать одним лишь цветом. */
export function Consent({ checked, onChange }: Props) {
  const id = useId();

  return (
    <div className={styles.row}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        required
      />
      <label htmlFor={id} className={styles.label}>
        <span className={styles.box} aria-hidden="true" />
        <span className={styles.text}>
          {consentCopy.before}
          <Link href={consentCopy.href} className={styles.link} target="_blank" rel="noopener">
            {consentCopy.linkText}
          </Link>
          {consentCopy.after}
        </span>
      </label>
    </div>
  );
}
