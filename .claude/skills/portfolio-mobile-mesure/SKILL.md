---
name: portfolio-mobile-mesure
description: À utiliser quand un changement touche le poids, la vitesse ou l'affichage mobile du portfolio, ou quand il faut comparer avant et après avec des chiffres mesurés.
---

# Mesure mobile du portfolio

## Quand

Un lot modifie le CSS, le JS, les polices, les images ou la structure d'une page, ou annonce un gain ou une perte.

## Règles

- Mobile d'abord : mesurer à 390 × 844 avant le bureau, comme la référence `docs/perf-baseline-migration.md`.
- Le point de comparaison est cette référence (commit `5fce29c`, poste de développement). Ses valeurs servent à comparer
  deux lots sur le même poste, pas de valeur absolue.
- Les budgets bloquants sont ceux de `.lighthouserc.json` (profil bureau) : performance ≥ 0,98, accessibilité,
  bonnes pratiques et SEO = 1, LCP ≤ 800 ms, TBT ≤ 50 ms, CLS ≤ 0,01, poids ≤ 90 000 octets, JS ≤ 6 144 octets,
  12 requêtes au plus.
- Dans `.lighthouserc.json`, `total-byte-weight` (90 000 octets) est en `error`, donc bloquant dans la CI actuelle.
  L'objectif de Paul est un poids affiché et non bloquant : la décision n° 4 de `docs/audit-portfolio-2026-11.md`
  est en attente. En attendant, ne pas modifier `.lighthouserc.json`, et signaler tout dépassement.
- Rendre compte dans un tableau avant / après : mêmes pages, même méthode, même poste, unité écrite.
- Dire d'où vient la mesure. Un serveur local est nommé comme tel : `scripts/serve-dist.mjs` n'envoie ni compression
  ni les en-têtes de `public/_headers` : la référence locale (`docs/perf-baseline-migration.md`) est sans
  compression (gzip calculé à part), alors que la CI compresse.
- Le build de mesure précise s'il a `PUBLIC_TURNSTILE_SITEKEY` : sans elle, le formulaire n'est pas construit.

## Interdits

- Écrire un chiffre qui n'a pas été mesuré dans cette session ou lu dans un document du dépôt, avec sa source.
- Mélanger deux méthodes dans un même tableau, ou comparer un poste à la CI.
- Modifier `.lighthouserc.json` pour faire passer une mesure.
- Installer un paquet ou lancer `npx` pour mesurer.

## Procédure

1. Rebâtir `dist/` (`npm run build`) : un `dist/` ancien fausse tout.
2. Servir `dist/` avec `scripts/serve-dist.mjs`, mesurer les mêmes pages que la référence (`/fr/`, `/en/`),
   3 exécutions, médiane.
3. Lighthouse n'est pas une dépendance de `package.json` : la CI l'appelle par l'action `treosh/lighthouse-ci-action`
   (`.github/workflows/ci.yml`), et la référence a utilisé une copie temporaire (`tmp/`, non versionnée). Demander à
   Paul avant d'en créer une.
4. Remplir le tableau (page, métrique, avant, après, écart), puis lister les limites de la mesure.
5. Si un budget est dépassé, le dire en tête, avec la métrique et la valeur.

## Sources du dépôt

- `docs/perf-baseline-migration.md`, `.lighthouserc.json`, `scripts/serve-dist.mjs`
- `docs/perf-baseline.md`, `docs/perf-report.md`, `e2e/bundle-budget.spec.ts`
