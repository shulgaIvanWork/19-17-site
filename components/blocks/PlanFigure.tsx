import { EnquireLink } from '@/components/contact/ContactSalesButton';
import styles from './PlanFigure.module.css';

type Props = {
  /** The promotional numeral. Rendered by .figure, which is locked to the text
   *  face: Universal Sans Display has no digits, only a watermark ornament. */
  figure: string;
  unit: string;
  name: string;
  body: string;
  interest?: string;
};

export function PlanFigure({ figure, unit, name, body, interest }: Props) {
  return (
    <div className={['railcard', styles.plan].join(' ')}>
      <div className="figure">{figure}</div>
      <div className="label" style={{ marginTop: 4 }}>
        {unit}
      </div>
      <h3 className="h3" style={{ marginTop: 20 }}>
        {name}
      </h3>
      <p className="body" style={{ marginTop: 8 }}>
        {body}
      </p>
      <div style={{ marginTop: 16 }}>
        <EnquireLink interest={interest} className="actionlink" />
      </div>
    </div>
  );
}
