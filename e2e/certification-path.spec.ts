import { expect, test } from '@playwright/test';
import { loadContent, type TestLang } from './helpers/content';
import { certificationsOf, HOST, labelOf } from './helpers/milestones';

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
      await expect(rows).toHaveCount(items.length);
      for (const [index, item] of items.entries()) {
        const row = rows.nth(index);
        await expect(row).toContainText(labelOf(item));
        await expect(row).toContainText(item.issuer);
        await expect(row).toContainText(
          item.status === 'achieved' ? (ui['achieved'] ?? '') : (ui['planned'] ?? ''),
        );
        if (item.date) await expect(row.locator('time')).toHaveAttribute('datetime', item.date);
        else await expect(row.locator('time')).toHaveCount(0);
      }
      await expect(page.locator('[data-pp-goal]')).toContainText(goal.label);
    });

    test('seules les certifications obtenues ont un lien de vérification Credly', async ({
      page,
    }) => {
      const { items } = certificationsOf(lang);
      await page.goto(`/${lang}/`);
      const rows = page.locator(`${HOST} [data-pp-item]`);
      for (const [index, item] of items.entries()) {
        const link = rows.nth(index).getByRole('link');
        if (item.verifyUrl) {
          await expect(link).toHaveAttribute('href', item.verifyUrl);
          await expect(link).not.toHaveAttribute('target', /.+/);
          await expect(link).toHaveAccessibleName(`${ui['verify']} : ${labelOf(item)}`);
        } else await expect(link).toHaveCount(0);
      }
      expect(items.filter((item) => item.status === 'planned').every((i) => !i.verifyUrl)).toBe(
        true,
      );
    });
  });

  test.describe(`parcours de certifications, sans JavaScript (${lang})`, () => {
    test.use({ javaScriptEnabled: false });

    test('la liste est complète et aucune scène n’est ajoutée', async ({ page }) => {
      await page.goto(`/${lang}/`);
      await expect(page.locator(`${HOST} [data-pp-item]`)).toHaveCount(
        certificationsOf(lang).items.length,
      );
      await expect(page.locator(`${HOST} canvas`)).toHaveCount(0);
      await expect(page.locator(`${HOST} [data-pp-stage]`)).toBeHidden();
    });
  });
}
