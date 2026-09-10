'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const REVEAL =
  'main .h1, main .h2, main .h3, main .lede, main .figure, main .gcards > *, main .g3 > *, main .g4 > *, main .g2 > *, footer .brand, footer .group';

/** Полоса прогресса и появление блоков при прокрутке. Герой не трогает. */
export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    let frame: number | null = null;
    const writeScrollProgress = () => {
      frame = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / max));
      document.documentElement.style.setProperty('--scroll', ratio.toFixed(4));
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(writeScrollProgress);
    };
    writeScrollProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter(
      (node) => !node.closest('[data-hero]'),
    );

    const inView = (node: HTMLElement) => node.getBoundingClientRect().top < window.innerHeight * 0.92;

    nodes.forEach((node, index) => {
      const siblings = node.parentElement ? Array.from(node.parentElement.children) : [];
      const order = siblings.indexOf(node);
      node.style.setProperty('--reveal-i', String(Math.min(order >= 0 ? order : index, 5)));
      if (inView(node)) {
        node.classList.add('is-in');
        return;
      }
      node.classList.add('reveal');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -6% 0px' },
    );

    nodes.forEach((node) => {
      if (node.classList.contains('reveal') && !node.classList.contains('is-in')) observer.observe(node);
    });

    return () => {
      observer.disconnect();
      nodes.forEach((node) => {
        node.classList.remove('reveal', 'is-in');
        node.style.removeProperty('--reveal-i');
      });
    };
  }, [pathname]);

  return null;
}
