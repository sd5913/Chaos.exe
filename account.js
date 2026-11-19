const screen = document.querySelector('#language-screen');
const account = document.createElement('div');
account.className = 'github-account';
account.hidden = true;
account.innerHTML = `
  <a class="button secondary" href="./api/auth/github" hidden>Sign in with GitHub / 使用 GitHub 登录</a>
  <p role="status"></p>
  <button class="button secondary" type="button" hidden>Sign out / 退出登录</button>
`;
screen.append(account);
const link = account.querySelector('a');
const status = account.querySelector('[role="status"]');
const logout = account.querySelector('button');

async function refreshAccount() {
  try {
    const response = await fetch('./api/auth/session', { cache: 'no-store' });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return;
    const session = await response.json();
    if (session.enabled === false) return;
    link.hidden = Boolean(session.user);
    logout.hidden = !session.user;
    status.textContent = session.user ? 'GitHub: ' + session.user.login : '';
    account.hidden = false;
  } catch {
    // The language buttons and the guest game are available without the API.
  }
}

logout.addEventListener('click', async () => {
  logout.disabled = true;
  try {
    const response = await fetch('./api/auth/logout', { method: 'POST' });
    if (response.status !== 204) throw new Error('Sign-out request failed');
    logout.hidden = true;
    link.hidden = false;
    status.textContent = 'Signed out / 已退出登录';
    link.focus();
  } catch {
    status.textContent = 'Could not sign out. Try again. / 退出失败，请重试。';
  } finally {
    logout.disabled = false;
  }
});

if (location.hash === '#account') {
  history.replaceState(history.state, '', location.pathname + location.search);
  document.querySelector('#enter-game').click();
}
if (location.protocol === 'http:' || location.protocol === 'https:') {
  refreshAccount();
}
