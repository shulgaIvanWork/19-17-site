import { PlanFigure } from './PlanFigure';
import { Section } from '@/components/ui/Section';
import type { Interest } from '@/content/services';
import type { Plan } from '@/content/products';
import styles from './ServiceBand.module.css';

type Props = {
  title: string;
  plans: Plan[];
  interest: Interest;
  note: string;
};

/** Полоса тарифных ориентиров: три карточки с крупным числом и сноска. */
export function PlanBand({ title, plans, interest, note }: Props) {
  return (
    <Section>
      <h2 className="h2">{title}</h2>
      <div className={['g3', 'rail', styles.plans].join(' ')}>
        {plans.map((plan) => (
          <PlanFigure
            key={plan.name}
            figure={plan.figure}
            unit={plan.unit}
            name={plan.name}
            body={plan.body}
            interest={interest}
          />
        ))}
      </div>
      <p className={['footnote', styles.note].join(' ')}>{note}</p>
    </Section>
  );
}
