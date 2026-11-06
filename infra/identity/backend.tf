# State propre à la brique, dans le bucket R2 dédié `tfstate-portfolio-identity`, hors de la portée
# de la clé S3 en lecture seule de la CI, qui ne couvre que `tfstate-portfolio`. Il contient les
# valeurs des jetons créés : il ne quitte jamais R2 (infra/README.md, « State »).
terraform {
  backend "s3" {
    bucket = "tfstate-portfolio-identity"
    key    = "identity/terraform.tfstate"
    region = "auto"

    endpoints = {
      s3 = "https://5d7f707043c8dbe25d945c965f24880e.r2.cloudflarestorage.com"
    }

    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}
