/**
 * Déclencheur de la scène 3D des certifications : ce fichier est le seul à partir avec la page, il
 * reste donc minuscule (budget de JS Lighthouse). Il ne charge rien tant que la section n'est pas
 * proche ; la suite (`certification-gate.ts`, puis le design system, le paquet 3D et son `.wasm`)
 * est importée à la demande. La proximité reprend la règle du design system (`milestones-3d-gate`).
 */
const HOST = '[data-pp-milestones]';
/** La section est « proche » à cette distance du viewport. */
const LOAD_MARGIN = '200px 0px';

interface Connection {
  saveData?: boolean;
}

/** Mouvement réduit ou économie de données : rien n'est jamais chargé. */
const refused = (): boolean =>
  matchMedia('(prefers-reduced-motion: reduce)').matches ||
  (navigator as { connection?: Connection }).connection?.saveData === true;

export function initCertificationPath(): void {
  const host = document.querySelector(HOST);
  if (!host || refused()) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void import('@/scripts/certification-gate').then(({ start }) => start(host));
    },
    { rootMargin: LOAD_MARGIN },
  );
  observer.observe(host);
}
