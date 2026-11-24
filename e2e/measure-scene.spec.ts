import { test, type Page, type CDPSession } from '@playwright/test';
import { HOST } from './helpers/milestones';

/** Mesures de la scène 3D, opt-in : MEASURE_SCENE=1 PW_ALL_BROWSERS=1, une ligne JSON par mesure. */
test.skip(process.env['MEASURE_SCENE'] !== '1', 'mesure opt-in');
test.setTimeout(120_000);
const NOISE = /GPU stall due to ReadPixels|WebGL context was lost|orientation sensor is deprecated/;
const FRAMES = 3000;
const SLOW = { latency: 150, downloadThroughput: 200_000, uploadThroughput: 200_000 };

const frames = (page: Page) =>
  page.evaluate(
    (ms) =>
      new Promise<number[]>((resolve) => {
        const times: number[] = [];
        const end = performance.now() + ms;
        const tick = (now: number) => {
          times.push(now);
          if (now < end) requestAnimationFrame(tick);
          else resolve(times.slice(1).map((t, i) => t - (times[i] ?? t)));
        };
        requestAnimationFrame(tick);
      }),
    FRAMES,
  );

const stats = (durations: number[]) => {
  const sorted = [...durations].sort((a, b) => a - b);
  const mean = durations.reduce((a, b) => a + b, 0) / (durations.length || 1);
  return {
    mean: +mean.toFixed(1),
    p95: +(sorted[Math.floor(sorted.length * 0.95)] ?? 0).toFixed(1),
  };
};

async function throttle(session: CDPSession): Promise<void> {
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await session.send('Network.enable');
  await session.send('Network.emulateNetworkConditions', { offline: false, ...SLOW });
}

async function run(page: Page, label: string, slow: boolean): Promise<void> {
  const problems: string[] = [];
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type()) && !NOISE.test(m.text())) problems.push(m.text());
  });
  page.on('pageerror', (e) => problems.push(e.message));
  if (slow) await throttle(await page.context().newCDPSession(page));
  await page.goto('/fr/');
  await page.locator('#certifications').evaluate((e) => e.scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(300);
  await page.keyboard.press('Shift');
  await page.waitForTimeout(300);
  const start = Date.now();
  await page.keyboard.press('Shift');
  const ready = await page
    .waitForFunction(
      (h) => document.querySelector(h)?.getAttribute('data-state') === 'enhanced',
      HOST,
      { timeout: 30_000 },
    )
    .then(() => Date.now() - start)
    .catch(() => null);
  const state = await page.locator(HOST).getAttribute('data-state');
  const mode = await page.locator(HOST).getAttribute('data-mode');
  const result = ready ? stats(await frames(page)) : null;
  process.stdout.write(
    `${JSON.stringify({ label, ready, state, mode, frame: result, problems })}\n`,
  );
}

test('desktop', async ({ page, browserName }) => {
  for (let pass = 1; pass <= 3; pass++)
    await run(await page.context().newPage(), `${browserName} bureau passe ${pass}`, false);
});

test('chromium cpu x4, 4g lente', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.setViewportSize({ width: 390, height: 844 });
  await run(page, 'chromium mobile x4 lente', true);
});

const REPLIS = {
  'mouvement réduit': (page: Page) => page.emulateMedia({ reducedMotion: 'reduce' }),
  saveData: (page: Page) =>
    page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', { value: { saveData: true } });
    }),
  'WebGL2 absent': (page: Page) =>
    page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string) {
        return type === 'webgl2' ? null : Reflect.apply(original, this, [type]);
      } as typeof original;
    }),
} as const;

for (const [name, prepare] of Object.entries(REPLIS)) {
  test(`chromium x4 lente, repli : ${name}`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium');
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    await run(page, `repli ${name}`, true);
  });
}

test('chromium x4 lente, repli : perte de contexte', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.setViewportSize({ width: 390, height: 844 });
  await run(page, 'avant perte', true);
  await page.locator(`${HOST} canvas`).evaluate((c: HTMLCanvasElement) => {
    c.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
  });
  await page.waitForTimeout(6000);
  const canvases = await page.locator(`${HOST} canvas`).count();
  const items = await page.locator(`${HOST} [data-pp-item]`).count();
  process.stdout.write(`${JSON.stringify({ label: 'après perte', canvases, items })}\n`);
});
