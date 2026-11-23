import { expect, test, type Page } from '@playwright/test';
import { certificationsOf, approach, HOST } from './helpers/milestones';

interface LayoutShift {
  value: number;
  hadRecentInput: boolean;
  sources: { node: Node | null }[];
}

declare global {
  interface Window {
    __cspViolations: string[];
  }
}

// Message émis seul par Chromium avec le rastériseur logiciel (relevé aussi par l'audit du design system).
const BROWSER_NOISE = /GPU stall due to ReadPixels/;
const CANVAS = `${HOST} canvas`;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', (event) => {
      window.__cspViolations.push(`${event.violatedDirective} → ${event.blockedURI}`);
    });
  });
});

const problems = (page: Page): string[] => {
  const found: string[] = [];
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type()) && !BROWSER_NOISE.test(m.text()))
      found.push(m.text());
  });
  page.on('pageerror', (error) => found.push(error.message));
  return found;
};

/** Le haut de la section dans la page : la scène ne doit rien pousser au-dessus d'elle. */
const sectionTop = (page: Page) =>
  page.locator(HOST).evaluate((e) => e.getBoundingClientRect().top + window.scrollY);

for (const lang of ['fr', 'en'] as const) {
  const { items } = certificationsOf(lang);
  const [firstLabel = ''] = items.map((item) => item.name);

  test.describe(`scène 3D des certifications (${lang})`, () => {
    test('démarre après approche : canvas, wasm, panneau, console et CSP propres', async ({
      page,
    }) => {
      const found = problems(page);
      const wasm = page.waitForResponse((response) => response.url().endsWith('.wasm'));
      await page.goto(`/${lang}/`);
      await approach(page);
      expect((await wasm).headers()['content-type']).toBe('application/wasm');
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
      const box = await page.locator(CANVAS).boundingBox();
      expect(box?.width).toBeGreaterThan(0);
      expect(box?.height).toBeGreaterThan(0);
      await expect(page.locator(`${HOST} [data-pp-panel]`)).toContainText(firstLabel);
      expect(found).toEqual([]);
      expect(await page.evaluate(() => window.__cspViolations)).toEqual([]);
    });

    test('le sélecteur HTML change le panneau, le lien Credly s’y trouve', async ({ page }) => {
      await page.goto(`/${lang}/`);
      await approach(page);
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
      const panel = page.locator(`${HOST} [data-pp-panel]`);
      for (const item of items) {
        await page.locator(`${HOST} [data-pp-item="${item.id}"] button`).click();
        await expect(panel).toContainText(item.name);
        if (item.verifyUrl)
          await expect(panel.getByRole('link')).toHaveAttribute('href', item.verifyUrl);
        else await expect(panel.getByRole('link')).toHaveCount(0);
      }
      await expect(page.locator(CANVAS)).toHaveAttribute('aria-hidden', 'true');
    });

    test('un lien d’ancre qui dépasse la section ne la charge pas, elle se charge au retour', async ({
      page,
    }) => {
      await page.goto(`/${lang}/`);
      await page.locator('#contact').evaluate((section) => section.scrollIntoView());
      await page.waitForTimeout(800);
      await expect(page.locator('#contact')).toBeInViewport();
      await expect(page.locator(CANVAS)).toHaveCount(0);
      await page.locator('#certifications').evaluate((section) => section.scrollIntoView());
      await page.waitForTimeout(300);
      await page.keyboard.press('Shift');
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
    });

    test('la 3D ne déplace rien hors de la section : CLS nul, haut de la section inchangé', async ({
      page,
    }) => {
      await page.goto(`/${lang}/`);
      // La liste devient un repère d'étapes après le geste (ADR-0013) : on mesure ce qui bouge
      // ailleurs que dans la section elle-même.
      await page.evaluate((host) => {
        const w = window as unknown as { __cls: number };
        w.__cls = 0;
        const inside = (node: Node | null) =>
          !!node && !!document.querySelector(host)?.contains(node);
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as unknown as LayoutShift[])
            if (!e.hadRecentInput && !e.sources.every((source) => inside(source.node)))
              w.__cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
      }, HOST);
      const before = await sectionTop(page);
      await approach(page);
      await expect(page.locator(HOST)).toHaveAttribute('data-state', 'enhanced');
      expect(await sectionTop(page)).toBe(before);
      expect(
        await page.evaluate(() => (window as unknown as { __cls: number }).__cls),
      ).toBeLessThan(0.01);
    });
  });
}
