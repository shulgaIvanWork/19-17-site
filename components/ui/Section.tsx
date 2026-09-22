import type { CSSProperties, ReactNode } from 'react';

type Props = {
  /** Две описанные подложки. Другого фона у полосы не бывает. */
  surface?: 'white' | 'ash';
  /** Снять колонку по ширине, когда полоса сама задает свой контейнер. */
  bare?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Якорь полосы. Нужен блоку услуг на главной: вкладка «Услуги» ведет туда. */
  id?: string;
  children: ReactNode;
};

/** Полоса страницы: вертикальный ритм и колонка содержимого. */
export function Section({ surface = 'white', bare, className, style, id, children }: Props) {
  return (
    <section
      id={id}
      className={['section', surface === 'ash' ? 'section-ash' : '', className].filter(Boolean).join(' ')}
      style={style}
    >
      {bare ? children : <div className="wrap">{children}</div>}
    </section>
  );
}
