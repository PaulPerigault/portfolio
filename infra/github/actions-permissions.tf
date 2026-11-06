# Réglages GitHub Actions du dépôt portfolio (A14), importés tels qu'ils sont (imports.tf) :
# jeton des workflows en lecture seule, pas d'approbation de PR par un workflow, actions tierces
# listées une à une et épinglées par SHA. Le modèle est celui du design-system.

# Chaque workflow déclare ses `permissions:` à la racine ; le défaut du dépôt ne sert qu'aux oublis.
# L'auto-merge Dependabot n'approuve plus (`gh pr merge --auto` seul) : 0 approbation exigée.
resource "github_workflow_repository_permissions" "portfolio" {
  repository                       = github_repository.portfolio.name
  default_workflow_permissions     = "read"
  can_approve_pull_request_reviews = false
}

# Actions de GitHub, puis les 6 actions tierces des workflows. Une nouvelle action tierce
# s'ajoute ici dans la même PR (scripts/infra-github-config.test.mjs la compare aux workflows).
resource "github_actions_repository_permissions" "portfolio" {
  repository           = github_repository.portfolio.name
  enabled              = true
  allowed_actions      = "selected"
  sha_pinning_required = true

  allowed_actions_config {
    github_owned_allowed = true
    verified_allowed     = false
    patterns_allowed = [
      "dependabot/fetch-metadata@*",
      "googleapis/release-please-action@*",
      "opentofu/setup-opentofu@*",
      "ossf/scorecard-action@*",
      "treosh/lighthouse-ci-action@*",
      "zizmorcore/zizmor-action@*",
    ]
  }
}
