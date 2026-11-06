/** Binding `ratelimits` de Cloudflare (`wrangler.toml`) : compteur par clé, tenu par Cloudflare. */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

const IPV6_GROUPS = 8;
const IPV6_PREFIX_GROUPS = 4;
const IPV6_GROUP_WIDTH = 4;

/**
 * Clé de limite : l'adresse IPv4 telle quelle, le préfixe /64 pour une adresse IPv6 (un visiteur
 * IPv6 dispose d'un /64 entier, la limite ne doit pas s'y contourner en changeant d'adresse).
 */
export function rateLimitKey(ip: string): string {
  if (!ip.includes(':') || ip.includes('.')) return ip;
  const [head = '', tail] = ip.split('::');
  const first = head === '' ? [] : head.split(':');
  const last = tail === undefined || tail === '' ? [] : tail.split(':');
  const zeros =
    tail === undefined
      ? []
      : Array<string>(Math.max(0, IPV6_GROUPS - first.length - last.length)).fill('0');
  return `${[...first, ...zeros, ...last]
    .slice(0, IPV6_PREFIX_GROUPS)
    .map((group) => group.toLowerCase().padStart(IPV6_GROUP_WIDTH, '0'))
    .join(':')}::/64`;
}

/**
 * Vrai si le visiteur a dépassé la limite (`RATE_LIMIT`). La clé est son adresse IP (préfixe /64 en IPv6), transmise
 * par Cloudflare (`CF-Connecting-IP`) : comptée par Cloudflare le temps de la fenêtre, jamais
 * conservée ni journalisée par le Worker. Sans limiteur, sans IP ou en cas d'erreur, rien n'est
 * bloqué : la règle de limitation de la zone reste la première barrière, Turnstile la seconde.
 */
export async function isRateLimited(
  limiter: RateLimiter | undefined,
  request: Request,
): Promise<boolean> {
  const key = request.headers.get('CF-Connecting-IP');
  if (!limiter || !key) return false;
  try {
    return !(await limiter.limit({ key: rateLimitKey(key) })).success;
  } catch {
    return false;
  }
}
