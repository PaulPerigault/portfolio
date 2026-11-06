// Les commandes `infra:*` refusent toute modification du state hors plan relu, pour tout appelant.
import { describe, expect, it } from 'vitest';
import { changeRefusal, tofuRefusal } from './lib/tf-args.mjs';

describe('modification du state refusée', () => {
  it.each([
    ['import', 'cloudflare_zone.x', 'abc'],
    ['taint', 'cloudflare_zone.x'],
    ['untaint', 'cloudflare_zone.x'],
    ['force-unlock', '-force', 'lock-id'],
    ['state', 'rm', 'cloudflare_zone.x'],
    ['state', 'mv', 'a.b', 'c.d'],
    ['state', 'push', 'terraform.tfstate'],
    ['state', 'replace-provider', 'a', 'b'],
  ])('refuse %s', (...args) => {
    expect(changeRefusal(args)).toMatch(/state ne change que par un plan relu/);
    expect(tofuRefusal(args)).not.toBeNull();
  });

  it.each([
    ['plan', '-out=x.tfplan'],
    ['apply', 'x.tfplan'],
    ['state', 'list'],
    ['output', 'contact_form_turnstile_sitekey'],
    ['init'],
    ['validate'],
  ])('laisse passer %s', (...args) => {
    expect(tofuRefusal(args)).toBeNull();
  });
});
