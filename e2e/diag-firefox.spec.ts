import { test } from '@playwright/test';
import { approach, HOST } from './helpers/milestones';

test('diag firefox', async ({ page, browserName }) => {
  test.skip(browserName !== 'firefox');
  const log: string[] = [];
  page.on('console', (m) => log.push(`${m.type()}: ${m.text()}`.slice(0, 300)));
  page.on('pageerror', (e) => log.push(`pageerror: ${e.message}`.slice(0, 300)));
  page.on('request', (r) => /wasm|_astro/.test(r.url()) && log.push(`req ${r.url().slice(-60)}`));
  await page.goto('/fr/');
  await approach(page);
  await page.waitForTimeout(8000);
  const info = await page.evaluate((host) => {
    const c = document.createElement('canvas');
    const gl2 = !!c.getContext('webgl2');
    const el = document.querySelector(host);
    return {
      state: el?.getAttribute('data-state'),
      mode: el?.getAttribute('data-mode'),
      gl2,
      saveData: (navigator as unknown as { connection?: { saveData?: boolean } }).connection
        ?.saveData,
      cores: navigator.hardwareConcurrency,
      mem: (navigator as unknown as { deviceMemory?: number }).deviceMemory,
      scrollend: 'onscrollend' in window,
      y: scrollY,
    };
  }, HOST);
  throw new Error(`DIAG ${JSON.stringify(info)} LOG ${JSON.stringify(log)}`);
});
