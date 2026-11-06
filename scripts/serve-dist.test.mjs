import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { describe, expect, it } from 'vitest';

const PORT = 43917;

describe('serve-dist', () => {
  it('répond 400 à un chemin mal encodé et reste en vie', async () => {
    const server = spawn(process.execPath, ['scripts/serve-dist.mjs'], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: ['ignore', 'pipe', 'inherit'],
    });
    try {
      await once(server.stdout, 'data');
      const bad = await fetch(`http://localhost:${PORT}/%E0`);
      expect(bad.status).toBe(400);
      const next = await fetch(`http://localhost:${PORT}/inconnu/`);
      expect([200, 404]).toContain(next.status);
    } finally {
      server.kill();
    }
  });
});
