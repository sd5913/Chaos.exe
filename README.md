# CLEANME.exe
A retro desktop cleanup game with a psychological horror narrative.

demo：https://sd5913.github.io/Chaos.exe/

## About the Game
**CLEANME.exe** is a desktop simulation and psychological horror game in which players take the role of a user who has lost their memories.

## Core Gameplay
The game is built around a simple interaction loop:
- Explore the desktop and open folders.
- Inspect files and discover their contents.
- Decide whether to keep or delete each file.
- Manage the computer's storage capacity.
- Complete the daily cleanup target and progress to the next day.

Some files are ordinary digital clutter, while others contain important narrative information. Reading certain files can reveal memory fragments that help the player understand the protagonist's identity.

The player is free to make their own decisions, but the cleanup requirements gradually become more restrictive.
Story Overview
The protagonist begins the game with no clear memory of their past.

As the player explores the desktop, they discover personal information that does not belong to them.

The central question of the game is: **If you could erase your past, would you choose to do so?**

## Game Structure
The current design consists of a seven-day progression.
Stage	Narrative Direction
Day 1–2	Introduce the desktop cleanup mechanics and unfamiliar files
Day 3–4	Reveal connections between files and the people involved
Day 5–6	Gradually expose the protagonist's role in the case
Day 7	Present the final decision and determine the ending


The game includes two main endings: **TE(true end)** and **BE(bad end)**

The endings are determined by the player's final decision. Memory fragments provide context and help the player understand the meaning of that decision.

## Visual Direction
The game uses a retro computer desktop interface inspired by older operating systems.

The visual design focuses on:
- Desktop windows and file management interfaces
- Pixel-inspired visual elements
- A familiar but increasingly unsettling digital environment
- A contrast between the cute appearance of Milo and the darker narrative
The horror is primarily psychological, built through file contents, system behaviour, and the player's growing awareness of the truth.
Development Scope
The current project focuses on building a playable desktop cleanup experience with a narrative progression.

The main development areas include:
- Desktop UI and file interaction
- File content and narrative design
- Daily storage and cleanup mechanics
- Milo's animation and behaviour
- Memory fragments and ending logic
All files and computer activities are fictional and simulated. The game does not access, modify, or delete the player's real files.

## Optional GitHub sign-in

The language screen offers GitHub sign-in when the auth backend is configured. Players can choose either language and begin the game as guests. Signing in shows the GitHub username and does not sync game progress. The static game can still be served on GitHub Pages.

The [course OAuth/D1 reference](https://github.com/sd5913/github-oauth-d1-template) informed the state, PKCE, profile lookup, and binding setup. This version uses Cloudflare Pages Functions alongside the existing static game. GitHub receives an explicit empty scope for public identity. D1 stores expiring login attempts and sessions. The session cookie contains an opaque random value, D1 stores its hash, and logout revokes the session. The GitHub access token is used only for the server-side profile request.

### Local verification

Run `node --test` with Node.js 24 to exercise the flow with a mocked GitHub provider and in-memory SQLite using the D1 migration. For a local Pages runtime, use the following configuration in the ignored `wrangler.jsonc` file. The UUID is a local placeholder.

```json
{
  "name": "chaos-oauth-local",
  "compatibility_date": "2026-11-19",
  "pages_build_output_dir": "./dist",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "chaos-auth-local",
      "database_id": "00000000-0000-0000-0000-000000000000"
    }
  ]
}
```

```sh
sh scripts/build-pages.sh
npx wrangler d1 migrations apply chaos-auth-local --local
npx wrangler pages dev dist --port 8788
```

Open `http://localhost:8788`. To manually verify real sign-in locally, use a maintainer-managed GitHub OAuth App with callback `http://localhost:8788/api/auth/github/callback` and copy `.dev.vars.example` to `.dev.vars` before entering its credentials. Use the same hostname throughout.

### Hosting setup for a maintainer

1. Use a Cloudflare Pages project with the repository root as its working directory, `sh scripts/build-pages.sh` as its build command, and `dist` as its output directory. Pages Functions are read from `functions/` outside the static output. [Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/)
2. Create or select a dedicated D1 database, apply `migrations/0001_auth.sql` to that database, and bind it to the Pages environment as `DB`. Use the database name when applying the migration and confirm the environment before applying it remotely. [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/) · [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/)
3. Register a GitHub OAuth App for the intended HTTPS origin, such as `https://game.example`. Register the exact callback `https://game.example/api/auth/github/callback`. Set `APP_URL` to the origin, set `GITHUB_CLIENT_ID`, and store `GITHUB_CLIENT_SECRET` as an encrypted Pages runtime secret. Keep credentials in the runtime environment. Use separate apps and bindings if enabling sign-in on a preview origin. Keep request query strings out of callback logs. [GitHub OAuth web application flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
4. Verify a guest can start normally, a successful sign-in returns to the language screen with the GitHub username, and logout clears the account. Also check canceling consent and opening the callback directly.
