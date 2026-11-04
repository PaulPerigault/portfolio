---
name: portfolio-lot
description: À utiliser au début, pendant et à la fin de tout lot de travail sur le portfolio (issue, branche, commits, PR vers develop, vérifications), pour suivre le flux réel du dépôt.
---

# Lot de travail du portfolio

## Quand

Dès qu'un changement doit aboutir dans `develop` : code, contenu, documentation, CI.

## Règles

- Une issue remplie avant la branche (modèles `.github/ISSUE_TEMPLATE/`), puis une branche
  `feat|fix|chore|docs|ci|test/<n°>-<slug>` depuis `develop` à jour (`CLAUDE.md`, « Git workflow »).
- Une PR par lot, vers `develop`, avec `Closes #n` (ou `Refs #n` si l'issue reste ouverte), selon
  `.github/PULL_REQUEST_TEMPLATE.md`.
- Corps de PR de 90 colonnes au plus, mesuré avant l'ouverture : corriger après coup oblige à fermer puis rouvrir
  (`docs/passation-portfolio.md`).
- Commits Conventional Commits, sujet en minuscules, 72 caractères au plus (`commitlint.config.mjs`).
- Fichiers stagés un par un avec `git add <fichier>`.
- Toute fonctionnalité apporte un test Playwright et une ligne dans `docs/test-matrix.md` (`npm run check:matrix`).
- Un fichier `src/`, `e2e/` ou `scripts/` ne dépasse pas 120 lignes : découper (`scripts/check-file-size.mjs`).
- Fusion : l'assistant ne fusionne qu'une PR vers `develop`, numéro cité, CI verte. Toute fusion vers `main` est
  à Paul (`CLAUDE.md`, « Working rules for the assistant »).

## Interdits

- `git add -A`, `git add .`, push sur `develop` ou `main`, force-push, `--no-verify`, `HUSKY=0`.
- Signature d'outil dans un commit ou une PR, même citée dans un corps.
- `npm install` pour changer des dépendances hors PR dédiée ; `apply`, `publish`, secrets ; toucher `infra/`.
- `gh pr ready`, commentaire dans une issue ou une PR non demandé.

## Périmètre de session

- Rien hors du dossier du dépôt.
- Fichiers temporaires dans `tmp/`, sans `.js`/`.ts`/`.mjs`, supprimés un par un par chemin explicite : jamais de
  vidage ni de suppression par motif.
- Aucun `npx`, `npm install` ni téléchargement sans demande de Paul.
- Ne lancer aucun binaire dont le nom exact n'est pas lu dans `package.json` (Lighthouse CI = `@lhci/cli`, jamais
  `lhci`).

## Procédure

1. Lire l'issue, `CLAUDE.md` et le document de passation du lot.
2. Créer la branche, écrire le changement, ajouter la ligne de matrice si une fonctionnalité naît.
3. `npm run guard`, puis `npm run verify` avant le push (le hook `pre-push` le relance).
4. Mesurer le corps de la PR (colonnes), vérifier qu'il ne cite aucun outil, ouvrir la PR vers `develop`.
5. Attendre `ci` et `commitlint`. Fusionner seulement vers `develop`, en squash, avec `--subject` et
   `--body-file`, sans `--auto`.

## Sources du dépôt

- `CLAUDE.md` (Git workflow, Working rules, CI/CD), `docs/passation-portfolio.md`
- `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/`
- `docs/test-matrix.md`, `scripts/check-test-matrix.mjs`, `scripts/guard-pr-merge.mjs`
