import type { Metadata } from 'next';
import { Hero } from '@/components/hero/Hero';
import { Section } from '@/components/ui/Section';
import { LegacyHashRedirect } from './LegacyHashRedirect';
import { ServiceGrid } from '@/components/blocks/ServiceGrid';
import { heroes, serviceMeta } from '@/content/site';

export const metadata: Metadata = serviceMeta.services;

/** Витрина услуг. Сюда ведет вкладка «Услуги» в шапке: панель с группами
 *  раскрывается при наведении, но нажатие на саму вкладку должно давать
 *  страницу, а не первую попавшуюся услугу. */
export default function ServicesPage() {
  return (
    <>
      <LegacyHashRedirect />
      <Hero copy={heroes.services} object="sites" />

      <Section>
        <ServiceGrid />
      </Section>
    </>
  );
}
