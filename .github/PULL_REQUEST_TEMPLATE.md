## Description

<!-- Que fait cette PR et pourquoi ? -->

## Type de changement

- [ ] `feat` — nouvelle fonctionnalité
- [ ] `fix` — correction de bug
- [ ] `refactor` — changement de code sans impact fonctionnel
- [ ] `chore` — maintenance, dépendances, tooling
- [ ] `docs` — documentation uniquement
- [ ] `ci` — CI/CD

## Issue liée

Closes #

## Checklist

- [ ] Les tests unitaires passent (`npm test`)
- [ ] Au moins un test e2e couvre la fonctionnalité (`npm run e2e`)
- [ ] `npm run verify` est vert
- [ ] Le lint passe (`npm run lint`)
- [ ] Le build passe (`npm run build`)
- [ ] La documentation (CLAUDE.md, README) est à jour si nécessaire
- [ ] Les commits suivent la convention [Conventional Commits](https://www.conventionalcommits.org/)

## Design anti-IA (si l'interface ou les textes changent)

- [ ] Aucun texte laissé tel que généré : relu et réécrit à la main, sans placeholder.
- [ ] Un seul accent, tous les styles passent par les jetons.
- [ ] Aucun dégradé, ombre décorative, flou, emoji, étiquette en capitales.
- [ ] Provenance des assets connue (photo personnelle, logo `logo.svg`, polices sous licence OFL, icônes maison).
- [ ] Carte de partage et favicons régénérés (`scripts/generate-og-image.mjs`, skill `update-favicon`) si le design change.
- [ ] Contraste AA vérifié en clair **et** en sombre.
- [ ] `npm run check:design` est vert (voir `docs/design-charter.md`)
