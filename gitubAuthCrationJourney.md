# GitHub Auth Creation Journey

## Objective
Implement a **professional, backend-only GitHub authentication flow** in the existing CodeLens architecture without breaking current local auth.

---

## Existing Backend Study (Before Coding)
I first audited the backend structure and found:

- Modular pattern already followed: `routes -> controller -> service -> repository`.
- Auth APIs already existed for local email/password + OTP verification.
- `User` model already had `authProvider` with `github` enum, but no real GitHub OAuth flow.
- Empty placeholder module existed under `server/modules/github/`.
- `.env.example` did not include GitHub OAuth keys.
- CORS config in `server/app.js` used `CLIENT_URI` while env validation expected `CLIENT_URL`.

---

## What I Implemented

### 1) User model extension for GitHub identity
**File:** `server/models/User.js`

Added OAuth identity block:

- `oauth.github.id` (unique + sparse + indexed)
- `oauth.github.username`
- `oauth.github.profileUrl`

This allows safe account linking and id-based GitHub user lookup.

---

### 2) Repository support for GitHub lookup/linking
**File:** `server/modules/auth/repository.js`

Added:

- `findUserByGithubId(githubId)`
- `updateUserGithubIdentity(userId, githubIdentity)`

This keeps DB operations centralized and consistent with existing repository style.

---

### 3) Query validation for OAuth endpoints
**File:** `server/modules/auth/validation.js`

Added:

- `githubStartSchema`
- `githubCallbackSchema`
- generic `validateQuery(schema)` middleware

This keeps OAuth query params validated in the same clean style as existing body validation.

---

### 4) Full GitHub OAuth service flow
**File:** `server/modules/auth/service.js`

Implemented end-to-end logic:

- Generate GitHub authorization URL with signed `state`.
- Verify state token on callback.
- Exchange `code` for GitHub access token.
- Fetch profile from GitHub API.
- Resolve email via `/user/emails` when profile email is missing.
- Handle two modes:
  - **login mode**: login/signup through GitHub and issue JWT.
  - **connect mode**: link GitHub to currently authenticated local user.
- Build frontend redirect URLs with:
  - query params for status/errors
  - hash fragment for token transfer (`#token=...`) in login flow.

---

### 5) Auth controller routes for OAuth
**File:** `server/modules/auth/controller.js`

Added controller methods:

- `startGithubAuth`
- `startGithubConnect`
- `githubCallback`

Behavior:

- Start endpoints redirect to GitHub auth URL.
- Callback handles token/link flow and redirects to frontend.
- On callback failure, redirects to frontend login with `githubAuthError`.

---

### 6) Route wiring
**File:** `server/modules/auth/routes.js`

Added endpoints:

- `GET /api/auth/github/start` (public login/signup via GitHub)
- `GET /api/auth/github/connect` (protected account-link flow)
- `GET /api/auth/github/callback` (GitHub callback)

`/github/connect` is protected using existing `authMiddleware`.

---

### 7) CORS compatibility fix
**File:** `server/app.js`

Adjusted allowed origins to include:

- `process.env.CLIENT_URL`
- existing `process.env.CLIENT_URI` fallback
- localhost default

This prevents OAuth frontend redirect-origin mismatch in environments using `CLIENT_URL`.

---

### 8) Environment variables for local testing
**File:** `server/.env.example`

Added required GitHub OAuth placeholders:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL`
- `GITHUB_STATE_SECRET` (optional but recommended)

Also replaced hardcoded NVIDIA key with placeholder to keep example file safe.

---

## Errors Faced & How They Were Solved

### Error 1: Backend test script fails by default
**What happened:**
`npm test` returns: `Error: no test specified`.

**Why:**
Project currently has no real test suite in `server/package.json`.

**Resolution:**
Treated as a **pre-existing baseline limitation**. Used targeted validation instead:

- `node --check` on changed files.
- runtime smoke test for GitHub auth URL generation.

---

### Error 2: Potential CORS variable mismatch (`CLIENT_URI` vs `CLIENT_URL`)
**What happened:**
App CORS relied on `CLIENT_URI`, but env config and examples use `CLIENT_URL`.

**Impact:**
Could break frontend OAuth redirect-origin behavior in local/prod setups.

**Resolution:**
Updated CORS origin list to include both keys (backward compatible).

---

### Error 3: Need robust account linking without breaking existing users
**What happened:**
Local-auth users and GitHub-auth users require controlled linking to avoid accidental duplicate mappings.

**Resolution:**
Added GitHub id-based lookup + sparse unique index + explicit connect mode flow. Linking now occurs through repository methods and protected route for authenticated users.

---

## Final OAuth API Flow (Backend)

1. Frontend redirects user to:
   - `GET /api/auth/github/start` for GitHub signup/login
   - `GET /api/auth/github/connect` for linking from signed-in account
2. Backend redirects user to GitHub OAuth consent.
3. GitHub redirects back to:
   - `GET /api/auth/github/callback?code=...&state=...`
4. Backend validates state, fetches GitHub user/email, logs in or links account.
5. Backend redirects to frontend with success/error context and token (hash fragment in login mode).

---

## Local Setup Notes
Use these in `server/.env` when testing:

- `CLIENT_URL=http://localhost:5173`
- `GITHUB_CLIENT_ID=<from github oauth app>`
- `GITHUB_CLIENT_SECRET=<from github oauth app>`
- `GITHUB_CALLBACK_URL=http://localhost:8000/api/auth/github/callback`
- `GITHUB_STATE_SECRET=<strong_random_secret>` (recommended)

And in your GitHub OAuth app settings:

- Authorization callback URL must match `GITHUB_CALLBACK_URL` exactly.

---

## Files Changed

- `server/models/User.js`
- `server/modules/auth/repository.js`
- `server/modules/auth/validation.js`
- `server/modules/auth/service.js`
- `server/modules/auth/controller.js`
- `server/modules/auth/routes.js`
- `server/app.js`
- `server/.env.example`
- `gitubAuthCrationJourney.md`

