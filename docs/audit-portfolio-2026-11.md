# Audit du portfolio avant migration vers le design system (2026-11-04)

Audit **en lecture seule** de `PaulPerigault/portfolio` (`develop`, `f0a0ab5`), poste Windows, Node 24.
Aucun code, contenu, secret ni réglage modifié. Le paquet publié a été lu hors du dépôt, dans un
dossier temporaire neutre, après `npm i @paulperigault/{astro,css,tokens,dataviz}` (0.1.0).

Niveaux de preuve : **[P]** prouvé (fichier lu ou mesure faite pendant l'audit), **[D]** déduit de
sources lues, **[À VÉRIFIER]** non lisible ici. Le plan de migration est dans la section 7, les
décisions à prendre dans la section 8.

## 1. Synthèse

| Constat | Niveau |
| --- | --- |
| Le paquet publié couvre 54 composants Astro, mais **ni barre de navigation, ni pied de page, ni titre, ni icône, ni lien d'évitement, ni utilitaire « visuellement masqué »** | [P] |
| Les jetons du portfolio et du design system **partagent le préfixe `--pp-*` avec des noms différents** (`--pp-bg` contre `--pp-color-bg`) : migrer les deux feuilles côte à côte casserait le rendu sans erreur de build | [P] |
| Les READMEs des trois paquets publiés disent encore « en construction (0.0.0) » alors que la version est 0.1.0 | [P] |
| Le site du design system vérifie un lien **du portfolio vers lui** (`PORTFOLIO_LINK_CHECK=1`) ; le portfolio n'en contient aucun aujourd'hui | [P] |
| Les jobs `audit (.)` **et** `audit (worker)` du workflow Security sont rouges (pas des contrôles requis) | [P] |
| Le CI requis (`ci`, `commitlint`) est vert sur `develop` ; un test Vitest a échoué une fois sur deux exécutions (non reproduit à la troisième) | [P] |
| Le remote local pointe sur l'ancien nom du dépôt | [P] |
| Le budget Lighthouse bloque sur le poids et ne mesure que le bureau ; la demande est « mobile d'abord, poids mesuré et affiché » | [P] |

## 2. Paquet publié (lu hors du dépôt)

| Paquet | Contenu mesuré | Source |
| --- | --- | --- |
| `@paulperigault/tokens` 0.1.0 (MIT) | 69 jetons `--pp-*` dans `generated/tokens.css` (3 601 octets), `tokens.json`, `tokens.d.ts` ; sous-chemins `color`, `contrast`, `customize`, `palette` | `tokens/package.json`, `generated/` |
| `@paulperigault/css` 0.1.0 (MIT) | `index.css` = tokens + `fonts.css` + `base.css` + `print.css` ; `theme.css` pour Tailwind v4 (`@theme inline`, palette Tailwind retirée) ; polices Atkinson Next **et Mono** (OFL) | `css/src/*`, `css/package.json` |
| `@paulperigault/astro` 0.1.0 (MIT) | 54 entrées dans `registry/registry.json`, 60 exports ; composants publiés **en source** ; dépend de `shiki` 4.5.0 ; pair `astro ^7.4.0` | `astro/package.json`, `registry/` |
| `@paulperigault/dataviz` 0.1.0 (MIT) | domaine pur (`dist/`), dépend des tokens ; sert aux graphiques | `dataviz/package.json` |

- Installation : 190 paquets, `npm audit` : 0 vulnérabilité [P]. Pairs compatibles avec le portfolio (`astro ^7.4.2`, Node ≥ 24).
- **Teinte et police** : entrées `--pp-accent-hue` (0 à 360) et `--pp-font-stack` (≤ 256 caractères). Elles sont des entrées de **build** (`node scripts/build.ts --accent-hue … --out-dir`) qui régénèrent un `tokens.css` ; ce ne sont pas des variables CSS à surcharger à l'exécution [P, `tokens/README.md`]. Le contraste du texte sur l'accent est contrôlé et refuse une teinte qui échoue (`build.contrast-failed`).
- Familles de jetons : couleurs (accent, bg, fg, muted, line, control, surface, on-accent, focus, quatre statuts), graphiques `chart-1…6`, espacements `3xs…3xl`, tailles de texte `-1…4`, rayons `control` (0,25 rem) et `surface` (0,5 rem), mesure 36 rem, page 72 rem, cible tactile 2,75 rem, durées.
- Composants par famille : mise en page (Stack, Cluster, Grid, Container, Sidebar, Switcher, Center), formulaires (Button, Field, Input, Textarea, Select, Choice, Switch, Combobox), retour (Alert, Progress, Dialog, Status, Skeleton, Toast), contenu (Accordion, Breadcrumb, Card, CodeBlock, Diff, EmptyState, Prose, Separator, Stat, Table, Timeline), média (Photo, ArtDirection, Figure, Avatar, ProjectCover, Gallery, Scrim, Diagram), navigation (Tabs, Menu, Pagination), surcouche (Popover, Tooltip), données (graphiques, KpiCard, Legend, DataTable, Sparkline).
- Propriétés lues (exemples) : `Container {width: page|measure, gutter: s|m|l, as}` ; `Button {tone: primary|secondary|quiet, size: m|l, href, disabled}` ; `Card {title, href, headingLevel: 2|3|4}` + slot `footer` ; `Timeline {items: {time, datetime?, title, description?}[], label?, order?}` (ne trie pas) ; `Photo {src, ratio, focal, priority, layout, kind, rule, sizes}`.
- Zéro attribut `style` en ligne dans les composants (recherche `style=` : aucune occurrence) ; scripts de comportement externes (`behaviors/*.ts`, 30 Ko de source au total, un par composant interactif).
- Écart documentaire : les trois READMEs publiés (`astro`, `css`, `tokens`) annoncent « 0.0.0 » et renvoient à un README de dépôt absent du paquet [P].

## 3. Inventaire du portfolio

| Domaine | Mesure | Source |
| --- | --- | --- |
| Pages | 8 pages HTML : `/` (redirection), `/fr/`, `/en/`, `/fr|en/legal/`, `/fr|en/styleguide/` (`noindex`), `404.html` ; 36 fichiers dans `dist/` | `src/pages/`, `dist/` après `npm run build` |
| Routes non HTML | `robots.txt`, `llms.txt`, `llms-full.txt`, `humans.txt`, `security.txt` (×2), `/<lang>/index.md`, sitemap | `src/pages/*.ts` |
| Composants | 38 `.astro` : 32 composants (13 `ui`, 8 `layout` dont `SeoHead*`, 10 `sections`, 1 `interactive`), 5 pages, 1 gabarit ; 1 084 lignes dans `components/` | `src/components/` |
| Styles maison | 167 lignes de CSS en 5 fichiers (`tokens`, `theme`, `base`, `fonts`, `global`) ; 14 jetons ; 93 attributs `class` ; 0 `dark:` | `src/styles/` |
| Polices | Atkinson Hyperlegible Next variable (Fontsource), 2 sous-ensembles : latin 34 Ko (préchargé), latin-ext 19 Ko | `dist/_astro/` |
| Images | 1 photo source 12 Ko → AVIF 3,5 Ko + WebP 6,6 Ko ; favicons 0,3 à 14,5 Ko ; logo SVG 244 octets ; `og-cover.png` 192 Ko ; CV PDF 125 Ko (copié au build) | `src/assets/`, `public/` |
| JS client | 5 fichiers, 3,9 Ko au total (formulaire 2,6 Ko, thème 0,6, menu 0,4, langue 0,2, stockage 0,07) + 2 scripts inline hachés | `dist/_astro/` |
| Poids de page | `/fr/` : HTML 44,5 Ko (11,1 Ko gzip, CSS inlinée) ; `/en/` 44,1 Ko (10,9) ; légal 35,9 Ko (10,2) ; 404 20,9 Ko (5,9) | mesuré le 2026-11-04 |
| Build | 8 pages en 2,4 s (Astro), `npm run build` ≈ 9 s | mesuré |
| Dépendances | 7 en production (`astro` ^7.4.2, `effect`, `@effect/platform(-node)`, `tailwindcss` et `@tailwindcss/vite` ^4.3.3, `@astrojs/sitemap`), 23 en développement, `packageManager` npm 11.6.1 | `package.json` |
| Vulnérabilités | racine : 11 modérées (eslint, typescript-eslint) ; worker : 13 dont 1 élevée (`undici` via `wrangler`) | `npm audit --json`, 2026-11-04 |
| Scripts npm | 40 scripts ; 93 fichiers dans `scripts/` dont 58 tests | `package.json`, `scripts/` |
| Tests unitaires | 95 fichiers, 700 réussis, 4 ignorés ; **pas de rapport de couverture** (aucun script ; `coverage/` ignoré, vestige) | `npx vitest run` |
| Tests e2e | 34 specs, 133 cas ; accessibilité axe FR/EN × clair/sombre × bureau/mobile ; 12 références visuelles (CI seulement) | `e2e/`, `docs/test-matrix.md` |
| Hébergement | Cloudflare Pages (production), GitHub Pages retiré (#208) ; domaine canonique `paulperigault.fr`, `.dev` redirige | `CLAUDE.md`, `infra/` |

### CSP et en-têtes [P]

- Balise `<meta http-equiv="content-security-policy">` par page, générée par Astro : `default-src 'none'`, `img-src/font-src/connect-src/manifest-src 'self'`, `script-src 'self'` + 6 empreintes SHA-256, `style-src 'self'` + 1 empreinte (feuille inlinée) ; aucune règle `unsafe-*` (`astro.config.mjs`, `dist/fr/index.html`).
- En-têtes HTTP (`public/_headers`) : `frame-ancestors 'none'`, HSTS 2 ans (sans `includeSubDomains`, #210 en attente), COOP/CORP, `X-Frame-Options`, `Permissions-Policy`, `Referrer-Policy`, `nosniff`, cache immuable sur `/_astro/*`, type MIME Markdown.
- Formulaire : exception par page (`lib/contact-csp.ts`) pour Turnstile (`challenges.cloudflare.com`) et le Worker.

### SEO, accessibilité, performance

- SEO : `SeoHead.astro` est l'unique source des balises ; canonique sur `SITE.domain`, hreflang `fr`/`en`/`x-default`, JSON-LD Person/WebSite/ProfilePage (`lib/build-json-ld.ts`), sitemap avec `lastmod` par URL tiré de Git (`scripts/lib/sitemap-lastmod.mjs` : **une route indexable nouvelle doit y déclarer ses sources**), `robots.txt` généré sans `Disallow`, ouvert aux robots d'IA. URL existantes : `/fr/`, `/en/`, `/fr/legal/`, `/en/legal/` (et `/` redirigeant).
- Accessibilité : axe sans violation exigée, `e2e/accessibility.spec.ts` ; contraste AA testé sur les jetons (`src/lib/contrast.test.ts`).
- Performance : budgets Lighthouse (`.lighthouserc.json`) **bureau seulement**, 4 URL, 2 passes : performance ≥ 0,98, JS ≤ 6 Ko, poids ≤ 90 Ko, ≤ 12 requêtes, LCP ≤ 800 ms. Dernière mesure publiée : 100 partout, LCP ≈ 325 à 367 ms (`docs/perf-report.md`) ; non rejouée ici [D].

## 4. Cartographie composant par composant

| Portfolio (usages) | Équivalent `@paulperigault/astro` | Écart |
| --- | --- | --- |
| `Container` (5) | `Container` (`width`, `gutter`, `as`) | Direct ; largeurs 64/42 rem → 72/36 rem |
| `ButtonLink` (8) | `Button` avec `href` | Direct ; tons `primary|secondary|quiet` |
| `Card` (3, projets) | `Card` (lien étendu, slot `footer`) | Direct |
| `Section` (12) | `Sidebar` + titre | Pas d'équivalent exact : **propre au portfolio** (titre à gauche, contenu à droite) |
| `Heading` (10) | aucun | **Manque** : à garder ou à demander |
| `Timeline` / `TimelineItem` (2/1) | `Timeline` | Écart : le DS n'a que `time`, `title`, `description` ; le portfolio porte aussi sous-titre (société · lieu), période et étiquettes |
| `FormField` (1) | `Field` + `Input` + `Textarea` | Direct ; message de résultat → `Alert` ; script d'envoi et Turnstile restent propres |
| `Icon` (6) | aucun | **Manque** (6 icônes 24 px dans `lib/icons.ts`) |
| `ExternalLink` (5) | aucun | **Manque** (lien sortant + indication lue) |
| `SkipLink` (1), `VisuallyHidden` (3) | aucun | **Manquent** |
| `DescriptionList` (0 usage direct) | aucun | Inutilisé hors styleguide : à supprimer ou garder |
| `Navbar`, `NavLinks`, `MobileMenu` | `Menu` (menu d'actions en popover), `Dialog` | **Manque** : le DS n'a pas de navigation de site ; `MobileMenu` (`<dialog>`) peut s'appuyer sur `Dialog` |
| `Footer`, `LangSwitch`, `ThemeToggle` | aucun (`Switch` est un contrôle de formulaire) | **Manquent** |
| `Hero` (photo) | `Photo` (`priority`) / `Avatar` | Direct pour l'image ; mise en page propre |
| `Projects` | `Card`, `ProjectCover` (si une couverture existe) | Aucune image de projet aujourd'hui |
| `Skills`, `Certifications`, `About` | `Prose`, `Table`, `Card` | À arbitrer au lot concerné |
| `LegalDocument`, `404` | `Prose`, `EmptyState` | Direct |
| Page `styleguide` | site `design.paulperigault.dev` | À retirer après migration (sitemap, e2e, `docs/ui.md`) |
| `SeoHead*`, JSON-LD, `llms`, CSP | aucun | **Propres au portfolio** |
| Graphiques (`dataviz`, `LineChart`, `Sparkline`…) | oui | Aucun besoin actuel ; hors périmètre |

**À demander au design system** : Heading, Icon (ou jeu d'icônes), ExternalLink, SkipLink, utilitaire VisuallyHidden, Navbar/Header avec menu mobile, Footer, bascule de thème, sélecteur de langue, `Timeline` avec sous-titre et métadonnées, README à jour dans les trois paquets.

## 5. Risques

| Risque | Gravité | Constat et parade |
| --- | --- | --- |
| Favicon et logo | Moyenne | 5 empreintes SHA-256 figées (`scripts/favicon-integrity.test.mjs`) : ne pas toucher à `public/favicon*`, `apple-touch-icon.png`, `image/logo.svg`. Le thème-couleur (`THEME_COLOR`) est testé contre `tokens.css` et suivra le nouvel accent |
| Noms de jetons en collision | **Élevée** | Même préfixe `--pp-*`, noms différents : `--pp-bg`/`--pp-color-bg`, `--pp-font-sans`/`--pp-font-family-sans`, `--pp-measure`/`--pp-size-measure`, `--pp-page`/`--pp-size-page`, `--pp-radius`/`--pp-radius-control`. Le lot 1 remplace d'un bloc la feuille maison par `@paulperigault/css` |
| Utilitaires Tailwind retirés | Élevée | `theme.css` du DS ne définit ni `text-xs`, `text-lg`, `text-display`, `rounded-sm`, `max-w-prose`, `py-section`, `current`, `transparent`, qui servent aujourd'hui (15 `text-sm`, 9 `max-w-prose`, 5 `rounded-sm`, 6 `*-section`…) |
| SEO et URL | Élevée | Les quatre URL indexées, les ancres `/<lang>/#<id>`, l'ordre des sections (testé), les JSON-LD et `lastmod` doivent rester ; toute nouvelle route déclare ses sources dans `sitemap-lastmod.mjs` |
| Tests e2e | Élevée | 133 cas et 12 références visuelles décrivent l'ancien rendu : les captures sont à régénérer **dans l'image CI** (`npm run test:visual:update`), `design-charter.spec.ts` et `check-design.mjs` interdisent des choses que le DS fait (rayon 0,5 rem, mono) |
| Réciprocité des liens | Moyenne | Le site DS lit la page `AUTHOR.url` et cherche un `<a href>` vers son domaine ; le portfolio n'a aucun lien vers `design.paulperigault.dev` (`src/config/site.ts`) : sans lien, `PORTFOLIO_LINK_CHECK=1` échoue côté DS |
| CSP stricte | Moyenne | Compatible a priori : composants sans `style` en ligne, scripts externes, feuille inlinée hachée par Astro. **À vérifier par un build d'essai** : `fonts.css` du DS ajoute les polices Mono et italiques (CSS inliné plus lourd), et `Photo` lit la couleur dominante à l'aide de `fill` [À VÉRIFIER] |
| Poids de page | Moyenne | Aujourd'hui 11 Ko gzip de HTML + 53 Ko de polices. Le DS ajoute `fontsource` Mono et italique : mesurer avant/après chaque lot ; budget JS ≤ 6 Ko à surveiller avec `Menu`/`Dialog` |
| Charte « CV d'abord » (ADR-0006) | Moyenne | Interdit déjà les étiquettes en capitales, pastilles, ombres : une refonte visible exige un nouvel ADR qui remplace l'ADR-0006 et met à jour `check-design.mjs`, `design-charter.md`, la PR template |
| Dépendance à un paquet jeune | Faible | 0.1.0, source Astro compilée chez nous ; Dependabot (cooldown 7 jours) suit ; épingler la version exacte |

## 6. Dettes

| Dette | État lu | Action |
| --- | --- | --- |
| Job `audit (worker)` rouge | 13 vulnérabilités (12 modérées, 1 élevée `undici`/`wrangler`) ; `audit (.)` rouge aussi (11 modérées, eslint) ; échecs du 2026-11-02 | PR de dépendances dédiée (issue de dette) |
| URL du remote | `origin` = `PaulPerigault.github.io.git` | `git remote set-url` : `tmp/commandes-paul.md` §1 |
| Ancien envoi direct, jeton `portfolio-ds-pages-deploy`, environnement `docs-deploy` | `docs-deploy` répond 404 sur portfolio **et** design-system (seul `npm-publish` existe côté DS) ; le jeton relève d'`infra/identity/` (`CLAUDE.md`) | Lecture par Paul : `tmp/commandes-paul.md` §2 et §3 ; retrait par PR + `apply` du propriétaire [À VÉRIFIER] |
| Environnement `github-pages` | Existe encore alors que GitHub Pages est retiré (#208) | Action propriétaire |
| Secret `TOKEN` (2026-09-17) | Nom générique, usage inconnu | [À VÉRIFIER] |
| Réglages de fusion | API : fusion simple et rebase autorisés, message `COMMIT_MESSAGES` ; `CLAUDE.md` annonce squash seul avec `PR_BODY` | Plan IaC à lire par Paul (§5 des commandes) |
| Test Vitest intermittent | 1 échec sur 3 exécutions, nom non capturé | À surveiller [À VÉRIFIER] |
| `CLAUDE.md` | Décrivait l'ancien inventaire du design system (#182, mesuré le 2026-10-19) comme base du cadrage | Remplacé par ce rapport |

## 7. Plan de migration (un lot = une PR, mobile d'abord)

Règle commune à tous les lots : relevé **avant/après** sur `/fr/` et `/en/`, en mobile (390 px) puis bureau : poids HTML/CSS/JS/polices (octets bruts et gzip), requêtes, LCP/CLS/TBT (Lighthouse mobile), captures claires/sombres. Le résultat va dans le corps de la PR ; le poids s'affiche, il ne bloque pas.

| Lot | Contenu | Taille | Dépend de | Critère de fin |
| --- | --- | --- | --- | --- |
| 0 | Référence : captures mobile et bureau, mesures, Lighthouse mobile ajouté (rapport), décision ADR « charte v2 » | S | rien | Mesures versionnées dans `docs/` ; ADR rédigé |
| 1 | Socle : dépendances (PR dédiée, `npm ci` ensuite), `@paulperigault/css` remplace `tokens/theme/fonts/base.css`, renommage des jetons, utilitaires Tailwind manquants, `THEME_COLOR`, direction retenue (teinte, police) | L | 0, choix de direction | `verify` vert ; CSP inchangée dans sa forme ; captures régénérées ; poids relevé |
| 2 | Coque : Navbar, menu mobile (`Dialog`), Footer, SkipLink, bascule thème/langue, lien vers `design.paulperigault.dev` | M | 1 | e2e navigation, menu, thème, langue verts ; axe sans violation ; lien réciproque présent |
| 3 | Hero, À propos, Contact : `Photo`, `Button`, `Field`/`Input`/`Textarea`/`Alert` | M | 2 | e2e formulaire, CSP formulaire et vie privée verts |
| 4 | Expérience, Formation, Certifications : `Timeline`, `Card` | M | 2, demande DS (sous-titre) | Ordre chronologique et formats de date inchangés (tests) |
| 5 | Compétences, Projets : `Card`, `ProjectCover` si couverture | M | 2 | `data-state` Projets inchangé ; aucun appel navigateur à GitHub |
| 6 | Pages légales, 404, retrait du styleguide, `Prose`, `EmptyState`, nettoyage des primitives mortes | S | 3 à 5 | `knip` vert ; sitemap = pages indexables ; `docs/ui.md` retiré ou réduit |
| 7 | Charte et garde-fous : `check-design.mjs`, `design-charter.spec.ts`, PR template, `CLAUDE.md`, ADR final | M | 6 | `guard` aligné sur le DS ; documentation à jour |
| D | Dettes : audit worker/racine, remote, environnements | S | indépendant | Jobs `audit` verts |

Risques propres : lot 1 (collision de jetons, utilitaires retirés, poids des polices), lot 2 (le DS n'a pas de navigation), lot 4 (écart `Timeline`). Les lots 3, 4 et 5 sont parallélisables après le lot 2, en PR séparées.

### Prompt-type donné à Claude Code (à adapter par lot)

```
Lot <n> du plan docs/audit-portfolio-2026-11.md : <titre>. Lis CLAUDE.md. Branche feat|chore/<issue>-<slug> depuis develop, PR vers develop (Closes #<issue>).
1) Relève l'avant : captures mobile (390 px) et bureau, poids, Lighthouse mobile. 2) Implémente
seulement le périmètre du lot avec @paulperigault/<paquet> ; ne cite un composant que s'il est
dans node_modules. 3) Garde URL, ancres, JSON-LD, favicon et CSP intacts. 4) Tests : vitest + e2e
FR/EN, ligne dans docs/test-matrix.md. 5) npm run verify vert, relève l'après, tableau avant/après
dans la PR (corps <= 90 colonnes). Aucun push direct, pas de --no-verify, pas de signature d'outil.
```

### Trois directions visuelles (sans choix)

| Direction | Teinte (`--pp-accent-hue`) | Police (`--pp-font-stack`) | Ton | Ce que ça dit de Paul |
| --- | --- | --- | --- | --- |
| A. Encre bleue | 270 (valeur actuelle du DS) | Atkinson Hyperlegible Next (par défaut) | Sobre, lisible, document technique | Un ingénieur rigoureux qui pense accessibilité ; peu de risque, le moins « visible » |
| B. Vert ingénierie | 145 | pile système (`system-ui`) : zéro police à télécharger | Terminal, sobriété énergétique | Un profil DevOps et GreenOps : le poids est un argument ; rendu différent selon l'appareil |
| C. Terre cuite | 35 | Atkinson Hyperlegible Next, accent chaud | Chaleureux, humain | Un alternant accessible, tourné vers l'équipe ; le contraste texte/accent est à valider par le build |

Le nom de teinte est indicatif : le build du DS refuse toute valeur qui échoue au contraste. Captures à produire au lot 1 sur la même page pour choisir.

## 8. Décisions que Paul doit prendre

1. Direction visuelle (A, B ou C) et police par défaut ou système.
2. Remplacer la charte « CV d'abord » (ADR-0006) par un nouvel ADR, et jusqu'où (rayons, mono, étiquettes).
3. Demander au DS les composants de la section 4, ou les garder dans le portfolio.
4. Lighthouse : garder les seuils bloquants (poids ≤ 90 Ko) ou les passer en alerte, et ajouter le mobile.
5. Épingler `@paulperigault/*` en exact ou laisser Dependabot proposer.
6. Ordre des lots 3 à 5 et rythme de fusion (une PR par lot, CI verte).
7. Sort de l'environnement `github-pages`, du secret `TOKEN` et du jeton `portfolio-ds-pages-deploy`.
8. Où publier les mesures avant/après (corps de PR, `docs/perf-report.md`).

## 9. Limites de cet audit

- Aucun appel à Cloudflare, `tofu`, ni `wrangler` (consigne). Pas de Lighthouse ni de mesure mobile rejouée ; les Core Web Vitals sont ceux de `docs/perf-report.md` [D].
- Aucune version du portfolio construite avec le design system : les risques de CSP et de poids sont des hypothèses à confirmer au lot 1.
- Le contenu du Project GitHub « Portfolio Roadmap » n'a pas été lu en détail [À VÉRIFIER].
