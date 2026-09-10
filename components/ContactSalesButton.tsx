'use client';

import { Button } from './Button';
import { TextButton } from './TextLink';
import { useContact } from './ContactContext';

/** Синяя основная кнопка. Одна на полосу — второй основной кнопки система не допускает. */
export function ContactSalesButton({
  hero,
  label = 'Обсудить задачу',
  interest,
}: {
  hero?: boolean;
  label?: string;
  interest?: string;
}) {
  const { open } = useContact();
  return (
    <Button variant="blue" hero={hero} onClick={() => open(interest)}>
      {label}
    </Button>
  );
}

/** Белая или светлая кнопка, открывающая ту же форму. */
export function ContactQuietButton({
  label,
  variant = 'white',
  interest,
}: {
  label: string;
  variant?: 'white' | 'ash';
  interest?: string;
}) {
  const { open } = useContact();
  return (
    <Button variant={variant} onClick={() => open(interest)}>
      {label}
    </Button>
  );
}

/** Текстовая ссылка рядом с тарифом или карточкой. */
export function EnquireLink({
  interest,
  label = 'Обсудить задачу',
  className,
}: {
  interest?: string;
  label?: string;
  className?: string;
}) {
  const { open } = useContact();
  return (
    <TextButton className={className} onClick={() => open(interest)}>
      {label}
    </TextButton>
  );
}
