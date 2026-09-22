import { EnquireLink } from '@/components/contact/ContactSalesButton';
import type { Interest } from '@/content/services';
import styles from './PlanFigure.module.css';

type Props = {
  /** Крупное число тарифа. Рисует его класс .figure, закрепленный за текстовой
   *  гарнитурой: у Universal Sans Display цифр нет, только орнамент. */
  figure: string;
  unit: string;
  name: string;
  body: string;
  interest?: Interest;
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
