/**
 * Déclencheur de la scène 3D des certifications : ce fichier est le seul à partir avec la page, il
 * reste donc minuscule (budget de JS Lighthouse). Il n'observe la section qu'après un geste ou un
 * défilement de la personne (Lighthouse redimensionne la fenêtre pour sa capture pleine page sans
 * rien faire de tel) ; quand elle est proche, le comportement du design system est importé à la
 * demande. Il décide seul de la suite (économie de données, WebGL2, appareil faible) et lève
 * l'empreinte réservée au repli (ADR-0014) ; le paquet 3D et son `.wasm` ne viennent qu'ensuite.
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

/** Silence de défilement au bout duquel la page est considérée à l'arrêt. */
const QUIET_MS = 150;
/** Section dépassée : son bas est dans la moitié supérieure de l'écran (queue qu'on quitte). */
const PASSED_RATIO = 0.5;

const passed = (host: Element): boolean =>
  host.getBoundingClientRect().bottom <= innerHeight * PASSED_RATIO;

async function enhance(): Promise<void> {
  const { install } = await import('@paulperigault/astro/milestones-3d');
  install(document);
}

/**
 * Une ancre vers `#contact` traverse la section en défilant, ou s'arrête sur sa queue : rien n'est
 * chargé tant que la page bouge ni si la section est dépassée. Le comportement du design system
 * n'exige plus de geste (empreinte réservée, ADR-0014), mais le paquet 3D et son `.wasm` ne
 * servent à rien à qui ne s'arrête pas sur la section.
 */
function watchSection(host: Element): void {
  let near = false;
  let timer = 0;
  const check = (): void => {
    if (!near || passed(host)) return;
    observer.disconnect();
    removeEventListener('scroll', arm);
    void enhance();
  };
  const arm = (): void => {
    clearTimeout(timer);
    timer = window.setTimeout(check, QUIET_MS);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      near = entries.at(-1)?.isIntersecting ?? false;
      arm();
    },
    { rootMargin: LOAD_MARGIN },
  );
  addEventListener('scroll', arm, { passive: true });
  observer.observe(host);
}

/**
 * Économie de données : la scène ne viendra jamais, le comportement du design system lèverait
 * l'empreinte réservée à l'arrivée sur la section, donc sous les yeux (un décalage unique, ADR-0014).
 * Levée dès le chargement, hors écran.
 */
function releaseOnSaveData(host: Element): void {
  const connection = (navigator as { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData === true) host.removeAttribute('data-reserve');
}

export function initCertificationPath(): void {
  const host = document.querySelector(HOST);
  if (!host) return;
  openInNewTab(host);
  releaseOnSaveData(host);
  const watch = (): void => {
    SIGNS.forEach((name) => removeEventListener(name, watch));
    watchSection(host);
  };
  SIGNS.forEach((name) => addEventListener(name, watch, { passive: true }));
}
