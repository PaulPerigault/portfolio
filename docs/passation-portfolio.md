# Passation : migration du portfolio vers le design system

À coller tel quel dans un nouveau chat qui pilote Claude Code sur `PaulPerigault/portfolio`. Faits lus le 2026-11-04
(`develop`, commit `f0a0ab5`). `[À VÉRIFIER]` = non lisible ou non confirmé. Rapport : `docs/audit-portfolio-2026-11.md`
(plan section 7, décisions section 8).

## Mission

Migrer tout le portfolio (Astro 7 statique, FR/EN, Cloudflare Pages) vers les neuf paquets publiés `@paulperigault/*`
0.1.0 (docs : https://design.paulperigault.dev), avec une refonte visible. Identité choisie depuis (ADR-0012, direction
A) : jetons publiés tels quels, accent de teinte 270,7, Atkinson Hyperlegible Next, sans build de jetons. Favicon
intact. Mobile d'abord. Poids mesuré et affiché, non bloquant par défaut. Hors périmètre : récit, résultats, CV.

## Dépôt, branches, fusion

- Dépôt `PaulPerigault/portfolio`, local `D:\esiea\4A\PaulPerigault.github.io`. `origin` pointe encore sur l'ancien
  nom (à corriger par Paul). Défaut `develop`, production `main`. Branches `feat|fix|chore|docs|ci|test/<n°>-<slug>`.
- Protection `develop` : checks `ci` et `commitlint`, `strict`, pas de force-push ni suppression, 0 relecture.
  `main` : mêmes checks, PR obligatoire (0 approbation), conversations à résoudre ; jeux de règles `develop-protect` et
  `main-protect` actifs ; `enforce_admins: false`.
- Réglages lus : squash, fusion simple et rebase autorisés, message squash `COMMIT_MESSAGES`, auto-merge permis.
  `CLAUDE.md` annonce « squash seul, `PR_BODY` » : écart à confirmer [À VÉRIFIER].
- L'assistant ne fusionne que des PR vers `develop`, numéro cité (`guard-pr-merge`). **Toute fusion vers `main`,
  release-please comprise, est à Paul.** Squash avec `--subject` et `--body-file`, sans `--auto`. Jamais de push direct
  protégé, `--no-verify`, `HUSKY=0`, force-push ni `gh pr ready`. Une PR par lot, CI verte avant fusion.

## Commits, PR, issues

- Conventional Commits : `feat fix docs style refactor test chore ci perf revert`, sujet en minuscules, ≤ 72
  caractères (hook `commit-msg`, job `commitlint`). Aucune signature d'outil, ni citée dans un corps de PR.
- Corps de PR ≤ 90 colonnes mesurées avant ouverture (corriger après = fermer puis rouvrir). Modèle
  `.github/PULL_REQUEST_TEMPLATE.md` : Description, Type, `Closes #`, Checklist (tests, e2e, `verify`, lint, build, docs),
  « Design anti-IA ». Stager les fichiers un par un, jamais `git add -A`.
- Issues : `feature_request.yml` (étiquette `enhancement` ; Problème, Solution, Critères d'acceptation, Plan de test,
  Épic, Alternatives, Contexte), `chore.yml` (`chore` ; Description, Comment vérifier, Impact, Contexte),
  `bug_report.yml` (`bug`). Étiquettes (21) : bug, documentation, duplicate, enhancement, good first issue, help
  wanted, invalid, question, wontfix, refactor, security, seo, infra, ux, future, epic, agent, owner, après-bascule,
  autorelease (2). `chore` et `dependencies` n'y figurent pas [À VÉRIFIER]. Jalons : aucun. Projets : « Portfolio
  Roadmap » (n° 10) et « design system » (n° 13).

## CI et vérifications

- Requis : `ci` (agrégat) et `commitlint`. `ci.yml` : commitlint, verify, build → e2e (2 shards), links, visual (image
  Playwright épinglée), lighthouse (4 URL, bureau), pages-preview, worker, infra, tofu-plan, zizmor. Aussi : deploy
  (push `main`, cron), live, browsers, security, scorecard, registrar-drift, release, dependabot-auto-merge.
- État : `CI` vert sur les derniers push `develop` (24, 27, 28 oct.). `Security` du 2026-11-02 rouge : `audit (.)` (11
  modérées) et `audit (worker)` (13, 1 élevée `undici`) ; non requis. PR ouvertes : #222, #223, #272, #286 à #288.

```
npm ci --legacy-peer-deps=false      # Node 24, npm 11 ; jamais npm install hors PR dédiée
npm run lint && npm run format:check && npm run check
npm test                             # 95 fichiers, 700 cas (+4 ignorés)
npm run build                        # ≈ 9 s ; le prebuild copie le CV (réseau)
npm run e2e                          # après build ; PW_CHROMIUM_PATH si besoin
npm run guard                        # secrets, taille, couches, design, matrice, docs, knip
npm run verify                       # tout + worker (hook pre-push)
npm audit --audit-level=moderate     # racine ; idem avec --prefix worker
npm run test:visual:update           # références visuelles (Docker amd64, build préalable)
```

## Ce qui diffère du design system (ne pas supposer identique)

- Garde-fous du portfolio : 120 lignes par fichier, ESLint « design rules » (fonction ≤ 40 lignes, complexité ≤ 8),
  couches `domain ← services ← lib ← components ← layouts ← pages`, `knip`. Le DS ne les applique pas forcément [À VÉRIFIER].
- Jetons de même préfixe, noms différents : `--pp-bg`/`--pp-color-bg`, `--pp-font-sans`/`--pp-font-family-sans`,
  `--pp-page`/`--pp-size-page`, `--pp-radius`/`--pp-radius-control`. Absents du thème Tailwind du DS : `text-xs`,
  `text-lg`, `text-display`, `rounded-sm`, `max-w-prose`, `py-section`, `transparent`, `current`.
- Pas de Navbar, Footer, Heading, Icon, SkipLink, VisuallyHidden ni ExternalLink dans `@paulperigault/astro`. Ses
  READMEs publiés disent encore « 0.0.0 ». Pairs : Node ≥ 24, `astro ^7.4.0` (compatibles).
- Charte v2 (ADR-0012, remplace « CV d'abord ») appliquée par `scripts/check-design.mjs` et
  `e2e/design-charter.spec.ts` : pas de capitales en étiquette, pastilles, ombres, dégradés, mono décoratif, rayon
  autre que `control`/`surface`. Textes factuels issus de `src/content/{fr,en}`.
- Le site du DS vérifie un lien du portfolio vers lui (`PORTFOLIO_LINK_CHECK=1`) : prévoir un `<a href>` vers
  `design.paulperigault.dev`.

## Invariants

- Favicons et logo : 5 empreintes SHA-256 (`scripts/favicon-integrity.test.mjs`). URL `/fr/`, `/en/`, `/fr/legal/`,
  `/en/legal/` et ancres `/<lang>/#<id>` ; ordre des sections testé en e2e.
- CSP par `meta` avec empreintes, jamais `unsafe-inline` ; `assetsInlineLimit: 0` ; `allowContactForm` dans le
  frontmatter de la page. Une route indexable nouvelle déclare ses sources dans `scripts/lib/sitemap-lastmod.mjs`.
- Chaque fonctionnalité : un test Playwright et une ligne dans `docs/test-matrix.md`. Aucun cookie ni traceur ; toute
  ressource tierce met à jour `legal.json`, la CSP et `docs/compliance.md` d'abord. Le navigateur n'appelle jamais GitHub.

## IaC, secrets, déploiement

- IaC : `infra/` (OpenTofu, zones `.dev` et `.fr`, Pages, Worker), `infra/identity/` (jetons), `infra/registrar/` (OVH),
  `infra/github/` (dépôts). L'assistant lance `init`, `plan`, `fmt`, `validate` par les scripts `infra:*` de
  `package.json`, jamais `apply`, `destroy`, `tofu` direct, `tofu show`, `state`, ni rien qui contacte Cloudflare sans
  accord. Tout `apply` est à Paul. Aucune modification d'IaC dans la migration visuelle.
- Secrets Actions (noms) : `CLOUDFLARE_API_TOKEN_DEPLOY`, `CLOUDFLARE_API_TOKEN_PAGES`, `CLOUDFLARE_API_TOKEN_READONLY`,
  `IAC_GITHUB_READONLY_TOKEN`, `OVH_READ_CLIENT_ID`, `OVH_READ_CLIENT_SECRET`, `TFSTATE_R2_READ_ACCESS_KEY_ID`,
  `TFSTATE_R2_READ_SECRET_KEY`, `TOKEN`. Variable `PUBLIC_TURNSTILE_SITEKEY`. Environnements : `copilot`,
  `github-pages` (portfolio), `npm-publish` (design-system) ; `docs-deploy` répond 404 partout [À VÉRIFIER].
- Déploiement : Cloudflare Pages (job `pages` de `deploy.yml`, même artefact que les tests), en-têtes dans
  `public/_headers`, `paulperigault.fr` canonique, `.dev` et `www` en 301, GitHub Pages retiré (#208). Docs du DS sur
  `design.paulperigault.dev` (projet `paulperigault-ds`).

## Pièges rencontrés

- Dossier local sur `main` au départ : relire `git status`, passer sur `develop`. `dist/` datait du 28 oct. : rebâtir.
- `npx` lancé dans le dépôt exécute la copie locale : lire les paquets publiés dans un dossier temporaire neutre.
- Un test Vitest a échoué une fois sur trois (nom non capturé) [À VÉRIFIER]. Git Bash : pas de `bc`.
- Commandes à lancer par Paul : `tmp/commandes-paul.md` (non versionné, exclu par `.git/info/exclude`).
