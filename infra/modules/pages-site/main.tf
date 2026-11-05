# Hébergement du site statique sur Cloudflare Pages (ADR-0008). Par défaut **sans source Git** : la CI
# envoie l'artefact déjà construit et testé (`dist/`, envoi direct). Avec `git_source`, Cloudflare
# construit lui-même (intégration Git native) : production sur la branche de production, une preview
# par branche et par PR. Les en-têtes de sécurité viennent de `_headers`, publié avec le site.
locals {
  git     = var.git_source
  git_env = local.git == null ? {} : local.git.env_vars
  env_vars = {
    for name, value in local.git_env : name => { type = "plain_text", value = value }
  }
}

resource "cloudflare_pages_project" "site" {
  account_id        = var.account_id
  name              = var.project_name
  production_branch = var.production_branch

  source = local.git == null ? null : {
    type = "github"
    config = {
      owner                          = local.git.owner
      repo_name                      = local.git.repo_name
      production_branch              = var.production_branch
      production_deployments_enabled = true
      preview_deployment_setting     = "all"
      pr_comments_enabled            = true
    }
  }

  build_config = local.git == null ? null : {
    build_command   = local.git.build_command
    destination_dir = local.git.destination_dir
    root_dir        = local.git.root_dir
  }

  deployment_configs = length(local.env_vars) == 0 ? null : {
    preview    = { env_vars = local.env_vars }
    production = { env_vars = local.env_vars }
  }
}

# Un domaine personnalisé ne s'active qu'avec l'enregistrement DNS qui le vise (géré hors de ce
# module : le domaine canonique est chez OVH). Liste vide = aucun domaine.
resource "cloudflare_pages_domain" "site" {
  for_each = toset(var.custom_domains)

  account_id   = var.account_id
  project_name = cloudflare_pages_project.site.name
  name         = each.value
}
