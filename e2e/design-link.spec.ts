import { expect, test } from '@playwright/test';
import { SITE } from '../src/config/site';

const LINK_NAME = /^Design system \(.+\)$/;
const NEW_TAB = { fr: 's’ouvre dans un nouvel onglet', en: 'opens in a new tab' } as const;

for (const lang of ['fr', 'en'] as const) {
  test.describe(`lien vers le design system (${lang})`, () => {
    test('le pied de page renvoie à la documentation, dans un nouvel onglet signalé', async ({
      page,
    }) => {
      await page.goto(`/${lang}/`);
      const link = page.getByRole('contentinfo').getByRole('link', { name: LINK_NAME });
      await expect(link).toHaveAttribute('href', SITE.designSystemUrl);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(link).toContainText(NEW_TAB[lang]);
    });
  });
}

test('l’alias racine contient le lien lu sans JavaScript par le contrôle réciproque', async ({
  request,
}) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain(`<a href="${SITE.designSystemUrl}">`);
});
