'use client';

import { Button } from '@/components/ui/Button';
import { TextButton } from '@/components/ui/TextLink';
import type { Interest } from '@/content/services';
import { useContact } from './ContactContext';

/** Синяя основная кнопка. Одна на полосу - второй основной кнопки система не допускает. */
export function ContactSalesButton({
  hero,
  label = 'Обсудить задачу',
  interest,
}: {
  hero?: boolean;
  label?: string;
  interest?: Interest;
}) {
  const { open } = useContact();
  return (
    <Button variant="blue" hero={hero} onClick={() => open(interest)}>
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
  interest?: Interest;
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
