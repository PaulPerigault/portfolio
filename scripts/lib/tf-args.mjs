// Commandes Terraform/OpenTofu refusées par les commandes `infra:*`, quel que soit l'appelant :
// - celles qui afficheraient un secret du state (Turnstile, jetons de infra/identity/) : `show`,
//   `console`, `state show|pull`, `output` sans nom, en JSON ou d'une sortie « secret », « token »
//   ou « client » ;
// - toute modification du state ou de ses verrous hors plan (`state rm|mv|push|replace-provider`,
//   `import`, `taint`, `untaint`, `force-unlock`) ;
// - toute destruction (`destroy`, `-destroy`) et tout `apply` sans plan enregistré (`*.tfplan`) ;
// - l'`apply` d'un plan qui détruit ou remplace une ressource (planDestructionRefusal, qui lit le
//   plan par `tofu show -json` sans jamais l'afficher).
// Les refus des arguments sont purs : les commandes refusent avant de lire les secrets ou de lancer
// OpenTofu.

const SECRET_NAME = /secret|token|client/i;
const ALWAYS = new Set(['show', 'console']);
const STATE_DUMPS = new Set(['show', 'pull']);

const REFUSAL =
  'Commande refusée : elle afficherait le secret Turnstile du state. ' +
  'Lire une sortie non sensible par son nom : `output contact_form_turnstile_sitekey`.';

const leaksOutput = (rest) => {
  const names = rest.filter((arg) => !arg.startsWith('-'));
  return rest.includes('-json') || names.length === 0 || names.some((n) => SECRET_NAME.test(n));
};

/** @param {string[]} args arguments passés à tofu @returns {string | null} raison du refus */
export function secretOutputRefusal(args) {
  const positional = args.filter((arg) => !arg.startsWith('-'));
  const [command, sub] = positional;
  const rest = args.slice(args.indexOf(command) + 1);
  const leaks =
    ALWAYS.has(command) ||
    (command === 'state' && STATE_DUMPS.has(sub)) ||
    (command === 'output' && leaksOutput(rest));
  return leaks ? REFUSAL : null;
}

const STATE_EDITS = new Set(['import', 'taint', 'untaint', 'force-unlock']);
const STATE_WRITES = new Set(['rm', 'mv', 'push', 'replace-provider']);
const STATE_REFUSAL =
  'Commande refusée : le state ne change que par un plan relu (`import`, `taint`, `force-unlock` et `state rm|mv|push` sont réservés au propriétaire, hors infra:*).';

const editsState = (command, sub) =>
  STATE_EDITS.has(command) || (command === 'state' && STATE_WRITES.has(sub));

const DESTROY_REFUSAL =
  'Commande refusée : aucune destruction par les commandes infra:* (destroy, -destroy).';
const APPLY_REFUSAL =
  'Commande refusée : `apply` seulement avec un plan enregistré et relu (`plan -out=<fichier>.tfplan`, puis `apply <fichier>.tfplan`).';
const PLAN_FILE = /\.tfplan$/;

/** @param {string[]} args arguments passés à tofu @returns {string | null} raison du refus */
export function changeRefusal(args) {
  const positional = args.filter((arg) => !arg.startsWith('-'));
  const [command, sub] = positional;
  if (editsState(command, sub)) return STATE_REFUSAL;
  if (command === 'destroy' || args.includes('-destroy')) return DESTROY_REFUSAL;
  const savedPlan = positional.length === 2 && PLAN_FILE.test(positional[1]);
  if (command === 'apply' && !savedPlan) return APPLY_REFUSAL;
  return null;
}

// Destructions d'un plan enregistré (lecture par `tofu show -json`, liste allowed-destroys.txt,
// dépôt GitHub jamais détruit) : scripts/lib/tf-plan-guard.mjs.
export {
  allowedDestroys,
  appliedPlan,
  destroyedAddresses,
  planDestructionRefusal,
} from './tf-plan-guard.mjs';

/** Premier refus applicable (secret affiché ou changement non relu), sinon null. */
export const tofuRefusal = (args) => secretOutputRefusal(args) ?? changeRefusal(args);
