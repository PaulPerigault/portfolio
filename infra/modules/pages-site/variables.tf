variable "account_id" {
  description = "Compte Cloudflare."
  type        = string
}

variable "project_name" {
  description = "Nom du projet Pages (sous-domaine `<nom>.pages.dev`)."
  type        = string
  default     = "paulperigault"
}

variable "production_branch" {
  description = "Branche de production : les déploiements de cette branche servent les domaines personnalisés."
  type        = string
  default     = "main"
}

variable "custom_domains" {
  description = "Domaines personnalisés servis par le projet. Vide tant que le DNS n'est pas prêt (action manuelle)."
  type        = list(string)
  default     = []
}

variable "git_source" {
  description = "Dépôt GitHub construit par Cloudflare (intégration Git native, previews par PR) ; null = envoi direct. L'application GitHub de Cloudflare doit être autorisée sur le dépôt (action manuelle)."
  type = object({
    owner           = string
    repo_name       = string
    build_command   = string
    destination_dir = string
    root_dir        = optional(string, "/")
    env_vars        = optional(map(string), {})
  })
  default = null
}
