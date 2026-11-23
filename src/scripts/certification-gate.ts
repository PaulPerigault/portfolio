/**
 * Seconde moitié du déclencheur de la scène 3D des certifications, chargée seulement quand la
 * section est proche (`certification-path.ts`) : geste si la section est déjà à l'écran, arrêt du
 * défilement, puis import du comportement du design system (`@paulperigault/astro/milestones-3d`),
 * du paquet 3D et de son `.wasm`.
 */
type Win = Window & typeof globalThis;

/** Gestes discrets : ni le défilement ni la molette. */
const GESTURES = ['pointerdown', 'keydown'] as const;
/** Silence de défilement au bout duquel on considère que la page s'est arrêtée. */
const QUIET_MS = 150;

interface Connection {
  saveData?: boolean;
}

/**
 * Économie de données : rien n'est jamais chargé. Le mouvement réduit ne bloque plus (ADR-0013) :
 * le composant passe en navigation par étapes, sans animation.
 */
const refused = (win: Win): boolean =>
  (win.navigator as { connection?: Connection }).connection?.saveData === true;

const whenGesture = (win: Win): Promise<void> =>
  new Promise((resolve) => {
    const done = (): void => {
      GESTURES.forEach((name) => win.removeEventListener(name, done));
      resolve();
    };
    GESTURES.forEach((name) => win.addEventListener(name, done, { passive: true }));
  });

/** Résout quand plus aucun défilement n'a eu lieu pendant `QUIET_MS`. */
const scrollSettled = (win: Win): Promise<void> =>
  new Promise((resolve) => {
    let timer = 0;
    const arm = (): void => {
      win.clearTimeout(timer);
      timer = win.setTimeout(() => {
        win.removeEventListener('scroll', arm);
        resolve();
      }, QUIET_MS);
    };
    win.addEventListener('scroll', arm, { passive: true });
    arm();
  });

const nextScroll = (win: Win): Promise<void> =>
  new Promise((resolve) => win.addEventListener('scroll', () => resolve(), { once: true }));

/**
 * Ne charge jamais pendant un défilement ni une section déjà passée au-dessus de l'écran : `html`
 * défile en douceur (`scroll-behavior: smooth`), et la scène insérée en cours de route repousserait
 * la cible d'un lien d'ancre (`#contact`) ou d'un focus programmatique hors de l'écran.
 */
export async function start(host: Element, win: Win = window): Promise<void> {
  if (refused(win)) return;
  const { top, bottom } = host.getBoundingClientRect();
  if (bottom > 0 && top < win.innerHeight) await whenGesture(win);
  await scrollSettled(win);
  while (host.getBoundingClientRect().bottom <= 0) {
    await nextScroll(win);
    await scrollSettled(win);
  }
  const { defaultDeps, install } = await import('@paulperigault/astro/milestones-3d');
  // Les conditions d'attente sont déjà remplies : le comportement n'attend plus rien.
  install(document, { ...defaultDeps(), ready: () => Promise.resolve() });
}
