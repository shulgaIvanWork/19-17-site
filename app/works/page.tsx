import type { Metadata } from 'next';
import { Hero } from '@/components/hero/Hero';
import { Section } from '@/components/ui/Section';
import { ProjectFlow } from '@/components/blocks/ProjectFlow';
import { WorksGallery } from '@/components/blocks/WorksGallery';
import { heroes } from '@/content/site';
import { works, worksBand } from '@/content/works';

export const metadata: Metadata = {
  title: 'Работы',
  description:
    'Сайты и лендинги, которые мы спроектировали и собрали: структура, подбор материалов, оформление и готовые экраны.',
};

export default function WorksPage() {
  return (
    <>
      <Hero copy={heroes.works} object="works" />

      <Section>
        <WorksGallery works={works} />
      </Section>

      <Section surface="ash">
        <h2 className="h2" style={{ maxWidth: '20ch' }}>
          {worksBand.title}
        </h2>
        <p className="body" style={{ marginTop: 16, maxWidth: '54ch' }}>
          {worksBand.body}
        </p>
        {/* Разбор одной работы по листам: то же, что описано выше, но на
            реальном проекте - от задачи до готовой страницы. */}
        <ProjectFlow plan={worksBand.plan} />
      </Section>
    </>
  );
}
