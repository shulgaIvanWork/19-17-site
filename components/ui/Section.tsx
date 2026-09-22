import type { CSSProperties, ReactNode } from 'react';

type Props = {
  /** The two documented surfaces. Nothing else is a section ground. */
  surface?: 'white' | 'ash';
  /** Drop the max-width wrapper when the band lays out its own container. */
  bare?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Якорь полосы. Нужен блоку услуг на главной: вкладка «Услуги» ведет туда. */
  id?: string;
  children: ReactNode;
};

/** A page band: vertical rhythm plus the content column. */
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
