# Protections de `develop` et `main`, importées telles qu'elles sont (imports.tf) : rulesets et
# protections classiques coexistent aujourd'hui. Aucune relecture humaine exigée (projet mené
# seul) : les approbations requises valent 0 ; les checks `ci` et `commitlint` gardent les fusions.
locals {
  required_checks = ["ci", "commitlint"]
}

resource "github_repository_ruleset" "develop" {
  name        = "develop-protect"
  repository  = github_repository.portfolio.name
  target      = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = ["refs/heads/develop"]
      exclude = []
    }
  }

  # Mêmes garanties que `main` : PR obligatoire, checks requis, aucun acteur de contournement.
  # Les méthodes de fusion ne sont pas restreintes ici : develop garde celles du dépôt (squash
  # pour les fonctionnalités, fusion pour les synchronisations depuis main).
  rules {
    deletion         = true
    non_fast_forward = true

    pull_request {
      dismiss_stale_reviews_on_push     = false
      require_code_owner_review         = false
      require_last_push_approval        = false
      required_approving_review_count   = 0
      required_review_thread_resolution = false
    }

    required_status_checks {
      strict_required_status_checks_policy = false
      do_not_enforce_on_create             = false

      dynamic "required_check" {
        for_each = local.required_checks
        content {
          context = required_check.value
        }
      }
    }
  }
}

resource "github_repository_ruleset" "main" {
  name        = "main-protect"
  repository  = github_repository.portfolio.name
  target      = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = ["refs/heads/main"]
      exclude = []
    }
  }

  rules {
    deletion         = true
    non_fast_forward = true

    pull_request {
      allowed_merge_methods             = ["merge", "squash", "rebase"]
      dismiss_stale_reviews_on_push     = false
      require_code_owner_review         = false
      require_last_push_approval        = false
      required_approving_review_count   = 0
      required_review_thread_resolution = false
    }

    required_status_checks {
      strict_required_status_checks_policy = false
      do_not_enforce_on_create             = false

      required_check {
        context = "ci"
      }
    }
  }
}

resource "github_branch_protection" "branch" {
  for_each = toset(["develop", "main"])

  repository_id = github_repository.portfolio.node_id
  pattern       = each.key

  # develop : les administrateurs n'ont pas de contournement ; main reste inchangée.
  enforce_admins                  = each.key == "develop"
  allows_deletions                = false
  allows_force_pushes             = false
  lock_branch                     = false
  require_signed_commits          = false
  required_linear_history         = false
  require_conversation_resolution = each.key == "main"

  required_status_checks {
    strict   = true
    contexts = local.required_checks
  }

  required_pull_request_reviews {
    dismiss_stale_reviews           = true
    require_code_owner_reviews      = false
    require_last_push_approval      = false
    required_approving_review_count = 0
  }
}
