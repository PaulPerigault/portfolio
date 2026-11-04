---
name: portfolio-charte
description: À utiliser quand on touche au style du portfolio (couleur, typographie, espacement, composant visuel), pour respecter les jetons --pp-* et les interdits que scripts/check-design.mjs refuse.
---

# Charte visuelle du portfolio

## Quand

Tout changement de CSS, de classes Tailwind, de composant `ui/` ou de section.

## État de la charte

La direction visuelle de la refonte n'est pas encore choisie, et l'ADR-0006 sera remplacé. Tant que ce n'est pas fait,
la source courante est `docs/design-charter.md`. Ne pas anticiper la future identité : si une règle ci-dessous
et ce document divergent, c'est ce document qui l'emporte.

## Règles

- Les valeurs viennent des jetons `--pp-*` de `src/styles/tokens.css`, exposés à Tailwind par `theme.css`. Clair et
  sombre sont définis une fois avec `light-dark()`.
- Une seule teinte d'accent, une seule famille typographique auto-hébergée (`src/styles/fonts.css`).
- Titre de section à gauche, contenu à droite (`Section`), filets fins, angles quasi droits (`--pp-radius`).
- Nouvelle couleur : jeton dans les deux thèmes, puis contraste vérifié (`src/lib/contrast.test.ts`).
- Motif répété : une primitive dans `src/components/ui/` (`docs/ui.md`).
- La feuille d'impression reste valide (`e2e/print.spec.ts`).

## Interdits (ceux que `scripts/check-design.mjs` refuse)

- Dégradés, ombres, flou (`backdrop-blur`), emoji.
- Couleur en dur (`#fff`, `rgb(`), palette Tailwind (`bg-blue-500`), valeur arbitraire (`w-[13px]`).
- `font-mono`, `font-serif`, majuscules espacées (`uppercase` avec `tracking-`).
- Formules creuses de `scripts/lib/design-rules.mjs` (« passionné par », « cutting-edge », « solutions innovantes »).
- Hors du script, mais écrits dans `CLAUDE.md` : numéros de section, pastilles-tags, `dark:` classes.

## Procédure

1. Chercher d'abord le jeton ou la primitive qui existe déjà.
2. Écrire le style sans valeur brute.
3. `npm run check:design`, puis `npm test` (contrastes) et `npm run e2e` (`design-charter.spec.ts`, styles calculés
   FR/EN, clair/sombre).
4. Si le rendu change, les références visuelles se régénèrent dans l'image CI (`npm run test:visual:update`,
   `docs/visual-regression.md`), jamais à la main.
5. Si le logo ou les favicons changent, leurs empreintes se mettent à jour dans la même PR
   (`scripts/favicon-integrity.test.mjs`).

## Sources du dépôt

- `docs/design-charter.md`, `src/styles/tokens.css`, `src/styles/theme.css`, `src/styles/base.css`
- `scripts/check-design.mjs`, `scripts/lib/design-rules.mjs`, `e2e/design-charter.spec.ts`
- `docs/ui.md`, `docs/design-system-inventaire.md`, `docs/adr/0006-identite-visuelle-cv-d-abord.md`
