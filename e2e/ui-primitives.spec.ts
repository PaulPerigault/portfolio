import { expect, test } from '@playwright/test';

const NEW_TAB = { fr: "s'ouvre dans un nouvel onglet", en: 'opens in a new tab' } as const;

// Les primitives n'ont plus de vitrine : leurs contrats sont vérifiés sur les vraies pages.
for (const lang of ['fr', 'en'] as const) {
  for (const path of [`/${lang}/`, `/${lang}/legal/`]) {
    test.describe(`primitives UI sur ${path}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(path);
      });

      test('les niveaux de titre sont sémantiques et sans saut', async ({ page }) => {
        const levels = await page
          .locator('h1, h2, h3, h4')
          .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))));
        expect(levels[0]).toBe(1);
        expect(levels.filter((level) => level === 1)).toHaveLength(1);
        levels.slice(1).forEach((level, index) => {
          expect(level - (levels[index] as number)).toBeLessThanOrEqual(1);
        });
      });

      test('chaque section est un repère nommé par son titre', async ({ page }) => {
        const sections = page.locator('main section[aria-labelledby]');
        expect(await sections.count()).toBeGreaterThan(0);
        for (const section of await sections.all()) {
          const titleId = (await section.getAttribute('aria-labelledby')) as string;
          const title = (await page.locator(`#${titleId}`).innerText()).trim();
          await expect(page.getByRole('region', { name: title, exact: true })).toBeVisible();
        }
      });

      test('les liens externes sont sûrs et annoncent le nouvel onglet', async ({ page }) => {
        for (const link of await page.locator('a[href^="http"]').all()) {
          await expect(link).toHaveAttribute('target', '_blank');
          await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
          await expect(link).toContainText(NEW_TAB[lang]);
        }
      });

      test('mailto, ancres et liens internes ne changent pas d’onglet', async ({ page }) => {
        const same = page.locator('a[href^="mailto:"], a[href^="/"], a[href^="#"]');
        for (const link of await same.all()) {
          await expect(link).not.toHaveAttribute('target', /.+/);
        }
      });

      test('toutes les icônes sont décoratives', async ({ page }) => {
        const total = await page.locator('svg').count();
        await expect(page.locator('svg[aria-hidden="true"]')).toHaveCount(total);
      });
    });
  }

  // Garde les tests ci-dessus de passer à vide : la page d'accueil contient des liens externes et
  // des icônes, et la chronologie garde ses dates machine.
  test(`la page d’accueil contient liens externes, icônes et chronologie datée (${lang})`, async ({
    page,
  }) => {
    await page.goto(`/${lang}/`);
    expect(await page.locator('main a[href^="http"]').count()).toBeGreaterThan(0);
    expect(await page.locator('svg').count()).toBeGreaterThan(0);
    expect(await page.locator('main ol > li time[datetime]').count()).toBeGreaterThan(0);
  });

  test(`la navigation clavier garde un focus visible sur les mentions légales (${lang})`, async ({
    page,
  }) => {
    await page.goto(`/${lang}/legal/`);
    const stops = await page.locator('a:visible, button:visible').count();
    for (let index = 0; index < stops; index += 1) {
      await page.keyboard.press('Tab');
      const outline = await page.evaluate(() => {
        const style = getComputedStyle(document.activeElement as Element);
        return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
      });
      expect(outline.style).not.toBe('none');
      expect(outline.width).toBeGreaterThan(0);
    }
  });
}
