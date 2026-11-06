import { describe, expect, it } from 'vitest';
import { createHandler } from './handler';
import { isRateLimited, rateLimitKey, type RateLimiter } from './rate-limit';
import { env, fakeFetch, post, SITE_ORIGIN, validBody } from './test/fakes';

const IP = '198.51.100.7';
const limiter = (success: boolean, seen: string[] = []): RateLimiter => ({
  limit: async ({ key }) => (seen.push(key), { success }),
});
const fromIp = (body: unknown) => {
  const request = post(body);
  request.headers.set('CF-Connecting-IP', IP);
  return request;
};
const withLimiter = (rateLimiter: RateLimiter) => ({ ...env, CONTACT_RATE_LIMITER: rateLimiter });

describe('isRateLimited', () => {
  it('compte par adresse IP du visiteur (CF-Connecting-IP), sans la conserver', async () => {
    const seen: string[] = [];
    expect(await isRateLimited(limiter(true, seen), fromIp(validBody))).toBe(false);
    expect(seen).toEqual([IP]);
  });

  it('bloque au-delà de la limite', async () => {
    expect(await isRateLimited(limiter(false), fromIp(validBody))).toBe(true);
  });

  it('ne bloque jamais sans limiteur, sans IP ou si le limiteur échoue (la règle de zone reste)', async () => {
    const broken: RateLimiter = { limit: async () => Promise.reject(new Error('panne')) };
    expect(await isRateLimited(undefined, fromIp(validBody))).toBe(false);
    expect(await isRateLimited(limiter(false), post(validBody))).toBe(false);
    expect(await isRateLimited(broken, fromIp(validBody))).toBe(false);
  });
});

describe('rateLimitKey', () => {
  it('garde une adresse IPv4 telle quelle', () => {
    expect(rateLimitKey('198.51.100.7')).toBe('198.51.100.7');
  });

  it.each([
    ['2001:db8:1:2:aaaa:bbbb:cccc:dddd', '2001:0db8:0001:0002::/64'],
    ['2001:DB8:1:2::7', '2001:0db8:0001:0002::/64'],
    ['2001:db8::1', '2001:0db8:0000:0000::/64'],
    ['::1', '0000:0000:0000:0000::/64'],
  ])('regroupe %s sur son préfixe /64', (ip, key) => {
    expect(rateLimitKey(ip)).toBe(key);
  });

  it('met deux adresses d’un même /64 sous la même clé', () => {
    expect(rateLimitKey('2001:db8:1:2::1')).toBe(rateLimitKey('2001:db8:1:2:ffff::9'));
  });

  it('ne lève pas sur une adresse mal formée', () => {
    expect(() => rateLimitKey('1:2:3:4:5:6:7:8:9::')).not.toThrow();
  });
});

describe('handler et limitation de débit', () => {
  it('répond 429 « rate_limited » avec CORS, sans Turnstile ni envoi', async () => {
    const fake = fakeFetch();
    const response = await createHandler({ fetch: fake.fetchFn })(
      fromIp(validBody),
      withLimiter(limiter(false)),
    );
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ ok: false, error: 'rate_limited' });
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(SITE_ORIGIN);
    expect(fake.calls).toEqual([]);
  });

  it('laisse passer un envoi sous la limite', async () => {
    const response = await createHandler({ fetch: fakeFetch().fetchFn })(
      fromIp(validBody),
      withLimiter(limiter(true)),
    );
    expect(response.status).toBe(200);
  });
});
