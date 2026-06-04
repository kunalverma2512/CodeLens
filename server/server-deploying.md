# CodeLens Server — Render Deployment Guide

**Prepared:** 2026-06-03 11:24 IST  
**Author:** Kunal Verma  
**Status:** Ready for Render deployment after the pre-deployment fixes applied on this date.

---

## Table of Contents

1. [What This Server Does](#1-what-this-server-does)
2. [Architecture Overview](#2-architecture-overview)
3. [All Services & Features](#3-all-services--features)
4. [Pre-Deployment Fixes Applied Today](#4-pre-deployment-fixes-applied-today)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [Deploying to Render — Step by Step](#6-deploying-to-render--step-by-step)
7. [Updating GitHub OAuth App for Production](#7-updating-github-oauth-app-for-production)
8. [Updating the Vercel Frontend](#8-updating-the-vercel-frontend)
9. [MongoDB Atlas Configuration](#9-mongodb-atlas-configuration)
10. [Gmail SMTP Setup for Nodemailer](#10-gmail-smtp-setup-for-nodemailer)
11. [Post-Deployment Smoke Tests](#11-post-deployment-smoke-tests)
12. [Keeping Local Development Working](#12-keeping-local-development-working)
13. [Common Errors and Their Fixes](#13-common-errors-and-their-fixes)

---

## 1. What This Server Does

CodeLens is a developer intelligence platform. The server is a **Node.js + Express REST API** that acts as the brain of the entire application. It:

- Authenticates users via email/OTP or GitHub OAuth
- Fetches and caches Codeforces competitive programming data
- Fetches and caches GitHub developer activity data
- Powers the **APEX AI** chat system using Google Gemini (streaming SSE responses)
- Sends transactional emails (OTP verification, password reset) via Gmail SMTP
- Enforces rate limiting to protect against abuse and API quota exhaustion

The frontend (React/Vite on Vercel) communicates with this server exclusively via REST API calls. All auth state is stored in secure HttpOnly cookies — no localStorage tokens.

---

## 2. Architecture Overview

```
Browser (Vercel — https://codelens.vercel.app)
        │
        │  HTTPS requests with credentials (cookies)
        │
        ▼
Render (Node.js — https://codelens-api.onrender.com)
        │
        ├── MongoDB Atlas (database — all user/CF/GitHub data)
        ├── Google Gemini API (APEX AI responses)
        ├── Codeforces Public API (CP data, no auth needed)
        ├── GitHub REST + GraphQL API (developer activity)
        └── Gmail SMTP (OTP emails via nodemailer)
```

**Why two separate domains matter:**
When Vercel (frontend) and Render (backend) are on different domains, HTTP cookies are cross-origin. Browsers apply strict rules to these:
- The cookie must have `SameSite=None` and `Secure=true` set
- The CORS response must include `Access-Control-Allow-Credentials: true`
- The Axios request must include `withCredentials: true`

All three of these are implemented correctly in this codebase as of 2026-06-03.

---

## 3. All Services & Features

### 3.1 Authentication System (`/api/auth`)

The auth module handles all user identity. It supports two completely independent auth flows:

#### Email + OTP Flow
1. **Register** (`POST /api/auth/register`) — Creates user, sends 6-digit OTP to email via Gmail SMTP
2. **Verify OTP** (`POST /api/auth/verify-otp`) — Verifies OTP, sets HttpOnly cookies (access + refresh tokens)
3. **Login** (`POST /api/auth/login`) — Validates credentials, sets cookies
4. **Forgot Password** (`POST /api/auth/forgot-password`) — Sends reset OTP via email
5. **Reset Password** (`POST /api/auth/reset-password`) — Verifies OTP, updates password
6. **Resend OTP** (`POST /api/auth/resend-otp`) — Resends OTP for signup or reset

#### GitHub OAuth Flow
1. **Start** (`GET /api/auth/github/start`) — Redirects browser to GitHub authorization page
2. **Callback** (`GET /api/auth/github/callback`) — Receives code from GitHub, exchanges for token, creates/merges user, sets cookies, redirects to frontend
3. **Connect Init** (`GET /api/auth/github/connect-init`) — Protected endpoint for already-logged-in users who want to link their GitHub account

#### Session Management
- **Get Me** (`GET /api/auth/me`) — Returns current user from cookie. Frontend calls this on startup.
- **Logout** (`POST /api/auth/logout`) — Clears cookies and revokes refresh token in DB
- **Refresh** (`POST /api/auth/refresh`) — Silently rotates access + refresh token pair

#### How Tokens Work
- **Access Token**: 15-minute JWT stored in `HttpOnly` cookie. Used for every authenticated request.
- **Refresh Token**: 30-day JWT stored in `HttpOnly` cookie. Used only to issue a new access token when it expires (silent refresh in `authMiddleware.js`).
- **Revocation**: Refresh token is bcrypt-hashed and stored in MongoDB. On logout or suspicious activity, the hash is wiped — making the token permanently invalid even if captured.

### 3.2 User Module (`/api/user`)

Handles user profile operations — updating profile, connecting/disconnecting platforms, account deletion, and fetching saved goals.

### 3.3 Codeforces Module (`/api/codeforces`)

- Fetches CF handle verification
- Syncs full submission history, rating history, and profile stats from the Codeforces Public API
- Caches data in MongoDB to avoid hammering CF API on every page load
- Computes derived stats: byTag solve counts, acceptance rate, daily activity map, contest history

### 3.4 GitHub Module (`/api/github`)

- Uses GitHub OAuth token (stored during GitHub connect flow) to call GitHub REST and GraphQL APIs
- Fetches: profile, repos, contributions (calendar heatmap via GraphQL), events, pull requests, language breakdown
- Computes: consistency score, longest streak, active days, collaboration score, language diversity
- Caches the full dataset in MongoDB (`GithubData` collection)
- Manual sync endpoint: `POST /api/github/sync` (rate limited to 1 per 15 minutes per user)

### 3.5 APEX AI Module (`/api/ai/apex`)

This is the core intelligent feature. It powers the APEX chat workspace.

- **Context Compiler** (`utils/apexContextCompiler.js`): Reads all stored user data (CF skills, GitHub activity) and computes a structured intelligence report including skill decay scores and GitHub health assessment
- **Conversations** (`POST /api/ai/apex/conversations`): Creates a new conversation, compiles context at creation time
- **List** (`GET /api/ai/apex/conversations`): Returns conversation sidebar list
- **Load** (`GET /api/ai/apex/conversations/:id`): Returns full message history
- **Delete** (`DELETE /api/ai/apex/conversations/:id`): Soft-deletes a conversation
- **Send Message** (`POST /api/ai/apex/conversations/:id/message`): Sends user message to Gemini, streams response back to frontend using **Server-Sent Events (SSE)**. Writes the complete assistant response to MongoDB on stream completion.

SSE streaming means the response arrives word-by-word (like ChatGPT) instead of all at once. This uses native Node.js streams — NOT polling.

Rate limiting: 20 messages per user per hour (`apexChatLimiter`).

### 3.6 Rate Limiting (`middlewares/rateLimiter.js`)

| Limiter | Limit | Scope |
|---|---|---|
| `globalLimiter` | 1000 req / 15 min | All routes, keyed by IP |
| `apiLimiter` | 300 req / 15 min | All `/api/*` routes, keyed by IP |
| `authRateLimit` | 20 req / 15 min | Auth routes (prevents brute force) |
| `githubSyncLimiter` | 1 req / 15 min | GitHub sync endpoint, keyed by userId |
| `apexChatLimiter` | 20 msg / hour | APEX message endpoint, keyed by userId |

### 3.7 Email Service (`utils/emailService.js`)

Two transactional emails:
1. **Verification OTP** — Sent when user registers. Contains a 6-digit code, styled HTML email with CodeLens branding.
2. **Password Reset OTP** — Sent when user requests password reset. Contains a 6-digit code.

Uses **Nodemailer** with Gmail SMTP (port 587 / STARTTLS). Requires a Gmail App Password (not your regular Gmail password).

---

## 4. Pre-Deployment Fixes Applied Today

The following bugs were identified and fixed on 2026-06-03 before deployment:

### Fix 1 — `JWT_EXPIRES_IN` name mismatch (Critical)
**Problem:** `config/env.js` was validating for `JWT_EXPIRES_IN`, but `utils/tokenHelper.js` was reading `JWT_ACCESS_EXPIRES_IN`. This meant the server would crash on startup saying the env var was missing, even though it was set correctly.  
**Fix:** Standardized to `JWT_ACCESS_EXPIRES_IN` everywhere.

### Fix 2 — Cookie `sameSite: "Lax"` blocks cross-origin auth (Critical)
**Problem:** `SameSite=Lax` cookies are NOT sent by browsers on cross-origin API requests (Axios from Vercel to Render). This would cause every protected endpoint to return `401 Access denied. No token provided.` — the most common axios auth error in deployments.  
**Fix:** Changed to `sameSite: isProd ? "None" : "Lax"`. In production, `SameSite=None; Secure=true` allows cross-origin cookies. In development, `Lax` is kept for localhost compatibility.

### Fix 3 — Missing `start` script (Critical)
**Problem:** Render looks for `npm start` to run the server in production. There was no `start` script — only `dev` which uses nodemon (inappropriate for production).  
**Fix:** Added `"start": "node server.js"` to `package.json`.

### Fix 4 — `nodemon` in production dependencies
**Problem:** `nodemon` was in `dependencies` instead of `devDependencies`. Render installs all dependencies, so this wasted build time and disk space with a dev tool.  
**Fix:** Moved `nodemon` to `devDependencies`. Render only installs `devDependencies` if the build command uses them.

### Fix 5 — Missing `trust proxy` for Render (Critical for rate limiting)
**Problem:** Render sits behind a reverse proxy. Without `app.set("trust proxy", 1)`, Express sees the same proxy IP for every user. All users share one rate limit slot — the first 300 requests from ANY user would exhaust the API rate limit for EVERYONE.  
**Fix:** Added `app.set("trust proxy", 1)` in `app.js`.

### Fix 6 — `SMTP_PORT` passed as string to Nodemailer
**Problem:** `process.env.SMTP_PORT` is always a string (`"587"`). Nodemailer expects a number. This could cause silent email failures or STARTTLS negotiation errors.  
**Fix:** Parsed with `parseInt(process.env.SMTP_PORT, 10)` and also set `secure` dynamically based on port.

### Fix 7 — Stale `CLIENT_URI` in CORS (Minor but confusing)
**Problem:** CORS `allowedOrigins` array included both `process.env.CLIENT_URL` and `process.env.CLIENT_URI`. There is no `CLIENT_URI` env var anywhere — this was dead code that created confusion.  
**Fix:** Removed `CLIENT_URI`. Only `CLIENT_URL` is used.

---

## 5. Environment Variables Reference

These are ALL the environment variables you must set in Render's dashboard:

| Variable | Example Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Must be exactly this string |
| `PORT` | `8000` | Render actually ignores this and uses its own port — but keep it set |
| `MONGO_URI` | `mongodb+srv://...` | Full Atlas connection string |
| `JWT_SECRET` | 64+ random chars | Used for access tokens |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Access token lifetime |
| `JWT_REFRESH_SECRET` | Different 64+ random chars | Must differ from JWT_SECRET |
| `JWT_REFRESH_EXPIRES_IN` | `30d` | Refresh token lifetime |
| `CLIENT_URL` | `https://your-app.vercel.app` | Your Vercel URL — no trailing slash |
| `GITHUB_CLIENT_ID` | From GitHub OAuth App | |
| `GITHUB_CLIENT_SECRET` | From GitHub OAuth App | |
| `GITHUB_CALLBACK_URL` | `https://your-api.onrender.com/api/auth/github/callback` | Must match what's in GitHub OAuth App settings |
| `GITHUB_STATE_SECRET` | 32+ random chars | Optional but recommended |
| `GEMINI_API_KEY` | From Google AI Studio | |
| `SMTP_HOST` | `smtp.gmail.com` | |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `youremail@gmail.com` | |
| `SMTP_PASS` | 16-char Gmail App Password | NOT your Gmail password |

> **Generating secure secrets:** Use `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` locally to generate JWT secrets.

---

## 6. Deploying to Render — Step by Step

### Step 1 — Push your code to GitHub
Make sure all the fixes from today are committed and pushed:
```bash
git add .
git commit -m "fix: pre-deployment sanitization for Render (cookies, CORS, trust proxy, env vars)"
git push origin main
```

### Step 2 — Create a new Web Service on Render
1. Go to [render.com](https://render.com) and click **New → Web Service**
2. Connect your GitHub repository
3. Select the repository (CodeLens)

### Step 3 — Configure Build Settings
Since your repository has both `frontend/` and `server/` folders, set:

| Setting | Value |
|---|---|
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Node Version** | `20` or `22` (set in Environment tab → Add Environment Variable: `NODE_VERSION=20`) |

### Step 4 — Add Environment Variables
In the **Environment** tab, add every variable from Section 5. Do NOT copy the `.env` file directly — paste each key and value individually.

### Step 5 — Deploy
Click **Deploy Web Service**. Watch the build logs. A successful deployment looks like:
```
Build successful
==> Starting service with 'npm start'
[dotenv] injecting env from .env
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 10000
```
> Note: Render overrides your `PORT` with its own port (usually 10000). The server uses `process.env.PORT || 5000` so this is handled automatically.

### Step 6 — Note your Render URL
It will look like: `https://codelens-api.onrender.com` (or whatever name you give it).

---

## 7. Updating GitHub OAuth App for Production

Your GitHub OAuth App currently has these URLs for local development. You MUST add production URLs.

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click your OAuth App (the one for CodeLens)
3. Update:
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-api.onrender.com/api/auth/github/callback`

> **Important:** GitHub allows only ONE callback URL. If you still want local dev to work, you need to create a **second separate OAuth App** for development (use `http://localhost:8000/api/auth/github/callback` as its callback). Store that app's Client ID and Secret in your local `.env`, and use the production app's credentials on Render.

---

## 8. Updating the Vercel Frontend

After your Render server is live, go to the Vercel dashboard:
1. Go to your CodeLens project → **Settings → Environment Variables**
2. Update `VITE_API_BASE_URL` from `http://localhost:8000/api` to `https://your-api.onrender.com/api`
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** (the environment variable change alone does not trigger a new build)

---

## 9. MongoDB Atlas Configuration

### Allow Render's IP (Network Access)
By default, Atlas blocks all connections not from whitelisted IPs. Render uses dynamic IPs, so:
1. Go to Atlas → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)

This is fine for a project at this stage. When you scale, you can use Render Private Network + Atlas Private Link.

### Connection String Format
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
Note: The `dbName` is hardcoded in `config/db.js` as `"CodeLens"`. You don't need to add it to the connection string.

---

## 10. Gmail SMTP Setup for Nodemailer

Using your regular Gmail password will NOT work. Gmail requires an **App Password**.

### How to Generate a Gmail App Password
1. Go to your Google Account → **Security**
2. Make sure **2-Step Verification** is ON
3. Go to **Security → App Passwords** (search for it if hidden)
4. Click **Select app → Mail**, **Select device → Other** → type "CodeLens Server"
5. Click **Generate**
6. Copy the 16-character password shown (spaces don't matter — copy without them)
7. Use this as `SMTP_PASS` in Render

Your `SMTP_USER` is your full Gmail address (e.g., `kunalvermah8@gmail.com`).

### Verifying Email Works
After deploying, test it by registering a new account through the live frontend. You should receive a verification OTP email within a few seconds.

---

## 11. Post-Deployment Smoke Tests

Run these in order after deployment to verify everything works:

```bash
# Set your production API base URL
API=https://your-api.onrender.com

# Test 1: Health check
curl $API/api/health
# Expected: {"status":"ok","message":"CodeLens API is running"}

# Test 2: 404 handler
curl $API/api/nonexistent
# Expected: {"success":false,"message":"Route not found"}

# Test 3: Protected route without auth
curl $API/api/auth/me
# Expected: {"success":false,"message":"Access denied. No token provided."}

# Test 4: Register flow (triggers email)
curl -X POST $API/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123!"}'
# Expected: {"success":true,"message":"Registration successful..."}
# Also check your email inbox for the OTP.
```

---

## 12. Keeping Local Development Working

After production deployment, your local `.env` should keep using the development values. The server is designed to work in both environments:

```env
# Local .env — keep these exactly as they are
PORT=8000
NODE_ENV=development           ← keeps sameSite=Lax, shows stack traces, allows localhost CORS
CLIENT_URL=http://localhost:5173
GITHUB_CALLBACK_URL=http://localhost:8000/api/auth/github/callback
```

The key differences `NODE_ENV` controls:
| Behavior | `development` | `production` |
|---|---|---|
| Cookie `sameSite` | `Lax` | `None` |
| Cookie `secure` | `false` | `true` |
| Error stack traces | Shown in response | Hidden |
| Localhost in CORS | Allowed | Blocked |

So as long as your local `.env` has `NODE_ENV=development`, everything works locally as before. You can keep adding features and testing locally, then push to GitHub and Render auto-deploys.

---

## 13. Common Errors and Their Fixes

### `401 Access denied. No token provided.` on every request after login
**Cause:** Cookie `sameSite` was `Lax` in production — browser silently dropped cookies on cross-origin requests.  
**Fix:** Applied on 2026-06-03. `sameSite=None; Secure=true` in production.

### Axios CORS errors in browser console
**Cause:** Usually one of: wrong `CLIENT_URL`, missing `credentials: true` in CORS config, or frontend not sending `withCredentials: true`.  
**Fix:** Check `CLIENT_URL` in Render matches your exact Vercel URL (no trailing slash, correct https).

### Rate limiter blocks all users after 1-2 requests
**Cause:** Missing `trust proxy` — all users appeared to have the same IP.  
**Fix:** Applied on 2026-06-03. `app.set("trust proxy", 1)` in `app.js`.

### `Missing required environment variables: JWT_ACCESS_EXPIRES_IN`
**Cause:** Server crashes on startup because env var name mismatch.  
**Fix:** Applied on 2026-06-03. Now uses `JWT_ACCESS_EXPIRES_IN` consistently.

### Emails not sending / `ECONNREFUSED smtp.gmail.com`
**Cause 1:** `SMTP_PASS` is your regular Gmail password — doesn't work, must use App Password.  
**Cause 2:** `SMTP_PORT` being passed as a string to Nodemailer.  
**Fix:** Applied on 2026-06-03. Port is now parsed with `parseInt`. Use App Password.

### GitHub OAuth redirects to wrong URL
**Cause:** `GITHUB_CALLBACK_URL` in Render env is still pointing to `localhost`.  
**Fix:** Update `GITHUB_CALLBACK_URL` to `https://your-api.onrender.com/api/auth/github/callback`. Also update it in the GitHub OAuth App settings.

### Render server goes to sleep (Free tier)
**Cause:** Render free tier spins down after 15 minutes of inactivity.  
**Fix:** The first request after spin-down takes 30-60 seconds. To avoid this, use Render's paid Starter tier ($7/month) or set up an external uptime monitor to ping `/api/health` every 14 minutes.
