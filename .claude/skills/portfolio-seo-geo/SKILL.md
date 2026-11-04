---
name: portfolio-seo-geo
description: À utiliser quand on touche aux balises SEO, au sitemap, à robots.txt, aux fichiers pour les IA ou à l'identité (nom, rôle, école) du portfolio, pour rester visible des moteurs et des assistants.
---

# SEO et visibilité IA du portfolio

## Quand

Nouvelle page ou route, changement de titre, de description, de données structurées, de contenu d'identité, de
`robots.txt`, de sitemap ou de fichiers `llms*.txt`.

## Règles

- `src/components/layout/SeoHead.astro` est le seul endroit qui écrit les balises SEO (titre, `robots`, canonical,
  Open Graph, hreflang). Trois cas typés : indexable, `noindex`, alias. Aucune page n'écrit `<title>` à la main
  (`docs/seo.md`).
- Le canonical vient de `SITE.domain`, jamais de `window.location`. Hreflang `fr`, `en` et `x-default` (FR).
- Nom, rôle, employeur et école s'écrivent à l'identique partout : site, JSON-LD, `llms.txt`, Markdown, carte de
  partage. Le JSON-LD ne répète que ce que la page dit (`e2e/geo-entity.spec.ts`, JavaScript désactivé).
- Une route indexable déclare ses sources de `lastmod` dans `scripts/lib/sitemap-lastmod.mjs`, sinon le build échoue.
  Pas de `changefreq` ni de `priority`.
- Ne jamais bloquer un robot d'IA : `robots.txt` est généré (`src/lib/robots.ts`), sans `Disallow`. Directives
  standard seulement : `Content-Signal` fait signaler Lighthouse.
- `llms.txt`, `llms-full.txt` et `/<lang>/index.md` sont générés (`src/lib/llms.ts`), jamais écrits à la main. Leur
  effet n'est pas prouvé (`docs/audit-ia.md`, A5) : ne pas le promettre.
- `build.yml` garde `include-hidden-files: true` sur l'artefact `site` (`.well-known/security.txt`).

## Interdits

- Écrire une balise SEO hors de `SeoHead.astro`, inventer une date de `lastmod`, bloquer un robot d'IA.
- Promettre un classement : `docs/audit-ia.md` (B3) rappelle qu'on ne peut pas le garantir.
- Un tiers (script, police distante) sans mise à jour de `legal.json`, de la CSP et de `docs/compliance.md` d'abord.

## Procédure

1. Changement d'identité : le faire dans les données (`src/content`, `SITE`), puis constater la propagation au JSON-LD
   et aux fichiers générés.
2. Nouvelle route : sources dans `scripts/lib/sitemap-lastmod.mjs`, ligne dans `docs/test-matrix.md`.
3. `npm run build`, puis `npm run check:seo` (specs SEO, crawl, GEO, sitemap) et `npm run check:links`.
4. Les actions hors dépôt (consoles, profils, liens entrants) restent dans `docs/geo-checklist.md` : les rappeler à
   Paul, ne pas les simuler.

## Sources du dépôt

- `docs/seo.md`, `docs/geo-checklist.md`, `docs/adr/0005-visibilite-aupres-des-ia.md`
- `src/components/layout/SeoHead.astro`, `scripts/lib/sitemap-lastmod.mjs`, `src/lib/robots.ts`
- `e2e/seo.spec.ts`, `e2e/sitemap.spec.ts`, `e2e/geo-entity.spec.ts`, `e2e/geo-files.spec.ts`
