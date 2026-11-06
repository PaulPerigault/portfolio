---
name: portfolio-charte
description: À utiliser quand on touche au style du portfolio (couleur, typographie, espacement, composant visuel), pour respecter les jetons --pp-* et les interdits que scripts/check-design.mjs refuse.
---

# Charte visuelle du portfolio

## Quand

Tout changement de CSS, de classes Tailwind, de composant `ui/` ou de section.

## État de la charte

La charte v2 (ADR-0012, direction A choisie par Paul : jetons et CSS de `@paulperigault/*` publiés tels quels, accent
de teinte 270,7, Atkinson Hyperlegible Next, aucun build de jetons personnalisé) remplace l'ADR-0006. La source courante est
`docs/design-charter.md` : si une règle ci-dessous et ce document divergent, c'est ce document qui l'emporte.

## Règles

- Les valeurs viennent des jetons `--pp-*` de `@paulperigault/tokens`, exposés à Tailwind par `@paulperigault/css/theme.css`. Clair et
  sombre sont définis une fois avec `light-dark()`.
- Une seule teinte d'accent, une famille de texte auto-hébergée (Atkinson Hyperlegible Next, `@paulperigault/css`) ;
  sa variante Mono seulement pour code, identifiants, empreintes, métadonnées.
- Titre de section à gauche, contenu à droite (`Section`), filets fins, angles `--pp-radius-control` / `--pp-radius-surface`.
- Nouvelle couleur : jeton dans les deux thèmes, puis contraste vérifié (`src/lib/contrast.test.ts`).
- Motif répété : une primitive dans `src/components/ui/` (`docs/ui.md`).
- La feuille d'impression reste valide (`e2e/print.spec.ts`).

## Interdits (ceux que `scripts/check-design.mjs` refuse)

- Dégradés, ombres, flou (`backdrop-blur`), emoji.
- Couleur en dur (`#fff`, `rgb(`), palette Tailwind (`bg-blue-500`), valeur arbitraire (`w-[13px]`).
- `font-serif`, `font-mono` sur un titre ou un libellé (le mono reste pour code, identifiants, empreintes, métadonnées), toute capitale en étiquette (`uppercase`, avec ou sans `tracking-`), rayon autre que `rounded-control` / `rounded-surface`.
- Formules creuses de `scripts/lib/generic-phrases.mjs` (« passionné par », « cutting-edge », « solutions innovantes »).
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

- `docs/design-charter.md`, `src/styles/global.css`, `node_modules/@paulperigault/css`
- `scripts/check-design.mjs`, `scripts/lib/design-rules.mjs`, `e2e/design-charter.spec.ts`
- `docs/ui.md`, `docs/adr/0012-charte-v2-design-system.md`
