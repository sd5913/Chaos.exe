import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { handleAuth } from '../server/auth.mjs';

const origin = 'https://game.example';
const callback = '/api/auth/github/callback';
function setup() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../migrations/0001_auth.sql', import.meta.url), 'utf8'));
  const env = {
    APP_URL: origin,
    GITHUB_CLIENT_ID: 'mock-id',
    GITHUB_CLIENT_SECRET: 'mock-secret',
    DB: {
      prepare(sql) {
        const statement = sqlite.prepare(sql);
        return { bind(...values) {
          return { first: async () => statement.get(...values), run: async () => statement.run(...values) };
        } };
      },
      async batch(statements) {
        sqlite.exec('BEGIN');
        try {
          for (const statement of statements) await statement.run();
          sqlite.exec('COMMIT');
        } catch (error) {
          sqlite.exec('ROLLBACK');
          throw error;
        }
      },
    },
  };
  const calls = [];
  const provider = async (url, options) => {
    calls.push([url, options]);
    return Response.json(calls.length === 1 ? { access_token: 'fake_token' } : { id: 42, login: 'octocat' });
  };
  const request = (path, options) => handleAuth(new Request(origin + path, options), env, provider);
  return { request, calls, sqlite, env };
}

async function begin(request) {
  const response = await request('/api/auth/github');
  assert.equal(response.status, 302);
  const authorize = new URL(response.headers.get('location'));
  assert.equal(authorize.origin, 'https://github.com');
  assert.equal(authorize.searchParams.get('scope'), '');
  assert.equal(authorize.searchParams.get('redirect_uri'), origin + callback);
  assert.equal(authorize.searchParams.get('code_challenge_method'), 'S256');
  assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Lax; Secure/);
  return { state: authorize.searchParams.get('state'), cookie: response.headers.get('set-cookie').split(';')[0] };
}

test('guest, GitHub sign-in, and same-origin logout with server-side revocation', async () => {
  const { request, calls } = setup();
  const sessionPath = '/api/auth/session';
  assert.deepEqual(await (await request(sessionPath)).json(), { user: null });
  const flow = await begin(request);
  const finish = await request(callback + '?code=mock-code&state=' + flow.state, { headers: { cookie: flow.cookie } });
  assert.equal(finish.status, 302);
  assert.equal(finish.headers.get('location'), origin + '/#account');
  assert.equal(finish.headers.get('cache-control'), 'no-store');
  assert.equal(calls.length, 2);
  assert.equal(calls[1][0], 'https://api.github.com/user');
  assert.match(new URLSearchParams(calls[0][1].body).get('code_verifier'), /^[\w-]{43}$/);
  const cookie = finish.headers.getSetCookie().find(value => value.startsWith('__Host-chaos_session=')).split(';')[0];
  assert.deepEqual(await (await request(sessionPath, { headers: { cookie } })).json(), { user: { login: 'octocat' } });
  assert.equal((await request('/api/auth/logout', { method: 'POST', headers: { cookie, origin: 'https://other.example' } })).status, 403);
  assert.equal((await request('/api/auth/logout', { method: 'POST', headers: { cookie, origin } })).status, 204);
  assert.deepEqual(await (await request(sessionPath, { headers: { cookie } })).json(), { user: null });
});

test('callback rejects invalid, expired, duplicate, and consumed state', async () => {
  const { request, calls, sqlite } = setup();
  let flow = await begin(request);
  const finish = (query, cookie = flow.cookie) => request(callback + query, { headers: { cookie } });
  assert.equal((await finish('?code=x&state=wrong')).status, 400);
  assert.equal((await finish('?code=x&code=y&state=' + flow.state)).status, 400);
  sqlite.exec('UPDATE oauth_attempts SET expires_at = 0');
  assert.equal((await finish('?code=x&state=' + flow.state)).status, 400);
  assert.equal(calls.length, 0);
  flow = await begin(request);
  assert.equal((await finish('?code=x&state=' + flow.state)).status, 302);
  assert.equal((await finish('?code=x&state=' + flow.state)).status, 400);
  assert.equal(calls.length, 2);
});

test('disabled auth leaves the guest session available without D1', async () => {
  const { request, env } = setup();
  delete env.GITHUB_CLIENT_SECRET;
  delete env.DB;
  assert.deepEqual(await (await request('/api/auth/session')).json(), { user: null, enabled: false });
  assert.equal((await request('/api/auth/github')).status, 503);
});

test('provider refusal, excess scope and an invalid profile produce no session', async () => {
  for (const replies of [
    [Response.json({ error: 'bad_verification_code' })],
    [Response.json({ access_token: 'fake_token', scope: 'repo' })],
    [Response.json({ access_token: 'fake_token' }), Response.json({ id: 0, login: 'octocat' })],
  ]) {
    const { request, env, sqlite } = setup();
    const flow = await begin(request);
    const incoming = new Request(origin + callback + '?code=x&state=' + flow.state, {
      headers: { cookie: flow.cookie },
    });
    const response = await handleAuth(incoming, env, async () => replies.shift());
    assert.equal(response.status, 502);
    assert.equal(response.headers.getSetCookie().length, 1);
    assert.equal(sqlite.prepare('SELECT count(*) AS total FROM auth_sessions').get().total, 0);
  }
});

test('only the initiating browser can finish and sessions expire in D1', async () => {
  const { request, calls, sqlite } = setup();
  const flow = await begin(request);
  const other = await begin(request);
  const path = callback + '?code=x&state=' + flow.state;
  assert.equal((await request(path, { headers: { cookie: other.cookie } })).status, 400);
  assert.equal(calls.length, 0);
  const finish = await request(path, { headers: { cookie: flow.cookie } });
  const cookie = finish.headers.getSetCookie().find(value => value.startsWith('__Host-chaos_session=')).split(';')[0];
  sqlite.exec('UPDATE auth_sessions SET expires_at = 0');
  assert.deepEqual(await (await request('/api/auth/session', { headers: { cookie } })).json(), { user: null });
});

test('reauthentication revokes the previous session and creates a fresh one', async () => {
  const { request, env } = setup();
  const provider = async url => Response.json(url.includes('access_token')
    ? { access_token: 'fake_token' } : { id: 42, login: 'octocat' });
  const signIn = async (previous = '') => {
    const flow = await begin(request);
    const incoming = new Request(origin + callback + '?code=x&state=' + flow.state, {
      headers: { cookie: previous ? flow.cookie + '; ' + previous : flow.cookie },
    });
    const response = await handleAuth(incoming, env, provider);
    assert.equal(response.status, 302);
    return response.headers.getSetCookie().find(value => value.startsWith('__Host-chaos_session=')).split(';')[0];
  };
  const original = await signIn();
  const replacement = await signIn(original);
  assert.notEqual(original, replacement);
  const session = async cookie => (await request('/api/auth/session', { headers: { cookie } })).json();
  assert.deepEqual(await session(original), { user: null });
  assert.deepEqual(await session(replacement), { user: { login: 'octocat' } });
});
