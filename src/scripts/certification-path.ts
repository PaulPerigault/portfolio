/**
 * Déclencheur de la scène 3D des certifications : ce fichier est le seul à partir avec la page, il
 * reste donc minuscule (budget de JS Lighthouse). Il n'observe la section qu'après un geste ou un
 * défilement de la personne (Lighthouse redimensionne la fenêtre pour sa capture pleine page sans
 * rien faire de tel) ; quand elle est proche, la suite (`certification-gate.ts`, puis le design
 * system, le paquet 3D et son `.wasm`) est importée à la demande. Proximité : règle du design
 * system (`milestones-3d-gate`).
 */
const HOST = '[data-pp-milestones]';
/** La section est « proche » à cette distance du viewport. */
const LOAD_MARGIN = '200px 0px';
const SIGNS = ['scroll', 'pointerdown', 'keydown'];

/**
 * Liens de vérification en nouvel onglet : le composant du design system ne pose que `rel`. Sans
 * JavaScript ils s'ouvrent dans l'onglet courant, sans perte (retour arrière).
 */
function openInNewTab(host: Element): void {
  const hint = host.parentElement?.getAttribute('data-new-tab') ?? '';
  host.querySelectorAll<HTMLAnchorElement>('a[href^="https:"]').forEach((link) => {
    const name = link.getAttribute('aria-label') ?? link.textContent ?? '';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${name} (${hint})`);
  });
}

export function initCertificationPath(): void {
  const host = document.querySelector(HOST);
  if (!host) return;
  openInNewTab(host);
  const watch = (): void => {
    SIGNS.forEach((name) => removeEventListener(name, watch));
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void import('@/scripts/certification-gate').then(({ start }) => start(host));
      },
      { rootMargin: LOAD_MARGIN },
    );
    observer.observe(host);
  };
  SIGNS.forEach((name) => addEventListener(name, watch, { passive: true }));
}
