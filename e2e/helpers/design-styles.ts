import type { Page } from '@playwright/test';

/** Couleurs autorisées : les jetons, résolus par le navigateur dans le thème courant (+ transparent). */
export const allowedColors = (page: Page) =>
  page.evaluate(() => {
    const probe = document.createElement('span');
    document.body.append(probe);
    const resolve = (token: string) => {
      probe.style.color = `var(${token})`;
      return getComputedStyle(probe).color;
    };
    const tokens = [
      '--pp-color-bg',
      '--pp-color-surface',
      '--pp-color-fg',
      '--pp-color-muted',
      '--pp-color-line',
      '--pp-color-control',
      '--pp-color-accent',
      '--pp-color-on-accent',
      '--pp-color-media-placeholder',
    ];
    const colors = ['rgba(0, 0, 0, 0)', ...tokens.map(resolve)];
    probe.remove();
    return colors;
  });

/**
 * Styles décoratifs interdits par l'ADR-0012. Rayons : 0 ou ceux du design system
 * (`--pp-radius-control` 0,25 rem, `--pp-radius-surface` 0,5 rem), résolus par le navigateur.
 */
export const decorativeStyles = (page: Page) =>
  page.evaluate(() => {
    const probe = document.createElement('span');
    document.body.append(probe);
    const radius = (token: string) => {
      probe.style.borderTopLeftRadius = `var(${token})`;
      return getComputedStyle(probe).borderTopLeftRadius;
    };
    const radii = ['0px', radius('--pp-radius-control'), radius('--pp-radius-surface')];
    probe.remove();
    const corners = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
    return [...document.querySelectorAll('body, body *')].flatMap((element) => {
      const style = getComputedStyle(element);
      const found: string[] = [];
      if (style.backgroundImage.includes('gradient')) found.push('gradient');
      if (style.boxShadow !== 'none') found.push('box-shadow');
      if (style.textShadow !== 'none') found.push('text-shadow');
      if (style.backdropFilter !== 'none' && style.backdropFilter !== '')
        found.push('backdrop-filter');
      if (style.filter !== 'none') found.push('filter');
      const used = corners.map((corner) => style.getPropertyValue(`border-${corner}-radius`));
      if (used.some((value) => !radii.includes(value))) found.push(`radius ${used.join(' ')}`);
      return found.map((kind) => `${element.tagName.toLowerCase()}.${element.className} : ${kind}`);
    });
  });

export const usedColors = (page: Page) =>
  page.evaluate(() => [
    ...new Set(
      [...document.querySelectorAll('body, body *')].flatMap((element) => {
        const style = getComputedStyle(element);
        return [style.color, style.backgroundColor, style.borderTopColor];
      }),
    ),
  ]);
