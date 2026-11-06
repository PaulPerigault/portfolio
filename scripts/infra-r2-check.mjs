// Vérifie, en lecture seule, que les buckets R2 du state OpenTofu ne sont joignables par aucun
// accès public : ni sous-domaine `r2.dev`, ni domaine personnalisé. Ils contiennent des secrets
// (Turnstile, valeurs des jetons d'identity). N'affiche que des booléens et des noms de domaine ;
// code de sortie 1 si un accès public existe.
//   npm run infra:r2-check
import { cloudflareGet } from './lib/cloudflare-api.mjs';
import { runCli } from './lib/infra-cli.mjs';
import { childEnv } from './lib/infra-secrets.mjs';

const ACCOUNT_ID = '5d7f707043c8dbe25d945c965f24880e';
export const STATE_BUCKETS = ['tfstate-portfolio', 'tfstate-portfolio-identity'];

const readAccess = async (deps, token, bucket) => {
  const domains = `/accounts/${ACCOUNT_ID}/r2/buckets/${bucket}/domains`;
  try {
    const managed = await cloudflareGet(deps.fetch, token, `${domains}/managed`);
    const custom = await cloudflareGet(deps.fetch, token, `${domains}/custom`);
    return {
      r2dev: Boolean(managed?.enabled),
      domains: (custom?.domains ?? []).map((d) => d.domain),
    };
  } catch {
    throw new Error(
      `Lecture refusée sur le bucket ${bucket} : le token doit avoir « Workers R2 Storage : Read » ` +
        'sur ce bucket. Sinon, faire le contrôle manuel décrit dans infra/README.md ' +
        '(« Accès au state »).',
    );
  }
};

const checkBucket = async (deps, token, bucket) => {
  const { r2dev, domains } = await readAccess(deps, token, bucket);
  deps.log(`Bucket ${bucket}`);
  deps.log(`  sous-domaine r2.dev public : ${r2dev}`);
  deps.log(`  domaines personnalisés     : ${domains.length} ${domains.join(', ')}`);
  return r2dev || domains.length > 0;
};

/** @returns {Promise<number>} 0 si aucun bucket n'a d'accès public, 1 sinon */
export async function checkR2PublicAccess(deps) {
  const token = childEnv(['TF_VAR_cloudflare_api_token'], deps).TF_VAR_cloudflare_api_token;
  let exposed = false;
  for (const bucket of STATE_BUCKETS) exposed = (await checkBucket(deps, token, bucket)) || exposed;
  deps.log(exposed ? 'ALERTE : accès public au state.' : 'OK : aucun accès public.');
  return exposed ? 1 : 0;
}

if (import.meta.main) await runCli(checkR2PublicAccess);
