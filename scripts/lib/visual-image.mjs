// Image Playwright partagée par le job CI `visual` et `npm run test:visual:update` : même
// navigateur, mêmes polices système, même architecture (amd64, celle des runners GitHub). Sa version
// doit égaler celle de @playwright/test (scripts/workflows-visual.test.mjs).
export const VISUAL_IMAGE =
  'mcr.microsoft.com/playwright:v1.65.1-noble@sha256:1507cbfc550a63a6b7396791ca4f00df17beb56342d2447b3f106c306f525579';
export const VISUAL_PLATFORM = 'linux/amd64';
