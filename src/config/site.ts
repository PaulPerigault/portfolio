/** Identité du site : source unique des noms, URLs et coordonnées (aucune URL en dur ailleurs). */
const GITHUB_USER = 'PaulPerigault';
const DOMAIN = 'https://paulperigault.fr';
const DESIGN_SYSTEM_URL = 'https://design.paulperigault.dev/';
const CV_PATH = '/cv-paul-perigault.pdf';

export const SITE = {
  name: 'Paul Perigault',
  domain: DOMAIN,
  email: 'contact@paulperigault.fr',
  githubUser: GITHUB_USER,
  githubRepo: 'portfolio',
  employer: 'WeVii',
  schools: ['ESIEA Paris', 'IUT Paris Rives de Seine'],
  ogImagePath: '/image/og-cover.png',
  githubApiUrl: 'https://api.github.com',
  /** Documentation du design system utilisé par le site (lien réciproque contrôlé de son côté). */
  designSystemUrl: DESIGN_SYSTEM_URL,
  /** Site d'un projet lu sur GitHub dont le champ `homepage` est vide (nom du dépôt → adresse). */
  projectSites: { 'design-system': DESIGN_SYSTEM_URL } as Readonly<Record<string, string>>,
  githubUrl: `https://github.com/${GITHUB_USER}`,
  linkedinUrl: 'https://www.linkedin.com/in/paul-perigault',
  /** CV servi par le site (copié au build par `scripts/fetch-cv.mjs`). */
  cvPath: CV_PATH,
  cvUrl: `${DOMAIN}${CV_PATH}`,
  /** Worker du formulaire de contact (`worker/`), appelé par `fetch` depuis le navigateur. */
  contactEndpoint: 'https://contact.paulperigault.dev/',
  /** Origine de Turnstile : script, iframe et connexions du widget anti-robot (CSP). */
  turnstileOrigin: 'https://challenges.cloudflare.com',
  /** URL exacte imposée par Cloudflare (ni proxy ni cache), chargée au premier focus du formulaire. */
  turnstileScriptUrl: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
} as const;
