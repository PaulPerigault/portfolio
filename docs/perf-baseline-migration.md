# Mesures de référence avant migration vers le design system

Lot 0a du plan `docs/audit-portfolio-2026-11.md` (section 7). Relevé du **2026-11-04** sur `develop`, commit
`5fce29c16bd5b2f93dfd9d2f05b106b2cf9e8550` (arbre propre). Ces chiffres servent de point de comparaison pour les lots
suivants ; ils ne sont pas un budget. Les budgets CI restent ceux de `.lighthouserc.json` (profil bureau, inchangé).

## Environnement

- Windows 11 Home, Intel Core i7-8700 (12 threads), 32 Go, Node 24.22.2, npm 11.19.1.
- Chromium de Playwright 1248 (celui de `npm run e2e`), Lighthouse 13.6.0 (Chrome émulé 156, Moto G Power).
- Build : `npm ci --legacy-peer-deps=false`, `Remove-Item -Recurse dist`, `npm run build` (8 pages, ≈ 2,8 s). Sans
  `PUBLIC_TURNSTILE_SITEKEY` ni `CI` : mode GitHub « lenient », CV copié par le `prebuild`.
- Serveur : `scripts/serve-dist.mjs` (HTTP local, **sans compression**, sans les en-têtes de `public/_headers`).

## Méthode

1. Captures et requêtes : script Playwright jetable (non versionné), Chromium headless, `waitUntil: 'networkidle'`,
   pleine page, 4 combinaisons par langue : mobile 390 × 844 et bureau 1280 × 800, `colorScheme` clair et sombre
   (`deviceScaleFactor: 1`). Chaque réponse est lue (octets bruts) puis compressée avec `zlib.gzipSync` niveau 9.
   Les 8 captures PNG ne sont pas versionnées.
2. Poids HTML / CSS / JS inline : analyse de `dist/<lang>/index.html` (balises `<style>`, `<script>` sans `src`,
   `<script type="application/ld+json">` comptés à part).
3. Lighthouse mobile : `node tmp/lh/node_modules/lighthouse/cli/index.js http://localhost:PORT/<lang>/
   --output=json --quiet --chrome-flags="--headless=new --no-sandbox"` avec `CHROME_PATH` vers le Chromium de
   Playwright. Profil par défaut de Lighthouse : mobile, throttling simulé (4G lente, CPU ×4). 3 exécutions par
   langue, médiane indiquée. `.lighthouserc.json` n'est pas modifié.

## Poids de la page (identique en clair/sombre et mobile/bureau)

Seul le HTML diffère entre FR et EN. Les octets bruts et gzip sont identiques d'un viewport ou d'un thème à l'autre :
mêmes ressources chargées, car le thème est appliqué par CSS et la photo AVIF n'a qu'une variante chargée.

| Ressource | FR brut | FR gzip | EN brut | EN gzip |
| --- | ---: | ---: | ---: | ---: |
| HTML (CSS et scripts inline compris) | 44 525 | 11 099 | 44 123 | 10 977 |
| dont CSS inliné (`<style>`) | 19 201 | 4 989 | 19 201 | 4 989 |
| dont JSON-LD | 3 562 | 1 299 | 3 505 | 1 248 |
| dont JS inline (script d'init du thème) | 163 | 135 | 163 | 135 |
| JS externe (5 fichiers) | 3 886 | 2 143 | 3 886 | 2 143 |
| Police `latin` (woff2) | 33 996 | 34 029 | 33 996 | 34 029 |
| Photo (AVIF) | 3 530 | 3 531 | 3 530 | 3 531 |
| Logo (`/image/logo.svg`) | 244 | 203 | 244 | 203 |
| **Total** | **86 181** | **51 005** | **85 779** | **50 883** |
| Requêtes | 9 | 9 | 9 | 9 |

Détail du JS externe : `ContactForm` 2 638, `ThemeToggle` 602, `MobileMenu` 375, `LangSwitch` 203, `storage` 68 octets.
La police `latin-ext` (19 092 octets) est produite dans `dist/` mais n'est pas demandée par la page. Les woff2 et l'AVIF
ne gagnent rien à la compression gzip (le gzip dépasse de quelques octets le brut).

Total gzip : addition des tailles gzip ci-dessus, avec les formats déjà compressés comptés tels que mesurés. Sur
Cloudflare Pages la compression réelle est brotli : ces chiffres ne la mesurent pas.

## Lighthouse mobile (médiane de 3 exécutions)

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | FCP | CLS | TBT | Poids transféré |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/fr/` | 100 | 100 | 100 | 100 | 1 030 ms | 1 030 ms | 0 | 0 ms | 87 832 o |
| `/en/` | 100 | 100 | 100 | 100 | 1 028 ms | 1 028 ms | 0 | 0 ms | 87 430 o |

Étendue des 3 exécutions : LCP 1 029–1 041 ms (FR) et 1 023–1 033 ms (EN). Lighthouse compte 9 requêtes par page
(le HTML, 5 scripts, la police, la photo, le logo). Son « poids transféré » est supérieur à ma somme brute de
≈ 1,6 ko : il ajoute les en-têtes HTTP.

## Limites

- Machine de développement, pas de CI : les temps (LCP, FCP) valent par comparaison entre lots sur le **même poste**,
  pas comme valeur absolue.
- Serveur local sans compression ni en-têtes de production : le poids transféré de Lighthouse est du brut, il n'est
  pas égal à ce que reçoit un visiteur de `paulperigault.fr` (brotli, cache, HTTP/2 non mesurés).
- LCP = FCP : l'élément le plus grand est du texte, le rendu de la photo AVIF n'est pas le LCP.
- Lighthouse en simulation (pas de throttling appliqué) : TBT 0 et CLS 0 sont des valeurs simulées sur une page
  quasi sans JS.
- Build sans `PUBLIC_TURNSTILE_SITEKEY` : le formulaire de contact n'est pas construit, donc Turnstile (chargé au
  premier `focusin`) n'est pas mesuré, et le script `ContactForm` est quand même chargé alors que le HTML ne contient aucun `<form>`.
  Le build de production (avec clé) peut différer de quelques centaines d'octets de HTML.
- Pages `/fr/legal/` et `/en/legal/`, styleguide et 404 : non mesurées dans cette étape.
- Le relevé de requêtes Playwright ne voit pas `logo.svg` (la requête est absente de mon événement `response`) ;
  il est ajouté d'après le rapport Lighthouse (244 octets bruts lus dans `dist/image/logo.svg`).
- Aucune mesure sur appareil réel ni sur réseau réel.

## Après migration

Relevé du **2026-11-05** sur `develop`, commit `2aec980bdb2f1a2c22c0b8e307f0b319eeaa3b52` (arbre propre), fin des lots
1 à 7 de l'epic #289. Mêmes machine, outils et méthode que la référence ci-dessus : build sans `PUBLIC_TURNSTILE_SITEKEY`
ni `CI`, serveur local `scripts/serve-dist.mjs` (HTTP, **sans compression**, sans les en-têtes de `public/_headers`),
Chromium headless de Playwright, Lighthouse mobile par défaut, 3 exécutions par langue, médiane. Le build produit 6 pages
au lieu de 8 : les deux pages `styleguide` ont été retirées (#295). Les scripts de mesure restent hors du dépôt.

### Poids de la page (octets bruts / gzip niveau 9)

| Ressource | FR avant | FR après | EN avant | EN après |
| --- | ---: | ---: | ---: | ---: |
| HTML (CSS et scripts inline compris) | 44 525 / 11 099 | 60 295 / 13 805 | 44 123 / 10 977 | 59 878 / 13 652 |
| dont CSS inliné | 19 201 / 4 989 | 31 052 / 6 794 | 19 201 / 4 989 | 31 052 / 6 794 |
| dont JSON-LD | 3 562 / 1 299 | 3 562 / 1 299 | 3 505 / 1 248 | 3 505 / 1 248 |
| dont JS inline | 163 / 135 | 163 / 135 | 163 / 135 | 163 / 135 |
| JS externe (5 fichiers) | 3 886 / 2 143 | 3 886 / 2 143 | 3 886 / 2 143 | 3 886 / 2 143 |
| Police `latin` (woff2) | 33 996 / 34 029 | 33 996 / 34 029 | 33 996 / 34 029 | 33 996 / 34 029 |
| Photo (AVIF) | 3 530 / 3 531 | 6 229 / 6 230 | 3 530 / 3 531 | 6 229 / 6 230 |
| Logo (`/image/logo.svg`) | 244 / 203 | 244 / 203 | 244 / 203 | 244 / 203 |
| **Total** | **86 181 / 51 005** | **104 650 / 56 410** | **85 779 / 50 883** | **104 233 / 56 257** |
| Requêtes | 9 | 9 | 9 | 9 |

Le total brut augmente de 18 469 octets en FR (+21,4 %) et de 18 454 en EN ; le total gzip de 5 405 octets en FR
(+10,6 %) et de 5 374 en EN. Les augmentations viennent du HTML (+15 770 octets bruts en FR), du CSS inliné
(+11 851) et de la photo (+2 699). Le JS, le JSON-LD, la police et le logo sont identiques à la référence. Je n'ai pas
cherché l'origine de la hausse du CSS ni de la photo : la mesure ne l'établit pas.

### Lighthouse mobile (médiane de 3 exécutions)

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP avant → après | CLS | TBT | Poids transféré avant → après |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/fr/` | 100 | 100 | 100 | 100 | 1 030 → 1 037 ms | 0 | 0 ms | 87 832 → 106 302 o |
| `/en/` | 100 | 100 | 100 | 100 | 1 028 → 1 034 ms | 0 | 0 ms | 87 430 → 105 885 o |

Étendue des 3 exécutions après migration : LCP 1 028–1 055 ms (FR) et 1 029–1 043 ms (EN), contre 1 029–1 041 ms et
1 023–1 033 ms avant. FCP = LCP, comme avant. Scores, CLS et TBT sont inchangés ; le LCP varie de 6 à 7 ms, dans
l'étendue des exécutions.

### Contrôles mobiles et bureau

Aucun débordement horizontal et aucun texte coupé, en FR et EN, clair et sombre, 390 × 844 et 1280 × 800. Quatre
éléments mesurent moins de 44 px dans chaque combinaison : le lien d'évitement (hors écran jusqu'au focus) et trois
liens placés dans un paragraphe (e-mail, LinkedIn, GitHub) de 24 px de haut. La référence ne relevait pas ce point : il
n'y a pas de comparaison.

### Budgets

`.lighthouserc.json` n'est pas modifié. Les jobs Lighthouse de la CI de la PR #325 (bureau, `/fr/`, `/en/` et les deux
pages légales) sont verts, donc aucun budget bloquant n'est dépassé. Le poids de 106 ko ci-dessus est le brut du serveur
local sans compression : il ne se compare pas au budget de poids de la CI.

### Limites

- Mêmes limites que la référence : poste de développement, serveur local sans compression ni en-têtes de production
  (brotli, cache et HTTP/2 non mesurés), simulation Lighthouse, formulaire de contact et Turnstile non construits.
- Les pages légales et la 404 ne sont pas mesurées.
- Une seule machine, une seule série de 3 exécutions : un écart de quelques millisecondes de LCP n'est pas significatif.
