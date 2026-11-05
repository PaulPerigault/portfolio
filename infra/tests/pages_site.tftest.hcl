# Module pages-site avec un provider simulé : aucun appel à Cloudflare, aucun secret (`tofu test`).
mock_provider "cloudflare" {}

variables {
  account_id = "compte-de-test"
}

run "sans_domaine_par_defaut" {
  command = plan

  module {
    source = "./modules/pages-site"
  }

  assert {
    condition     = length(cloudflare_pages_domain.site) == 0
    error_message = "Aucun domaine ne doit être déclaré avant la bascule DNS."
  }

  assert {
    condition     = cloudflare_pages_project.site.production_branch == "main" && cloudflare_pages_project.site.name == "paulperigault"
    error_message = "Projet attendu : paulperigault, branche de production main."
  }

  assert {
    condition     = cloudflare_pages_project.site.source == null
    error_message = "Le projet ne doit pas être relié à Git : la CI envoie l'artefact testé."
  }
}

run "un_domaine_par_entree" {
  command = plan

  module {
    source = "./modules/pages-site"
  }

  variables {
    custom_domains = ["paulperigault.fr", "www.paulperigault.fr"]
  }

  assert {
    condition     = toset(keys(cloudflare_pages_domain.site)) == toset(["paulperigault.fr", "www.paulperigault.fr"])
    error_message = "Un cloudflare_pages_domain par domaine personnalisé."
  }
}

run "source_git_avec_previews_par_pr" {
  command = plan

  module {
    source = "./modules/pages-site"
  }

  variables {
    git_source = {
      owner           = "PaulPerigault"
      repo_name       = "design-system"
      build_command   = "npm ci && npm -w @paulperigault/docs run build"
      destination_dir = "apps/docs/dist"
      env_vars        = { NODE_VERSION = "24" }
    }
  }

  assert {
    condition     = cloudflare_pages_project.site.source.type == "github" && cloudflare_pages_project.site.source.config.repo_name == "design-system"
    error_message = "Source GitHub PaulPerigault/design-system attendue."
  }

  assert {
    condition     = cloudflare_pages_project.site.source.config.preview_deployment_setting == "all" && cloudflare_pages_project.site.source.config.production_branch == "main"
    error_message = "Previews pour toutes les branches, production sur main."
  }

  assert {
    condition     = cloudflare_pages_project.site.build_config.destination_dir == "apps/docs/dist" && cloudflare_pages_project.site.build_config.root_dir == "/"
    error_message = "Dossier de sortie apps/docs/dist, racine du monorepo."
  }

  assert {
    condition     = cloudflare_pages_project.site.deployment_configs.preview.env_vars["NODE_VERSION"].value == "24" && cloudflare_pages_project.site.deployment_configs.production.env_vars["NODE_VERSION"].value == "24"
    error_message = "NODE_VERSION=24 en preview et en production."
  }
}
