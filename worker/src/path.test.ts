import { describe, expect, it } from 'vitest';
import { post, runHandler as run, SITE_ORIGIN, validBody, WORKER_URL } from './test/fakes';

describe('chemin', () => {
  it.each(['/x', '//', '/contact', '/index.html'])(
    'POST sur %s → 404, rien n’est appelé',
    async (path) => {
      const request = new Request(`${WORKER_URL.slice(0, -1)}${path}`, {
        method: 'POST',
        headers: { Origin: SITE_ORIGIN, 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      });
      const { response, body, calls } = await run(request);
      expect(response.status).toBe(404);
      expect(body).toEqual({ ok: false, error: 'not_found' });
      expect(calls).toEqual([]);
    },
  );

  it('la racine reste servie, avec une chaîne de requête', async () => {
    const { response } = await run(post(validBody));
    expect(response.status).toBe(200);
  });
});
