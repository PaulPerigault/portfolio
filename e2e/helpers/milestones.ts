import type { Page } from '@playwright/test';
import { loadContent, type TestLang } from './content';

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  code?: string;
  status: 'achieved' | 'planned';
  date?: string;
  verifyUrl?: string;
  badge?: { src: string; width: number; height: number };
}

export interface CertificationContent {
  goal: { label: string };
  items: CertificationItem[];
}

export const HOST = '[data-pp-milestones]';

/** Le parcours dans l'ordre de la liste : date croissante, sans date en dernier. */
export const certificationsOf = (lang: TestLang): CertificationContent => {
  const content = loadContent<CertificationContent>(lang, 'certifications');
  const undated = '9999';
  const items = [...content.items].sort((a, b) =>
    (a.date ?? undated).localeCompare(b.date ?? undated),
  );
  return { ...content, items };
};

/** Étapes de la liste : les certifications, puis l'objectif. */
export const stepCount = (content: CertificationContent): number => content.items.length + 1;

/** Amène la section à l'écran puis fait le geste que le composant attend avant de charger la 3D. */
export const approach = async (page: Page): Promise<void> => {
  await page.locator('#certifications').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.keyboard.press('Shift');
  // Le premier geste arme l'observation ; le suivant, avec la section déjà à l'écran, charge la scène.
  await page.waitForTimeout(300);
  await page.keyboard.press('Shift');
};
