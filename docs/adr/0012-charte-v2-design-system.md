# ADR-0012 — Charte v2 : le portfolio suit le design system

- **Statut** : accepté (2026-11-04, #289). Remplace l'[ADR-0006](0006-identite-visuelle-cv-d-abord.md).
- **Contexte** : le portfolio migre vers les paquets publiés `@paulperigault/tokens`, `@paulperigault/css` et
  `@paulperigault/astro` (0.1.0, documentation : https://design.paulperigault.dev), voir
  `docs/audit-portfolio-2026-11.md`. Les deux identités partagent le préfixe `--pp-*` avec des noms différents et
  l'ADR-0006 interdit des choses que le design system fait (rayon de 0,5 rem, police mono). Lues dans le dépôt du
  design system (règles `css-rules.ts` du garde-fou et skill `encre-design`) : il interdit lui aussi les dégradés,
  ombres décoratives, flous, emoji, numéros de section, pastilles de tags, palette Tailwind, valeurs de couleur en
  dur, `style` en ligne et les majuscules espacées (`text-transform: uppercase` avec `letter-spacing` positif) ; il
  réserve le mono au code, aux identifiants, aux empreintes et aux métadonnées ; ses rayons sont 0,25 rem
  (`control`) et 0,5 rem (`surface`).
- **Décision** (choix de Paul, direction A) :
  - **Jetons et CSS publiés tels quels** : accent de teinte 270,7, Atkinson Hyperlegible Next, neutres du design
    system, sans build de jetons personnalisé. Le portfolio ne redéfinit aucun jeton `--pp-*` ; il ajoute dans
    `global.css`, avec ces jetons, les seuls utilitaires Tailwind absents du `theme.css` publié et réellement utilisés.
  - **Rayons** : `--pp-radius-control` (0,25 rem) et `--pp-radius-surface` (0,5 rem), aucun autre. Un avatar ou une
    pastille parfaitement ronds restent interdits.
  - **Mono** : autorisé là où le design system l'autorise (code, identifiants, empreintes, métadonnées), jamais comme
    décoration de titre ou de libellé.
  - **Capitales** : le design system n'en utilise pas pour des étiquettes ; elles restent interdites, avec ou sans
    espacement des lettres.
  - **Toujours interdits** : dégradés, ombres décoratives, flous, emoji, pastilles-tags, numéros de section, formules
    creuses, palette Tailwind, couleurs et tailles en dur, valeurs arbitraires.
  - **Composants** : ceux de `@paulperigault/astro` quand ils couvrent le besoin ; les autres (navigation, pied de
    page, titre, icône, lien externe, lien d'évitement, texte masqué, bascules de langue et de thème, frise avec
    sous-titre et étiquettes) restent dans le portfolio, restylés avec les jetons, en briques indépendantes. Aucune
    demande n'est faite au dépôt du design system.
  - **Versions** : `@paulperigault/*` épinglés en exact (`0.1.0`).
  - **Mesure** : mobile d'abord (390 × 844 puis 1280 × 800, clair et sombre, FR et EN). Les budgets bloquants de
    `.lighthouserc.json` (bureau) ne changent pas ; le poids est mesuré et affiché dans chaque PR, et le job
    `lighthouse-mobile` rapporte le profil mobile sans seuil.
- **Conséquences** :
  - `docs/design-charter.md` est réécrit pour la charte v2 ; l'ADR-0006 est marquée « remplacée par ».
  - Les garde-fous (`scripts/check-design.mjs`, `scripts/lib/design-rules.mjs`, `e2e/design-charter.spec.ts`) décrivent
    encore l'ADR-0006 : ils sont alignés lot par lot, seulement sur ce que cet ADR autorise (lots 1 et 7), avec leurs
    tests. Aucun test n'est affaibli au-delà de ce périmètre.
  - URL (`/fr/`, `/en/`, `/fr/legal/`, `/en/legal/`), ancres, JSON-LD, favicons, logo, CSP sans `unsafe-*` et textes
    factuels ne changent pas.
  - Les captures de référence sont à régénérer dans l'image Playwright de la CI à chaque lot qui change le rendu.
- **Ce que ce choix ne résout pas** : la police mono et l'italique ajoutent du poids (à mesurer au lot 1) ; le
  design system ne fournit pas de navigation de site ; l'intervention en école reste un objectif, pas un fait.
