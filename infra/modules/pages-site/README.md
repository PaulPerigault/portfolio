# Module `pages-site`

Hébergement du site statique sur Cloudflare Pages (ADR-0008). **Préparé, jamais appliqué par l'assistant ni par la CI** : le propriétaire applique après lecture du `plan`.

| Ressource                       | Rôle                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `cloudflare_pages_project.site` | projet Pages **sans source Git** : la CI enverra l'artefact `dist/` déjà construit et testé (envoi direct, même artefact) |
| `cloudflare_pages_domain.site`  | un domaine personnalisé par entrée de `custom_domains` ; la racine les donne quand `fr_site_host = "cloudflare-pages"`    |

Les en-têtes HTTP (HSTS, `frame-ancestors`, COOP/CORP, type du Markdown, cache) sont dans `public/_headers`, publié avec le site et testé par `scripts/pages-headers.test.mjs`. Les `CNAME` qui activent ces domaines sont dans le module `zone-fr` (même variable de bascule) : procédure dans `docs/runbook-cloudflare.md` §5.

## Entrées

`account_id`, `project_name` (par défaut `paulperigault`), `production_branch` (par défaut `main`), `custom_domains` (par défaut `[]`), `git_source` (par défaut `null`).

## Source Git et previews (`git_source`)

Avec `git_source` (dépôt, commande de build, dossier de sortie, `root_dir`, variables en clair), le projet est construit par Cloudflare (intégration Git native) : production sur `production_branch`, une preview par branche et par PR (`preview_deployment_setting = "all"`, commentaire de PR activé), même `NODE_VERSION` en preview et en production. Utilisé par `module.ds_docs_site` (dépôt `design-system`, D-036).

Limites : l'autorisation de l'application GitHub de Cloudflare sur le dépôt est manuelle (aucune API). Un projet créé en envoi direct ne peut pas, selon Cloudflare, devenir un projet Git : si le projet existe déjà, le plan indique un remplacement (`-/+`) ; `npm run infra:tf` refuse alors l'`apply` tant que l'adresse n'est pas dans `allowed-destroys.txt`. Le secret n'entre jamais dans `git_source` : `env_vars` est en clair (`plain_text`).

## Sorties

`project_name`, `subdomain` (cible des `CNAME`), `pages_dev_url`, `custom_domains`.
