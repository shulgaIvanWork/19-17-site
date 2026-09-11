import type { Metadata } from 'next';
import { ScenePanel } from '@/components/scenes/BandArt';
import { CompareTable } from '@/components/blocks/CompareTable';
import { ContactQuietButton, ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { Hero } from '@/components/hero/Hero';
import { NumberedClaim } from '@/components/blocks/NumberedClaim';
import { PlanFigure } from '@/components/blocks/PlanFigure';
import { Section } from '@/components/ui/Section';
import { TwoColList } from '@/components/blocks/TwoColList';
import {
  crmBands,
  crmFeatures,
  crmPackages,
  crmSystems,
  onecAreas,
  onecBands,
  onecFeatures,
  onecPackages,
  pagesAreas,
  pagesBand,
  pagesFeatures,
  redesignAreas,
  redesignBands,
  redesignFeatures,
  storeAreas,
  storeBands,
  storeFeatures,
  storePlans,
  supportBand,
  supportFeatures,
  supportRows,
  webBand,
  webFeatures,
  webRows,
  webTierNames,
} from '@/content/products';
import { footnotes, heroes } from '@/content/site';

export const metadata: Metadata = {
  title: 'Сайты',
  description:
    'Лендинг, многостраничный сайт, магазин, обновление и поддержка, интеграции с 1С и CRM: проектирование, запуск и сопровождение.',
};

const webHeaders: [string, string, string, string] = ['', ...(webTierNames as [string, string, string])];
const webCompare = webRows.map((row) => [row.k, row.a, row.b, row.c] as [string, string, string, string]);
const supportCompare = supportRows.map((row) => [row.k, row.a, row.b, row.c] as [string, string, string, string]);

export default function WebsitesPage() {
  return (
    <>
      <Hero id="landing" copy={heroes.websites} object="sites" />

      <Section>
        <div className="g4">
          {webFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <h2 className="h2">{webBand.title}</h2>
        <p className="body" style={{ marginTop: 12, maxWidth: '44ch' }}>
          {webBand.body}
        </p>
        <div style={{ marginTop: 44 }}>
          <CompareTable headers={webHeaders} rows={webCompare} headerStyle="h3" caption="Сравнение форматов работы" />
        </div>
        <p className="footnote" style={{ marginTop: 20 }}>
          {footnotes.websites}
        </p>
      </Section>

      <Hero id="multipage" copy={heroes.pages} object="pages" />

      <Section>
        <div className="g4">
          {pagesFeatures.map((feature) => (
            <NumberedClaim key={`pages-${feature.num}`} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="pagesSite" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {pagesBand.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {pagesBand.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={pagesBand.cta} interest="Создание сайта" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={pagesAreas} caption="Состав многостраничного сайта" />
            </div>
          </div>
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.pages}
        </p>
      </Section>

      <Hero id="marketplace" copy={heroes.store} object="store" />

      <Section>
        <div className="g4">
          {storeFeatures.map((feature) => (
            <NumberedClaim key={`store-${feature.num}`} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="storeFloor" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {storeBands.handles.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {storeBands.handles.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={storeBands.handles.cta} interest="Интернет-магазин" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={storeAreas} caption="Состав интернет-магазина" />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="h2">{storeBands.sized.title}</h2>
        <div className="g3" style={{ marginTop: 52 }}>
          {storePlans.map((plan) => (
            <PlanFigure
              key={plan.name}
              figure={plan.skus}
              unit="Товаров в каталоге"
              name={plan.name}
              body={plan.body}
              interest="Интернет-магазин"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.store}
        </p>
      </Section>

      <Hero id="redesign" copy={heroes.redesign} object="update" />

      <Section>
        <div className="g4">
          {redesignFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="auditSheet" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {redesignBands.audit.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {redesignBands.audit.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactSalesButton label={redesignBands.audit.cta} interest="Обновление сайта" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={redesignAreas} caption="Что проверяем во время аудита" />
            </div>
          </div>
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.redesign}
        </p>
      </Section>

      <Hero id="support" copy={heroes.support} object="support" />

      <Section>
        <div className="g4">
          {supportFeatures.map((feature) => (
            <NumberedClaim key={`support-${feature.num}`} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <h2 className="h2">{supportBand.title}</h2>
        <p className="body" style={{ marginTop: 12, maxWidth: '44ch' }}>
          {supportBand.body}
        </p>
        <div style={{ marginTop: 44 }}>
          <CompareTable headers={webHeaders} rows={supportCompare} headerStyle="h3" caption="Сравнение форматов поддержки" />
        </div>
        <p className="footnote" style={{ marginTop: 20 }}>
          {footnotes.support}
        </p>
      </Section>

      <Hero id="onec" copy={heroes.onec} object="onec" />

      <Section>
        <div className="g4">
          {onecFeatures.map((feature) => (
            <NumberedClaim key={feature.num} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="onecSwap" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {onecBands.exchange.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {onecBands.exchange.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={onecBands.exchange.cta} interest="Интеграция с 1С" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={onecAreas} caption="Какие данные передаем" />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="h2">{onecBands.priced.title}</h2>
        <div className="g3" style={{ marginTop: 52 }}>
          {onecPackages.map((pkg) => (
            <PlanFigure
              key={pkg.name}
              figure={pkg.count}
              unit={pkg.unit}
              name={pkg.name}
              body={pkg.body}
              interest="Интеграция с 1С"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.integrations}
        </p>
      </Section>

      <Hero id="crm" copy={heroes.crm} object="crm" />

      <Section>
        <div className="g4">
          {crmFeatures.map((feature) => (
            <NumberedClaim key={`crm-${feature.num}`} claim={feature} />
          ))}
        </div>
      </Section>

      <Section surface="ash">
        <div className="g2" style={{ gap: 'clamp(32px, 5vw, 88px)', alignItems: 'start' }}>
          <ScenePanel kind="crmPipe" />
          <div>
            <h2 className="h2" style={{ maxWidth: '18ch' }}>
              {crmBands.connect.title}
            </h2>
            <p className="body" style={{ marginTop: 16, maxWidth: '42ch' }}>
              {crmBands.connect.body}
            </p>
            <div style={{ marginTop: 24 }}>
              <ContactQuietButton label={crmBands.connect.cta} interest="Интеграция с CRM" />
            </div>
            <div style={{ marginTop: 40 }}>
              <TwoColList rows={crmSystems} caption="Системы, которые подключаем" />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="h2">{crmBands.priced.title}</h2>
        <div className="g3" style={{ marginTop: 52 }}>
          {crmPackages.map((pkg) => (
            <PlanFigure
              key={pkg.name}
              figure={pkg.count}
              unit={pkg.unit}
              name={pkg.name}
              body={pkg.body}
              interest="Интеграция с CRM"
            />
          ))}
        </div>
        <p className="footnote" style={{ marginTop: 36, maxWidth: '62ch' }}>
          {footnotes.integrations}
        </p>
      </Section>
    </>
  );
}
