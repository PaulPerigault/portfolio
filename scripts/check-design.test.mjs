import { describe, expect, it } from 'vitest';
import { checkFile, run } from './check-design.mjs';

const rulesOf = (file, text) => checkFile(file, text).map((violation) => violation.rule);

describe('check-design : ce qui doit échouer', () => {
  it.each([
    ['gradient', 'src/components/Hero.astro', '<div class="bg-gradient-to-r from-purple-500">'],
    ['gradient', 'src/styles/a.css', 'background: linear-gradient(red, blue);'],
    ['ombre', 'src/components/Card.astro', '<div class="shadow-lg rounded">'],
    ['ombre', 'src/styles/a.css', 'box-shadow: 0 1px 2px #000;'],
    ['flou', 'src/components/Nav.astro', '<nav class="backdrop-blur-md">'],
    ['couleur-en-dur', 'src/components/Tag.astro', '<span style="color:#ff00aa">'],
    ['couleur-en-dur', 'src/styles/a.css', 'color: rgb(1, 2, 3);'],
    // ADR-0012 : le portfolio ne redéfinit aucun jeton, l'ancienne feuille n'a plus d'exception.
    ['couleur-en-dur', 'src/styles/tokens.css', '--pp-bg: light-dark(#f5f1e8, #14130f);'],
    ['palette-tailwind', 'src/components/Btn.astro', '<a class="bg-teal-500 text-white">'],
    ['valeur-arbitraire', 'src/components/Box.astro', '<div class="w-[13px] mt-[#fff]">'],
    ['famille-typographique', 'src/components/Title.astro', '<h1 class="font-serif">'],
    [
      'etiquette-majuscules',
      'src/components/Kicker.astro',
      '<p class="text-xs uppercase tracking-widest">',
    ],
    ['famille-typographique', 'src/components/Title.astro', '<h2 class="font-mono text-lg">'],
    ['famille-typographique', 'src/components/Field.astro', '<label class="text-sm font-mono">'],
    ['famille-typographique', 'src/styles/a.css', 'h1 { font-family: Georgia, serif; }'],
    ['famille-typographique', 'src/components/A.astro', '<Heading level={2} class="font-mono">'],
    ['famille-typographique', 'src/components/B.astro', '<ButtonLink class="font-mono" href="/">'],
    ['famille-typographique', 'src/components/C.astro', '<button type="submit" class="font-mono">'],
    ['rayon', 'src/components/Pill.astro', '<span class="rounded-full px-2">'],
    ['rayon', 'src/components/Box.astro', '<div class="rounded-lg border">'],
    ['rayon', 'src/components/Box.astro', '<div class="rounded border">'],
    ['rayon', 'src/components/Box.astro', '<div class="rounded-t-xl border">'],
    ['rayon', 'src/components/Box.astro', '<div class="rounded-[3px]">'],
    ['rayon', 'src/styles/a.css', 'a { border-radius: 50%; }'],
    ['rayon', 'src/styles/a.css', 'a { border-radius: var(--pp-radius-pill); }'],
    ['etiquette-majuscules', 'src/components/Kicker.astro', '<p class="text-xs uppercase">'],
    ['etiquette-majuscules', 'src/components/Kicker.astro', '<p class="tracking-wide uppercase">'],
    ['etiquette-majuscules', 'src/styles/a.css', 'h3 { text-transform: uppercase; }'],
    // Plus aucune exception, code de langue compris (ADR-0012).
    [
      'etiquette-majuscules',
      'src/components/layout/LangSwitch.astro',
      '<a class="px-2 uppercase">',
    ],
    ['emoji', 'src/components/Nav.astro', '<span>🚀 Projets</span>'],
    ['emoji', 'src/content/fr/ui.json', '{"title": "Bienvenue ✨"}'],
    ['phrase-generique', 'src/content/fr/ui.json', '{"body": "Passionné par la technologie"}'],
    ['phrase-generique', 'src/content/en/ui.json', '{"body": "I build cutting-edge solutions"}'],
  ])('détecte « %s » dans %s', (rule, file, text) => {
    expect(rulesOf(file, text)).toContain(rule);
  });

  it('détecte le mono sur un titre écrit sur plusieurs lignes', () => {
    const [violation] = checkFile('src/a.astro', 'ligne 1\n<h2\n  class="font-mono text-lg">');
    expect(violation).toMatchObject({ line: 2, rule: 'famille-typographique' });
  });

  it('indique le fichier, la ligne et l’extrait', () => {
    const [violation] = checkFile('src/a.astro', 'ligne 1\n<div class="shadow-md">');
    expect(violation).toMatchObject({ file: 'src/a.astro', line: 2, rule: 'ombre' });
    expect(violation?.excerpt).toContain('shadow-md');
  });
});

describe('check-design : ce qui doit passer', () => {
  it.each([
    ['src/lib/theme.ts', "export const THEME_COLOR = { light: '#f5f1e8' };"],
    [
      'src/components/Card.astro',
      '<div class="border-line border p-6 text-muted duration-(--pp-duration)">',
    ],
    ['src/components/Grid.astro', '<dl class="sm:grid-cols-[14rem_1fr]">'],
    ['src/content/fr/ui.json', '{"copyright": "© 2026 — Paul Perigault"}'],
    ['src/components/A.astro', '<a class="ring-accent">'],
    ['src/components/B.astro', '<code class="font-mono text-sm">fa1b2c3</code>'],
    ['src/components/C.astro', '<pre class="font-mono text-sm overflow-x-auto">'],
    ['src/components/D.astro', '<dd class="font-mono text-sm">sha256</dd>'],
    // Métadonnée en mono : autorisée par l'ADR-0012 (refusée sous l'ADR-0006).
    ['src/components/Meta.astro', '<p class="font-mono text-xs">'],
    ['src/components/E.astro', '<a class="rounded-control border px-2">'],
    ['src/components/F.astro', '<div class="rounded-surface border">'],
    ['src/components/G.astro', '<div class="rounded-t-control">'],
    ['src/styles/a.css', 'a { border-radius: var(--pp-radius-control); }'],
    ['src/components/H.astro', '<p class="text-sm tracking-tight">Une phrase normale</p>'],
  ])('accepte %s', (file, text) => {
    expect(checkFile(file, text)).toEqual([]);
  });

  it('ne signale rien dans le code source actuel', () => {
    expect(run('src')).toEqual([]);
  });
});
