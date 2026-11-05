import { describe, expect, it } from 'vitest';
import LangSwitch from '@/components/layout/LangSwitch.astro';
import { render } from '@/test/render';

const hrefFor = async (lang: 'fr' | 'en', url: string) => {
  const html = await render(LangSwitch, { props: { lang }, url });
  return /<a href="([^"]*)"/.exec(html)?.[1];
};

describe('LangSwitch', () => {
  it('pointe vers la même page dans l’autre langue', async () => {
    expect(await hrefFor('fr', 'http://localhost/fr/')).toBe('/en/');
    expect(await hrefFor('en', 'http://localhost/en/legal/')).toBe('/fr/legal/');
  });

  it('ne remplace que le préfixe de langue en tête du chemin', async () => {
    expect(await hrefFor('fr', 'http://localhost/fr/legal/fr/')).toBe('/en/legal/fr/');
    expect(await hrefFor('fr', 'http://localhost/legal/fr/')).toBe('/legal/fr/');
  });
});
