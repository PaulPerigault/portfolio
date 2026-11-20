import { describe, expect, it } from 'vitest';
import { allowWasm } from './wasm-csp';

describe('allowWasm', () => {
  it("n'ajoute que `self` et `wasm-unsafe-eval` aux scripts", () => {
    const scripts: string[] = [];
    allowWasm({ insertScriptResource: (resource) => scripts.push(resource) });
    expect(scripts).toEqual(["'self'", "'wasm-unsafe-eval'"]);
    expect(scripts.join(' ')).not.toMatch(/unsafe-inline|(?<!wasm-)unsafe-eval|\*|https?:/);
  });

  it('ne fait rien sans API CSP (rendu hors build, tests de composants)', () => {
    expect(() => allowWasm(undefined)).not.toThrow();
  });
});
