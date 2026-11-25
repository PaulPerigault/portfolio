import { test, type Page } from '@playwright/test';
import { HOST } from './helpers/milestones';
import { observe, read } from './helpers/layout-observer';

/** LCP mobile (CPU x4, 4G lente), opt-in : MEASURE_LCP=1, une ligne JSON par passe. */
test.skip(process.env['MEASURE_LCP'] !== '1', 'mesure opt-in');
test.setTimeout(120_000);
const PASSES = 5;
const SLOW = { latency: 150, downloadThroughput: 200_000, uploadThroughput: 200_000 };

const MODES: Record<string, (page: Page) => Promise<unknown>> = {
  '3d': async () => {},
  'mouvement réduit': (page) => page.emulateMedia({ reducedMotion: 'reduce' }),
  'classique (saveData)': (page) =>
    page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', { value: { saveData: true } });
    }),
  // Signe dès le premier script : la scène se charge pendant que la page s'affiche.
  '3d, défilement immédiat': (page) =>
    page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => scrollBy(0, 1));
    }),
};

for (const [mode, prepare] of Object.entries(MODES)) {
  for (const url of ['/fr/', '/fr/#certifications']) {
    test(`${mode} ${url}`, async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium');
      for (let pass = 1; pass <= PASSES; pass++) {
        const tab = await page.context().newPage();
        await tab.setViewportSize({ width: 390, height: 844 });
        const session = await page.context().newCDPSession(tab);
        await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        await session.send('Network.enable');
        await session.send('Network.emulateNetworkConditions', { offline: false, ...SLOW });
        await observe(tab, HOST);
        await prepare(tab);
        await tab.goto(url);
        await tab.waitForTimeout(6000);
        const { lcp, cls } = await read(tab);
        const state = await tab.locator(HOST).getAttribute('data-state');
        process.stdout.write(`${JSON.stringify({ mode, url, pass, lcp, cls, state })}\n`);
        await tab.close();
      }
    });
  }
}
