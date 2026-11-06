import { expect, test } from '@playwright/test';
import { allowedColors, decorativeStyles, usedColors } from './helpers/design-styles';

for (const lang of ['fr', 'en'] as const) {
  for (const scheme of ['light', 'dark'] as const) {
    test.describe(`charte de design (${lang}, ${scheme})`, () => {
      test.use({ colorScheme: scheme });

      test.beforeEach(async ({ page }) => {
        await page.goto(`/${lang}/`);
      });

      test('aucun dégradé, ombre, flou, filtre ni rayon hors design system', async ({ page }) => {
        expect(await decorativeStyles(page)).toEqual([]);
      });

      test('n’utilise que les couleurs des tokens (un seul accent)', async ({ page }) => {
        const allowed = await allowedColors(page);
        const foreign = (await usedColors(page)).filter((color) => !allowed.includes(color));
        expect(foreign).toEqual([]);
      });

      test('texte en Atkinson Hyperlegible Next chargée, mono réservé au code, aucun serif', async ({
        page,
      }) => {
        const state = await page.evaluate(async () => {
          await document.fonts.ready;
          const faces = [...document.fonts].filter((face) => face.status === 'loaded');
          const families = ['h1', 'h2', 'h3', 'body'].map(
            (selector) => getComputedStyle(document.querySelector(selector) as Element).fontFamily,
          );
          return { families, loaded: faces.map((face) => face.family) };
        });
        for (const family of state.families) {
          expect(family).toContain('Atkinson Hyperlegible Next Variable');
        }
        expect(state.loaded).toContain('Atkinson Hyperlegible Next Variable');
        // Le mono du design system (ADR-0012) : code, identifiants, empreintes, métadonnées seulement.
        const outsideCode = await page.evaluate(() =>
          [...document.querySelectorAll('body, body *')]
            .filter((element) => !element.closest('code, kbd, samp, pre'))
            .filter((element) => {
              const family = getComputedStyle(element).fontFamily.toLowerCase();
              return /mono|serif/.test(family.replace(/sans-serif/g, ''));
            })
            .map((element) => element.tagName.toLowerCase()),
        );
        expect(outsideCode).toEqual([]);
      });

      test('pas de numérotation ni d’étiquette décorative devant les titres', async ({ page }) => {
        for (const title of await page.locator('h2').allTextContents()) {
          expect(title.trim()).not.toMatch(/^\d+\s*[—–-]/);
        }
        const uppercased = await page.evaluate(() =>
          [...document.querySelectorAll('body *')]
            .filter((element) => getComputedStyle(element).textTransform === 'uppercase')
            .map((element) => element.tagName.toLowerCase()),
        );
        expect(uppercased).toEqual([]);
      });

      test('n’affiche aucun emoji', async ({ page }) => {
        const text = await page.locator('body').innerText();
        expect(text).not.toMatch(/\p{Emoji_Presentation}/u);
      });
    });
  }
}
