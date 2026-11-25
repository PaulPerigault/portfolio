import { test, type Page } from '@playwright/test';
import { HOST } from './helpers/milestones';
import { observe, read, type Seen } from './helpers/layout-observer';

/** CLS et LCP de la page et de la section 3D, opt-in : MEASURE_LAYOUT=1, une ligne JSON par passe. */
test.skip(process.env['MEASURE_LAYOUT'] !== '1', 'mesure opt-in');
test.setTimeout(120_000);
const PASSES = 3;
const WASM_DELAY = 3000;
const SLOW = { latency: 150, downloadThroughput: 200_000, uploadThroughput: 200_000 };
const SIZES = { bureau: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

const round = (n: number) => +n.toFixed(4);
const enhanced = (page: Page) =>
  page.waitForFunction(
    (h) => document.querySelector(h)?.getAttribute('data-state') === 'enhanced',
    HOST,
    {
      timeout: 60_000,
    },
  );

function report(row: object, load: Seen, end: Seen): void {
  const line = {
    ...row,
    load: { cls: round(load.cls), lcp: load.lcp },
    activation: {
      cls: round(end.cls - load.cls),
      clsSection: round(end.clsSection - load.clsSection),
      clsAvecEntree: round(end.clsInput - load.clsInput),
    },
    total: round(end.cls),
    shifts: end.shifts,
  };
  process.stdout.write(`${JSON.stringify(line)}\n`);
}

async function prepare(page: Page, slow: boolean, delayWasm: boolean): Promise<void> {
  if (slow) {
    const session = await page.context().newCDPSession(page);
    await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await session.send('Network.enable');
    await session.send('Network.emulateNetworkConditions', { offline: false, ...SLOW });
  }
  if (delayWasm)
    await page.route('**/*.wasm', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, WASM_DELAY));
      await route.continue();
    });
}

type Trigger = 'defilement' | 'geste' | 'sans-activation';

async function activate(page: Page, trigger: Trigger): Promise<void> {
  if (trigger === 'sans-activation') return;
  if (trigger === 'defilement') {
    await page
      .locator('#certifications')
      .evaluate((e) => e.scrollIntoView({ behavior: 'instant' }));
  } else await page.keyboard.press('Shift');
  await enhanced(page);
  await page.waitForTimeout(1500);
}

for (const [size, viewport] of Object.entries(SIZES)) {
  for (const trigger of ['defilement', 'geste', 'sans-activation'] as const) {
    for (const delayWasm of [false, true]) {
      test(`${size} ${trigger} wasm ${delayWasm ? '+3 s' : 'direct'}`, async ({
        page,
        browserName,
      }) => {
        test.skip(
          browserName !== 'chromium' || (trigger === 'geste' && !delayWasm && size === 'mobile'),
        );
        await page.setViewportSize(viewport);
        for (let pass = 1; pass <= PASSES; pass++) {
          const tab = await page.context().newPage();
          await tab.setViewportSize(viewport);
          await observe(tab, HOST);
          await prepare(tab, size === 'mobile', delayWasm);
          await tab.goto(trigger === 'geste' ? '/fr/#certifications' : '/fr/');
          await tab.waitForTimeout(2500);
          const load = await read(tab);
          await activate(tab, trigger);
          const end = await read(tab);
          report({ size, trigger, delayWasm, pass }, load, end);
          await tab.close();
        }
      });
    }
  }
}
