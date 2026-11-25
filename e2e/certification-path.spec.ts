import { expect, test } from '@playwright/test';
import { loadContent, type TestLang } from './helpers/content';
import { certificationsOf, HOST, stepCount } from './helpers/milestones';

const REGION: Record<TestLang, string> = {
  fr: 'Parcours de certifications',
  en: 'Certification path',
};

for (const lang of ['fr', 'en'] as const) {
  const ui = loadContent<{ certifications: Record<string, string> }>(lang, 'ui').certifications;

  test.describe(`parcours de certifications, liste (${lang})`, () => {
    test('la liste reprend les données, dans l’ordre, avec statut, date et objectif', async ({
      page,
    }) => {
      const { items, goal } = certificationsOf(lang);
      await page.goto(`/${lang}/`);
      const list = page.getByRole('region', { name: REGION[lang] }).getByRole('list');
      const rows = list.getByRole('listitem');
      await expect(rows).toHaveCount(stepCount({ items, goal }));
      for (const [index, item] of items.entries()) {
        const row = rows.nth(index);
        await expect(row).toContainText(item.name);
        await expect(row).toContainText(item.issuer);
        if (item.code) await expect(row).toContainText(item.code);
        await expect(row).toContainText(
          item.status === 'achieved' ? (ui['achieved'] ?? '') : (ui['planned'] ?? ''),
        );
        if (item.date) await expect(row.locator('time')).toHaveAttribute('datetime', item.date);
        else await expect(row.locator('time')).toHaveCount(0);
      }
      await expect(rows.last()).toContainText(goal.label);
      await expect(page.locator('[data-pp-goal]')).toContainText(ui['goal'] ?? '');
    });

    test('seules les obtenues ont un lien Credly, en nouvel onglet', async ({ page }) => {
      const { items } = certificationsOf(lang);
      const hint = loadContent<{ a11y: { new_tab: string } }>(lang, 'ui').a11y.new_tab;
      await page.goto(`/${lang}/`);
      const rows = page.locator(`${HOST} [data-pp-item]`);
      for (const [index, item] of items.entries()) {
        const link = rows.nth(index).getByRole('link');
        if (item.verifyUrl) {
          await expect(link).toHaveAttribute('href', item.verifyUrl);
          await expect(link).toHaveAttribute('target', '_blank');
          await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
          await expect(link).toHaveAccessibleName(`${ui['verify']} : ${item.name} (${hint})`);
        } else await expect(link).toHaveCount(0);
      }
    });

    test('le badge de l’émetteur est affiché intact, aucun badge pour une planifiée', async ({
      page,
    }) => {
      const { items } = certificationsOf(lang);
      // Liste classique (économie de données : empreinte levée) : c'est elle qui montre ces images.
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'connection', { value: { saveData: true } });
      });
      await page.goto(`/${lang}/`);
      const rows = page.locator(`${HOST} [data-pp-item]`);
      for (const [index, item] of items.entries()) {
        const image = rows.nth(index).locator('img');
        if (!item.badge) {
          await expect(image).toHaveCount(0);
          continue;
        }
        await expect(image).toHaveAttribute('src', item.badge.src);
        // Le défilement de Playwright est sans effet dans WebKit (html défile en douceur) : instantané.
        await image.evaluate((img) => img.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await expect
          .poll(() =>
            image.evaluate((img: HTMLImageElement) => [img.naturalWidth, img.naturalHeight]),
          )
          .toEqual([item.badge.width, item.badge.height]);
      }
    });
  });

  test.describe(`parcours de certifications, sans JavaScript (${lang})`, () => {
    test.use({ javaScriptEnabled: false });

    test('la liste est complète et aucune scène n’est ajoutée', async ({ page }) => {
      await page.goto(`/${lang}/`);
      await expect(page.locator(`${HOST} [data-pp-item]`)).toHaveCount(
        stepCount(certificationsOf(lang)),
      );
      await expect(page.locator(`${HOST} canvas`)).toHaveCount(0);
      await expect(page.locator(`${HOST} [data-pp-stage]`)).toBeHidden();
    });
  });
}
