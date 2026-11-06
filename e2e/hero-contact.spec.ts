import { expect, test } from '@playwright/test';
import { SITE } from '../src/config/site';
import { formCopy } from './helpers/contact';

for (const lang of ['fr', 'en'] as const) {
  const copy = formCopy(lang);
  const button = { fr: /Me contacter/, en: /Get in touch/ }[lang];

  test.describe(`bouton contact du hero (${lang})`, () => {
    test('mène à la section Contact et place le focus sur le premier champ', async ({ page }) => {
      await page.goto(`/${lang}/`);
      await page.getByRole('link', { name: button }).click();
      await expect(page).toHaveURL(new RegExp(`/${lang}/#contact$`));
      await expect(page.getByLabel(copy['name'] ?? '', { exact: true })).toBeFocused();
      await expect(page.locator('#contact')).toBeInViewport();
    });

    test('le focus reste sur le champ quand l’ancre est déjà atteinte', async ({ page }) => {
      await page.goto(`/${lang}/#contact`);
      await page.getByRole('link', { name: button }).click();
      await expect(page.getByLabel(copy['name'] ?? '', { exact: true })).toBeFocused();
    });

    test('à 390 px, le champ focalisé est visible', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await page.goto(`/${lang}/`);
      await page.getByRole('link', { name: button }).click();
      const name = page.getByLabel(copy['name'] ?? '', { exact: true });
      await expect(name).toBeFocused();
      await expect(name).toBeInViewport();
    });

    test.describe('sans JavaScript', () => {
      test.use({ javaScriptEnabled: false });

      test('le bouton garde l’ancre et la section garde le lien e-mail', async ({ page }) => {
        await page.goto(`/${lang}/`);
        await expect(page.getByRole('link', { name: button })).toHaveAttribute(
          'href',
          `/${lang}/#contact`,
        );
        await expect(page.locator('#contact a[href^="mailto:"]')).toHaveAttribute(
          'href',
          `mailto:${SITE.email}`,
        );
      });
    });
  });
}
