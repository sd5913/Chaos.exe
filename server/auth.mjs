const callbackPath = '/api/auth/github/callback';
const attemptLifetime = 600;
const sessionLifetime = 8 * 60 * 60;
const tokenPattern = /^[A-Za-z0-9_-]{43}$/;
const encoder = new TextEncoder();
const privateHeaders = { 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' };

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}
function randomToken() {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}
async function digest(value) {
  return base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))));
}
function appOrigin(value) {
  try {
    const url = new URL(value);
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol === 'https:' || (loopback && url.protocol === 'http:')) &&
        url.href === url.origin + '/') return url;
  } catch {
    return null;
  }
  return null;
}
function cookieName(name, origin) {
  return (origin.protocol === 'https:' ? '__Host-' : '') + 'chaos_' + name;
}
function setCookie(name, value, lifetime, origin) {
  const secure = origin.protocol === 'https:' ? '; Secure' : '';
  return `${cookieName(name, origin)}=${value}; Path=/; Max-Age=${lifetime}; HttpOnly; SameSite=Lax${secure}`;
}
function readCookie(request, name, origin) {
  const prefix = cookieName(name, origin) + '=';
  const values = (request.headers.get('cookie') ?? '').split(';')
    .map(value => value.trim()).filter(value => value.startsWith(prefix));
  const value = values.length === 1 ? values[0].slice(prefix.length) : '';
  return tokenPattern.test(value) ? value : null;
}
function json(body, status = 200) {
  return Response.json(body, { status, headers: privateHeaders });
}
function response(status, cookies = [], location) {
  const headers = new Headers(privateHeaders);
  for (const cookie of cookies) headers.append('set-cookie', cookie);
  if (location) headers.set('location', location);
  return new Response(null, { status, headers });
}
function callbackError(status, origin, clearAttempt) {
  const result = new Response('GitHub sign-in could not be completed. <a href="/">Return to the game</a>.', {
    status,
    headers: { ...privateHeaders, 'content-type': 'text/html; charset=utf-8' },
  });
  result.headers.append('set-cookie', clearAttempt ?? setCookie('oauth', '', 0, origin));
  return result;
}

async function githubJson(provider, url, options) {
  const result = await provider(url, {
    ...options,
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
  });
  if (!result.ok) throw new Error('GitHub request failed');
  return result.json();
}

async function start(env, origin, now) {
  const state = randomToken();
  const browser = randomToken();
  const verifier = randomToken();
  await env.DB.prepare('DELETE FROM oauth_attempts WHERE expires_at <= ?').bind(now).run();
  await env.DB.prepare('DELETE FROM auth_sessions WHERE expires_at <= ?').bind(now).run();
  await env.DB.prepare('INSERT INTO oauth_attempts VALUES (?, ?, ?, ?)')
    .bind(state, await digest(browser), verifier, now + attemptLifetime).run();
  const url = new URL('https://github.com/login/oauth/authorize');
  url.search = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: new URL(callbackPath, origin).href,
    scope: '',
    state,
    code_challenge: await digest(verifier),
    code_challenge_method: 'S256',
  });
  return response(302, [setCookie('oauth', browser, attemptLifetime, origin)], url.href);
}

async function finish(request, env, url, origin, now, provider) {
  const state = url.searchParams.getAll('state');
  const code = url.searchParams.getAll('code');
  const browser = readCookie(request, 'oauth', origin);
  const clear = setCookie('oauth', '', 0, origin);
  if (!browser || state.length !== 1 || !tokenPattern.test(state[0])) {
    return callbackError(400, origin, clear);
  }
  const attempt = await env.DB.prepare(
    'DELETE FROM oauth_attempts WHERE state = ? AND browser_hash = ? AND expires_at > ? RETURNING verifier',
  ).bind(state[0], await digest(browser), now).first();
  if (!attempt || url.searchParams.has('error') || code.length !== 1 || !code[0] || code[0].length > 512) {
    return callbackError(400, origin, clear);
  }
  let profile;
  try {
    const token = await githubJson(provider, 'https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        redirect_uri: new URL(callbackPath, origin).href,
        code: code[0],
        code_verifier: attempt.verifier,
      }),
    });
    if (token?.error || (token?.scope !== undefined && token.scope !== '') ||
        typeof token?.access_token !== 'string' || !/^[A-Za-z0-9_]{1,512}$/.test(token.access_token)) {
      return callbackError(502, origin, clear);
    }
    profile = await githubJson(provider, 'https://api.github.com/user', {
      headers: {
        accept: 'application/vnd.github+json',
        authorization: 'Bearer ' + token.access_token,
        'user-agent': 'sd5913-chaos-oauth',
      },
    });
    if (!Number.isSafeInteger(profile?.id) || profile.id <= 0 ||
        typeof profile.login !== 'string' || !/^[A-Za-z0-9-]{1,39}$/.test(profile.login)) {
      return callbackError(502, origin, clear);
    }
  } catch {
    return callbackError(502, origin, clear);
  }
  const previous = readCookie(request, 'session', origin);
  const session = randomToken();
  const insert = env.DB.prepare('INSERT INTO auth_sessions VALUES (?, ?, ?, ?)')
    .bind(await digest(session), String(profile.id), profile.login, now + sessionLifetime);
  if (previous) {
    const revoke = env.DB.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').bind(await digest(previous));
    await env.DB.batch([revoke, insert]);
  } else {
    await insert.run();
  }
  return response(302, [clear, setCookie('session', session, sessionLifetime, origin)], new URL('/#account', origin).href);
}

export async function handleAuth(request, env, provider = fetch) {
  const url = new URL(request.url);
  const route = url.pathname;
  const expected = {
    '/api/auth/github': 'GET', [callbackPath]: 'GET',
    '/api/auth/session': 'GET', '/api/auth/logout': 'POST',
  };
  if (!Object.hasOwn(expected, route)) return json({ error: 'Not found' }, 404);
  if (request.method !== expected[route]) {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { ...privateHeaders, allow: expected[route] } });
  }
  const origin = appOrigin(env.APP_URL);
  if (!origin || !env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.DB) {
    return route === '/api/auth/session' ? json({ user: null, enabled: false }) : json({ error: 'GitHub sign-in is unavailable' }, 503);
  }
  if (url.origin !== origin.origin) return json({ error: 'Unexpected origin' }, 400);
  const now = Math.floor(Date.now() / 1000);
  try {
    if (route === '/api/auth/github') return await start(env, origin, now);
    if (route === callbackPath) return await finish(request, env, url, origin, now, provider);
    if (route === '/api/auth/logout' && request.headers.get('origin') !== origin.origin) {
      return json({ error: 'Unexpected origin' }, 403);
    }
    const session = readCookie(request, 'session', origin);
    const hash = session && await digest(session);
    if (route === '/api/auth/logout') {
      if (hash) await env.DB.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').bind(hash).run();
      return response(204, [setCookie('session', '', 0, origin), setCookie('oauth', '', 0, origin)]);
    }
    const user = hash && await env.DB.prepare('SELECT login FROM auth_sessions WHERE token_hash = ? AND expires_at > ?')
      .bind(hash, now).first();
    return json({ user: user ? { login: user.login } : null });
  } catch {
    return route === callbackPath ? callbackError(503, origin) : json({ error: 'GitHub sign-in is unavailable' }, 503);
  }
}
