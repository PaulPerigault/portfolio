// Invariant : le state d'infra/identity vit dans un bucket que ni les autres backends ni la clé de
// lecture CI (`local.state_bucket` de r2.tf) ne désignent.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(new URL(`../infra/${path}`, import.meta.url), 'utf8');
const backendBucket = (dir) => /bucket\s*=\s*"([^"]+)"/.exec(read(`${dir}backend.tf`))?.[1];
const readKeyBucket = /state_bucket\s*=\s*"([^"]+)"/.exec(read('identity/r2.tf'))?.[1];
const identity = backendBucket('identity/');

describe('bucket du state d’infra/identity', () => {
  it('est lu dans le backend', () => {
    expect(identity).toBeTruthy();
    expect(readKeyBucket).toBeTruthy();
  });

  it.each(['', 'github/', 'registrar/'])('diffère du bucket du backend infra/%s', (dir) => {
    expect(backendBucket(dir)).toBeTruthy();
    expect(identity).not.toBe(backendBucket(dir));
  });

  it('diffère de local.state_bucket (portée de la clé S3 en lecture seule)', () => {
    expect(identity).not.toBe(readKeyBucket);
  });
});
