import { expect, test, type Page } from '@playwright/test';
import { approach, certificationsOf, HOST, stepCount } from './helpers/milestones';

/** Chaque repli laisse la liste complète, sans canvas ni état amélioré, avec la même hauteur de liste. */
const expectClassic = async (page: Page, lang: 'fr' | 'en'): Promise<void> => {
  await expect(page.locator(`${HOST} [data-pp-item]`)).toHaveCount(
    stepCount(certificationsOf(lang)),
  );
  await expect(page.locator(`${HOST} canvas`)).toHaveCount(0);
  await expect(page.locator(HOST)).not.toHaveAttribute('data-state', 'enhanced');
  await expect(page.locator(`${HOST} [data-pp-item] button`)).toHaveCount(0);
};

const listHeight = (page: Page) =>
  page.locator(`${HOST} [data-pp-list]`).evaluate((e) => e.getBoundingClientRect().height);

for (const lang of ['fr', 'en'] as const) {
  test.describe(`repli sur la liste classique (${lang})`, () => {
    test('mouvement réduit : la scène reste, en étapes, sans piste haute', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`/${lang}/`);
      await approach(page);
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
      await expect(page.locator(HOST)).toHaveAttribute('data-mode', 'steps');
      await expect(page.locator(`${HOST} [data-pp-track]`)).not.toHaveAttribute('style', /steps/);
    });

    test('économie de données (saveData) : aucun .wasm demandé', async ({ page }) => {
      const requested: string[] = [];
      page.on('request', (request) => requested.push(request.url()));
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'connection', { value: { saveData: true } });
      });
      await page.goto(`/${lang}/`);
      await approach(page);
      await page.waitForTimeout(800);
      await expectClassic(page, lang);
      expect(requested.filter((url) => /\.wasm$|milestones/.test(url))).toEqual([]);
    });

    test('WebGL2 absent : la scène est retirée', async ({ page }) => {
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          this: HTMLCanvasElement,
          type: string,
          ...rest: unknown[]
        ) {
          return type === 'webgl2' ? null : Reflect.apply(original, this, [type, ...rest]);
        } as typeof original;
      });
      await page.goto(`/${lang}/`);
      const before = await listHeight(page);
      await approach(page);
      await page.waitForTimeout(800);
      await expectClassic(page, lang);
      expect(await listHeight(page)).toBe(before);
    });

    test('perte du contexte WebGL sans restauration : retour à la liste', async ({ page }) => {
      await page.goto(`/${lang}/`);
      const before = await listHeight(page);
      await approach(page);
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
      await page.locator(`${HOST} canvas`).evaluate((canvas: HTMLCanvasElement) => {
        canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
      });
      await expect(page.locator(`${HOST} canvas`)).toHaveCount(0, { timeout: 6000 });
      await expectClassic(page, lang);
      expect(await listHeight(page)).toBe(before);
    });
  });
}
