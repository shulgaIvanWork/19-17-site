/** Круглая галочка списков. Одна на весь сайт: состав работ в карточке тарифа
 *  и пункты полос на главной отмечаются одним и тем же знаком. Размер и цвет
 *  задает вызывающий через className. */
export function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7.1" fill="none" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M4.6 8.15 L7.05 10.5 L11.45 5.55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
