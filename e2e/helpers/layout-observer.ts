import type { Page } from '@playwright/test';

/** Observateurs CLS et LCP posés avant le chargement (mesures opt-in, jamais en CI). */
interface LayoutShift {
  value: number;
  hadRecentInput: boolean;
  sources: { node: Node | null; previousRect: DOMRect; currentRect: DOMRect }[];
}

export interface Seen {
  cls: number;
  clsInput: number;
  clsSection: number;
  lcp: { time: number; element: string } | null;
  /** Chaque décalage : valeur, élément, rectangle avant puis après. */
  shifts: string[];
}

export async function observe(page: Page, host: string): Promise<void> {
  await page.addInitScript((selector) => {
    const seen: Seen = { cls: 0, clsInput: 0, clsSection: 0, lcp: null, shifts: [] };
    (window as unknown as { __seen: Seen }).__seen = seen;
    const inside = (node: Node | null) =>
      !!node && !!document.querySelector(selector)?.contains(node);
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as unknown as LayoutShift[]) {
        seen.clsInput += e.value;
        if (e.hadRecentInput) continue;
        seen.cls += e.value;
        const box = (r: DOMRect) =>
          `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`;
        for (const source of e.sources) {
          const node = source.node as Element | null;
          const name = node ? `${node.nodeName.toLowerCase()}.${node.className || ''}` : 'null';
          seen.shifts.push(
            `${e.value.toFixed(4)} ${name} ${box(source.previousRect)} > ${box(source.currentRect)}`,
          );
        }
        if (e.sources.some((source) => inside(source.node))) seen.clsSection += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      const last = list.getEntries().at(-1) as unknown as LargestContentfulPaint | undefined;
      if (!last) return;
      const el = last.element;
      const name = el ? `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}` : 'none';
      seen.lcp = { time: Math.round(last.startTime), element: `${name} ${last.url || ''}`.trim() };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }, host);
}

export const read = (page: Page): Promise<Seen> =>
  page.evaluate(() => (window as unknown as { __seen: Seen }).__seen);
