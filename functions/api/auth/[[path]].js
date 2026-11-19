import { handleAuth } from '../../../server/auth.mjs';

export function onRequest({ request, env }) {
  return handleAuth(request, env);
}
