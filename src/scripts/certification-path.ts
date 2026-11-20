import { defaultDeps, install } from '@paulperigault/astro/milestones-3d';

/** Silence de défilement au bout duquel on considère que la page s'est arrêtée. */
const QUIET_MS = 150;

/** Résout quand plus aucun défilement n'a eu lieu pendant `QUIET_MS`. */
const scrollSettled = (win: Window): Promise<void> =>
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

const nextScroll = (win: Window): Promise<void> =>
  new Promise((resolve) => win.addEventListener('scroll', () => resolve(), { once: true }));

/**
 * Charge la scène quand la section est proche et que la page est arrêtée, jamais pendant un
 * défilement ni quand la section est déjà passée au-dessus de l'écran : `html` défile en douceur
 * (`scroll-behavior: smooth`), et la scène insérée en cours de route repousserait la cible d'un lien
 * d'ancre (`#contact`) ou d'un focus programmatique hors de l'écran.
 */
const readyWhenStable =
  (base: (host: Element) => Promise<void>, win: Window = window) =>
  async (host: Element): Promise<void> => {
    await base(host);
    await scrollSettled(win);
    while (host.getBoundingClientRect().bottom <= 0) {
      await nextScroll(win);
      await scrollSettled(win);
    }
  };

export function initCertificationPath(): void {
  const deps = defaultDeps();
  install(document, { ...deps, ready: readyWhenStable(deps.ready) });
}
