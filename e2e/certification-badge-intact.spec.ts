import { expect, test, type Page } from '@playwright/test';
import { approach, certificationsOf, HOST } from './helpers/milestones';

/** Contrat ADR-0014 : le badge est l'image de l'émetteur, de face, posée par translation et échelle. */
interface Measure {
  src: string;
  alt: string | null;
  hidden: boolean;
  matrix: number[];
  filter: string;
  opacity: string;
  ratio: number;
  natural: number;
  width: number;
}

const SPRITES = `${HOST} .pp-milestones__sprites`;

const measure = (page: Page, src: string): Promise<Measure | null> =>
  page.locator(`${SPRITES} img[src="${src}"]`).evaluate((node) => {
    const image = node as HTMLImageElement;
    const style = getComputedStyle(image);
    const rect = image.getBoundingClientRect();
    const raw = style.transform === 'none' ? 'matrix(1, 0, 0, 1, 0, 0)' : style.transform;
    const matrix = raw
      .replace(/^matrix\(|\)$/g, '')
      .split(',')
      .map(Number);
    return {
      src: image.getAttribute('src') ?? '',
      alt: image.getAttribute('alt'),
      hidden: image.hasAttribute('data-hidden'),
      matrix,
      filter: style.filter,
      opacity: style.opacity,
      ratio: rect.width / rect.height,
      natural: image.naturalWidth / image.naturalHeight,
      width: rect.width,
    };
  });

const TOLERANCE = 0.01;
const EPSILON = 1e-6;

/** Ce que ADR-0014 garantit : de face (ni rotation ni biais), échelle uniforme, ni filtre ni voile. */
const facts = (m: Measure) => {
  const [a = NaN, b = NaN, c = NaN, d = NaN] = m.matrix;
  return {
    alt: m.alt,
    noRotationOrSkew: Math.abs(b) < EPSILON && Math.abs(c) < EPSILON,
    uniformScale: Math.abs(a / d - 1) < TOLERANCE,
    filter: m.filter,
    opacity: m.opacity,
    naturalAspect: Math.abs(m.ratio / m.natural - 1) < TOLERANCE,
    sized: m.width > 0,
  };
};

const INTACT = {
  alt: '',
  noRotationOrSkew: true,
  uniformScale: true,
  filter: 'none',
  opacity: '1',
  naturalAspect: true,
  sized: true,
};

for (const lang of ['fr', 'en'] as const) {
  const achieved = certificationsOf(lang).items.filter((item) => item.badge);

  test.describe(`badges de la scène 3D (${lang})`, () => {
    test('chaque badge actif est intact : sans rotation ni biais, filtre ni opacité', async ({
      page,
    }) => {
      await page.goto(`/${lang}/`);
      await approach(page);
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
      await expect(page.locator(SPRITES)).toHaveAttribute('aria-hidden', 'true');
      for (const item of achieved) {
        const src = item.badge?.src ?? '';
        await page.locator(`${HOST} [data-pp-item="${item.id}"] button`).click();
        await expect
          .poll(async () => (await measure(page, src))?.hidden, { timeout: 10000 })
          .toBe(false);
        const shown = await measure(page, src);
        expect(shown && facts(shown)).toEqual(INTACT);
      }
    });
  });
}
