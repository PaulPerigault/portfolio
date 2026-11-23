import { expect, test, type Page } from '@playwright/test';
import { loadContent } from './helpers/content';
import { approach, certificationsOf, HOST, stepCount } from './helpers/milestones';

/** Hauteur de l'en-tête fixe du site : rien ne doit passer dessous (`--site-header-height`). */
const headerHeight = (page: Page) =>
  page
    .locator('header')
    .first()
    .evaluate((e) => e.getBoundingClientRect().height);

const topOf = (page: Page, selector: string) =>
  page.locator(selector).evaluate((e) => Math.round(e.getBoundingClientRect().top));

/** Attend que le défilement lissé d'une ancre soit terminé (position stable 1 s). */
const settled = async (page: Page): Promise<void> => {
  let last = -1;
  await expect
    .poll(
      async () => {
        const y = await page.evaluate(() => Math.round(scrollY));
        const same = y === last;
        last = y;
        return same;
      },
      { intervals: [250, 250, 250, 250, 250], timeout: 15000 },
    )
    .toBe(true);
  await page.waitForTimeout(750);
};

/**
 * L'ancre a atterri : Contact est à l'écran, sous l'en-tête, et ne bouge plus (la piste haute de la
 * scène, insérée en cours de route, le repousserait). La fin de page peut empêcher d'aller plus haut.
 */
const expectLanded = async (page: Page): Promise<void> => {
  const top = await topOf(page, '#contact');
  await page.waitForTimeout(1500);
  expect(await topOf(page, '#contact')).toBe(top);
  expect(top).toBeGreaterThanOrEqual(0);
  await expect(page.locator('#contact')).toBeInViewport();
};

for (const lang of ['fr', 'en'] as const) {
  const ui = loadContent<{ certifications: Record<string, string> }>(lang, 'ui').certifications;

  test.describe(`parcours de certifications, ancres et clavier (${lang})`, () => {
    test('un lien vers Contact, sans geste, ne charge pas la scène et atterrit sous l’en-tête', async ({
      page,
    }) => {
      await page.goto(`/${lang}/`);
      await page.locator(`a[href="/${lang}/#contact"]`).first().click();
      await settled(page);
      await expectLanded(page);
      await expect(page.locator(HOST)).not.toHaveAttribute('data-state', /.+/);
    });

    test('« Passer cette section » reste sous l’en-tête et mène au contact sans saut', async ({
      page,
    }) => {
      await page.goto(`/${lang}/`);
      await approach(page);
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
      await page.locator('[data-pp-track]').evaluate((e) => e.scrollIntoView());
      const skip = page.getByRole('link', { name: ui['skip'] ?? '' });
      await skip.focus();
      expect(await topOf(page, '.pp-milestones__skip')).toBeGreaterThanOrEqual(
        await headerHeight(page),
      );
      await page.keyboard.press('Enter');
      await settled(page);
      await expectLanded(page);
    });

    test('Suivant, Précédent et les flèches changent d’étape, le focus n’est pas piégé', async ({
      page,
    }) => {
      const total = stepCount(certificationsOf(lang));
      await page.goto(`/${lang}/`);
      await approach(page);
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
      const position = page.locator('.pp-milestones__position');
      const text = (current: number) =>
        (ui['progress'] ?? '')
          .replace('{current}', String(current))
          .replace('{total}', String(total));
      await expect(position).toHaveText(text(1));
      await page.getByRole('button', { name: ui['next'] ?? '' }).click();
      await expect(position).toHaveText(text(2));
      // Safari ne donne pas le focus au bouton cliqué : on le place, les flèches s'écoutent sur la section.
      await page.getByRole('button', { name: ui['next'] ?? '' }).focus();
      await page.keyboard.press('ArrowRight');
      await expect(position).toHaveText(text(3));
      await page.keyboard.press('End');
      await expect(position).toHaveText(text(total));
      await page.getByRole('button', { name: ui['previous'] ?? '' }).click();
      await expect(position).toHaveText(text(total - 1));
      await page.keyboard.press('Tab');
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
    });
  });
}
