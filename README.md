# CodeLens — Unified Developer Telemetry Engine

> **Stop guessing. Start growing.**  
> CodeLens aggregates your GitHub, LeetCode, and Codeforces data into a single AI-powered command center that tells you exactly what to learn next.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Architecture](#project-architecture)
  - [Directory Structure](#directory-structure)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
- [API Reference](#api-reference)
  - [Auth Endpoints](#auth-endpoints)
  - [User Endpoints](#user-endpoints)
- [Database Schema](#database-schema)
- [Frontend Pages & Components](#frontend-pages--components)
  - [Pages](#pages)
  - [Components](#components)
  - [Services](#services)
  - [Context & State Management](#context--state-management)
- [Backend Modules](#backend-modules)
  - [Auth Module](#auth-module)
  - [User Module](#user-module)
  - [AI Module (APEX AI)](#ai-module-apex-ai)
  - [Codeforces Module](#codeforces-module)
  - [GitHub Module](#github-module)
  - [CP Module](#cp-module)
  - [Tasks Module](#tasks-module)
- [Middleware & Utilities](#middleware--utilities)
- [Email Service](#email-service)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Design System](#design-system)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CodeLens is a full-stack MERN (MongoDB, Express, React, Node.js) application that solves developer skill fragmentation. It unifies a developer's technical footprint across GitHub, LeetCode, and Codeforces into a single dashboard and uses Google Gemini AI to synthesize an actionable, personalized learning roadmap.

The platform operates through three core phases:
1. **Aggregation** — Normalizes streaming APIs from GitHub, LeetCode, and Codeforces into a unified telemetry profile.
2. **AI Synthesis** — Passes the normalized data to Google Gemini, which acts as a Staff Engineer cross-referencing algorithmic bottlenecks with commit history.
3. **Actionable Output** — Generates a dynamic, milestone-based roadmap pinpointing the exact sequence of topics to master.

---

## Problem Statement

The typical developer's technical growth is fragmented:
- **GitHub** tracks code velocity, architectural complexity, and OSS collaboration.
- **LeetCode** evaluates algorithmic prowess and data structure fluency.
- **Codeforces** measures competitive agility and mathematical optimization.

Existing tools are single-dimensional and leave developers with:
- **Directional Paralysis** — "What do I learn next?"
- **Inefficient Skill Building** — Wasting time on mastered concepts while ignoring critical weaknesses.
- **Imposter Syndrome** — Inability to accurately gauge capability against the broader engineering landscape.

**CodeLens stops the guesswork. It dictates the optimal path to engineering supremacy.**

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.4 | UI framework |
| React Router DOM | ^7.13.2 | Client-side routing |
| Tailwind CSS | ^4.2.2 | Utility-first styling |
| Axios | ^1.14.0 | HTTP client |
| Vite | ^8.0.1 | Build tool & dev server |
| ESLint | ^9.39.4 | Code linting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js (ESM) | v20+ | Runtime |
| Express | ^5.2.1 | Web framework |
| MongoDB / Mongoose | ^9.3.3 | Database & ODM |
| JSON Web Token (JWT) | ^9.0.3 | Access & refresh token auth |
| bcryptjs | ^3.0.3 | Password & OTP hashing |
| axios | ^1.14.0 | Brevo API calls & GitHub OAuth |
| Zod | ^4.3.6 | Request validation |
| @google/generative-ai | ^0.24.1 | Google Gemini AI (APEX AI) |
| dotenv | ^17.3.1 | Environment management |
| cors | ^2.8.6 | Cross-origin resource sharing |
| express-rate-limit | — | Multi-layer rate limiting |

> **Email:** CodeLens uses the [Brevo Transactional Email API](https://www.brevo.com/) — no SMTP, no Nodemailer. Pure HTTPS POST via axios. See [Email Service](#email-service) for setup.

---

## Features

### ✅ Implemented
- **User Registration** with email OTP verification (6-digit, 10-min TTL)
- **User Login** with JWT access token (15 min) + refresh token (30 days)
- **GitHub OAuth 2.0** — login, signup, and connect-to-existing-account flows
- **Forgot Password** via OTP email flow
- **Password Reset** with OTP verification
- **OTP Resend** with 60-second cooldown
- **Token Refresh** — silent access token renewal via refresh token in HttpOnly cookie
- **Logout** — server-side refresh token revocation
- **Protected Routes** — client-side route guards (`ProtectedRoute` / `PublicRoute`)
- **Persistent Sessions** — token stored in `localStorage`, re-validated on app load
- **5-Layer Rate Limiting** — global, auth, OTP, API, and per-user limits
- **Responsive Navbar** — mobile hamburger menu + desktop navigation
- **User Profile** management (get, update, delete)
- **Codeforces Integration** — rating history, submission sync, problem stats
- **GitHub Intelligence** — repository data, contribution graph via REST + GraphQL APIs
- **APEX AI** — Google Gemini-powered AI chat with SSE streaming, 20 msg/hr per-user rate limit, context compiled from real platform data
- **Dashboard** — Executive summary with aggregated stats from all connected platforms
- **Explore Page** — 14-section informational landing showcasing platform features
- **FAQ Page** — 13 categorized FAQ sections
- **Contact Page** — User contact and feedback form
- **About Page** — Project and team information
- **Bug Reports Page** — Structured bug reporting interface
- **Global Error Handling** — centralized middleware for all error types
- **Input Validation** — Zod schemas for all API endpoints
- **Structured Email Templates** — styled HTML emails for OTP verification and password reset, sent via Brevo API

### 🚧 In Progress / Scaffolded
- **CP Module** — LeetCode data aggregation (Codeforces done, LeetCode pending)
- **Tasks Module** — Personalized AI-generated task and challenge tracking

---

## Project Architecture

### Directory Structure

```
CodeLens/
├── frontend/                        # React + Vite + Tailwind CSS
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images and SVGs
│   │   ├── components/
│   │   │   ├── about/               # About page components
│   │   │   │   └── AboutCarousel.jsx
│   │   │   ├── auth/                # Authentication components
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── codeforces/          # Codeforces specific components
│   │   │   │   ├── ConnectBanner.jsx
│   │   │   │   └── VerifyModal.jsx
│   │   │   ├── dashboard/           # Dashboard widgets
│   │   │   │   └── DashboardExecutiveSummary.jsx
│   │   │   ├── explore/             # Explore page sections (14 components)
│   │   │   ├── faq/                 # FAQ accordion components (13 categories)
│   │   │   ├── github/              # GitHub data visualization
│   │   │   │   └── GitHubComponents.jsx
│   │   │   ├── shared/              # Reusable application shell
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   ├── PublicRoute.jsx
│   │   │   │   └── loaders/
│   │   │   │       ├── LoaderAlt.jsx
│   │   │   │       ├── LoaderPrimary.jsx
│   │   │   │       └── LoaderSwitcher.jsx
│   │   │   └── ui/                  # Generic UI components
│   │   │       └── Hero.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state (React Context)
│   │   ├── data/
│   │   │   └── faqs/                # FAQ data (13 category files)
│   │   ├── hooks/
│   │   │   ├── useCodeforces.js     # Codeforces data hook
│   │   │   └── useDebounce.js       # Debounce utility hook
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx       # Navbar + Footer wrapper
│   │   ├── pages/                   # Application routes (24 pages)
│   │   │   ├── AboutCodeLensPage.jsx
│   │   │   ├── AccountCenterPage.jsx
│   │   │   ├── AlgoVersePage.jsx
│   │   │   ├── ApexAIPage.jsx
│   │   │   ├── ApexWorkspacePage.jsx
│   │   │   ├── BugReportsPage.jsx
│   │   │   ├── CodeforcesPage.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── ContestAtCoderPage.jsx
│   │   │   ├── ContestCodeChefPage.jsx
│   │   │   ├── ContestCodeforcesPage.jsx
│   │   │   ├── ContestLeetCodePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ExplorePage.jsx
│   │   │   ├── FAQPage.jsx
│   │   │   ├── GitHubCallbackPage.jsx
│   │   │   ├── GitHubIntelligencePage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── PracticePage.jsx
│   │   │   ├── PrivacyPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── TermsPage.jsx
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   ├── aiService.js         # AI/Gemini API calls
│   │   │   ├── apexService.js       # APEX AI chat service
│   │   │   ├── authService.js       # Auth API calls
│   │   │   ├── codeforcesService.js # Codeforces API calls
│   │   │   ├── githubService.js     # GitHub API calls
│   │   │   └── userService.js       # User profile API calls
│   │   ├── App.jsx                  # Root component + routing
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                          # Node.js + Express (ESM)
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   ├── env.js                   # Startup environment variable validation
    │   ├── gemini.js                # Google Gemini AI client
    │   └── nvidia.js                # NVIDIA NIM AI client (optional)
    ├── middlewares/
    │   ├── authMiddleware.js        # JWT access token verification
    │   ├── errorHandler.js          # Global error handler (4-arg Express)
    │   └── rateLimiter.js           # Multi-layer rate limiting
    ├── models/
    │   ├── ApexConversation.js      # APEX AI conversation history
    │   ├── CodeforcesProfile.js     # Codeforces user profile
    │   ├── CodeforcesRatingHistory.js # Rating history over time
    │   ├── CodeforcesSubmission.js  # Submission records
    │   ├── GithubData.js            # GitHub telemetry data
    │   ├── Otp.js                   # OTP schema (10-min TTL index)
    │   └── User.js                  # User schema (full telemetry model)
    ├── modules/
    │   ├── ai/                      # APEX AI module (Gemini SSE streaming)
    │   │   ├── controller.js
    │   │   ├── repository.js
    │   │   ├── routes.js
    │   │   ├── service.js
    │   │   └── validation.js
    │   ├── auth/                    # Authentication module (email + GitHub OAuth)
    │   │   ├── controller.js
    │   │   ├── repository.js
    │   │   ├── routes.js
    │   │   ├── service.js
    │   │   └── validation.js
    │   ├── codeforces/              # Codeforces data sync module
    │   │   ├── controller.js
    │   │   ├── repository.js
    │   │   ├── routes.js
    │   │   ├── service.js
    │   │   └── validation.js
    │   ├── cp/                      # Competitive programming module (scaffolded)
    │   ├── github/                  # GitHub telemetry module
    │   │   ├── controller.js
    │   │   ├── repository.js
    │   │   ├── routes.js
    │   │   ├── service.js
    │   │   └── validation.js
    │   ├── tasks/                   # Task tracking module (scaffolded)
    │   └── user/                    # User profile module
    │       ├── controller.js
    │       ├── repository.js
    │       ├── routes.js
    │       ├── service.js
    │       └── validation.js
    ├── utils/
    │   ├── ApiError.js              # Custom error class
    │   ├── ApiResponse.js           # Standardized response factory
    │   ├── codeforcesApi.js         # Codeforces public API wrapper
    │   ├── emailService.js          # Brevo API email (OTP templates)
    │   ├── otpHelper.js             # 6-digit OTP generator
    │   └── tokenHelper.js           # JWT sign & verify utilities
    ├── app.js                       # Express app config (CORS, routes, middleware)
    ├── server.js                    # Entry point (DB connect + HTTP listen)
    └── package.json
```

---

### Frontend Architecture

The frontend is a **React 19 SPA** built with Vite and styled exclusively using **Tailwind CSS v4** (Brutalist design system — strict black/white/grayscale palette).

**Routing** is handled by React Router v7. Routes are protected by two guard components:
- `ProtectedRoute` — redirects unauthenticated users to `/login`
- `PublicRoute` — redirects already-authenticated users away from auth pages

**Application Route Map:**
```
/                      → LandingPage
/login                 → LoginPage (PublicRoute)
/signup                → SignupPage (PublicRoute)
/forgot-password       → ForgotPassword (PublicRoute)
/dashboard             → DashboardPage (ProtectedRoute)
/explore               → ExplorePage (public)
/about                 → AboutCodeLensPage (public)
/faq                   → FAQPage (public)
/contact               → Contact (public)
/terms                 → TermsPage (public)
/privacy               → PrivacyPage (public)
/bug-reports           → BugReportsPage (public)
/account-center        → AccountCenterPage (ProtectedRoute)
/codeforces            → CodeforcesPage (ProtectedRoute)
/github                → GitHubIntelligencePage (ProtectedRoute)
/practice              → PracticePage (ProtectedRoute)
/apex                  → ApexAIPage (ProtectedRoute)
/apex/workspace        → ApexWorkspacePage (ProtectedRoute)
/algoverse             → AlgoVersePage (ProtectedRoute)
/contests/codeforces   → ContestCodeforcesPage (ProtectedRoute)
/contests/leetcode     → ContestLeetCodePage (ProtectedRoute)
/contests/codechef     → ContestCodeChefPage (ProtectedRoute)
/contests/atcoder      → ContestAtCoderPage (ProtectedRoute)
/auth/github/callback  → GitHubCallbackPage
/*                     → NotFoundPage
```

**Layout:** All pages are wrapped in `MainLayout` which renders `<Navbar>` at the top and `<Footer>` at the bottom with a `flex-col min-h-screen` structure.

**State Management:** A single `AuthContext` (React Context API) provides global authentication state: `user`, `token`, `isAuthenticated`, `loading`, `login()`, `logout()`. The context auto-validates the stored token against the `/api/user/profile` endpoint on every app load.

**HTTP Layer:** A centralized Axios instance (`api.js`) with:
- **Request interceptor:** Automatically attaches `Authorization: Bearer <token>` to all outgoing requests.
- **Response interceptor:** On receiving a `401`, clears storage and redirects to `/login`.

---

### Backend Architecture

The backend follows a **strict feature-based modular architecture** using ESM (`import`/`export`). Each feature module has exactly five files separating concerns:

```
module/
  ├── routes.js      — Express router + validation middleware mounting
  ├── controller.js  — Parses req/res, delegates to service, returns ApiResponse
  ├── service.js     — Core business logic, orchestration, third-party calls
  ├── repository.js  — All database queries (Mongoose layer)
  └── validation.js  — Zod schemas + validate() middleware factory
```

**Request Lifecycle:**
```
Request → CORS → Rate Limiter → express.json() → Route → Zod Validation → Auth Middleware (if protected) → Controller → Service → Repository → MongoDB
                                                                                                                ↓ (any error)
                                                                                                          Global Error Handler
```

---

## API Reference

### Auth Endpoints

Base path: `/api/auth`

| Method | Endpoint | Description | Auth Required | Body |
|---|---|---|---|---|
| `POST` | `/register` | Register new user, sends OTP via Brevo | No | `{ name, email, password }` |
| `POST` | `/verify-otp` | Verify signup OTP, returns JWT pair | No | `{ email, otp }` |
| `POST` | `/login` | Login with credentials, returns JWT pair | No | `{ email, password }` |
| `POST` | `/logout` | Revoke refresh token (server-side) | No | `{ refreshToken }` |
| `POST` | `/refresh` | Exchange refresh token for new access token | No | `{ refreshToken }` |
| `POST` | `/forgot-password` | Sends password reset OTP via Brevo | No | `{ email }` |
| `POST` | `/reset-password` | Resets password using OTP | No | `{ email, otp, newPassword }` |
| `POST` | `/resend-otp` | Resend OTP for signup or password reset | No | `{ email, purpose }` |
| `GET` | `/github` | Redirect to GitHub OAuth authorization | No | — |
| `GET` | `/github/callback` | GitHub OAuth callback handler | No | `?code&state` (query) |
| `GET` | `/github/connect-init` | Get GitHub connect URL for existing user | ✅ Cookie | — |

**OTP `purpose` values:** `"signup"` \| `"forgot-password"`

#### Example: Register
```json
POST /api/auth/register
{
  "name": "Kunal Verma",
  "email": "kunal@example.com",
  "password": "securepass123"
}
```
**Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for OTP verification.",
  "data": { "id": "...", "name": "Kunal Verma", "email": "kunal@example.com", "isVerified": false }
}
```

#### Example: Login
```json
POST /api/auth/login
{
  "email": "kunal@example.com",
  "password": "securepass123"
}
```
**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<15min-jwt>",
    "refreshToken": "<30day-jwt>",
    "user": { "id": "...", "name": "Kunal Verma", "email": "...", "role": "user", "isVerified": true }
  }
}
```

---

### User Endpoints

Base path: `/api/user` — All endpoints require `Authorization: Bearer <token>`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/profile` | Get current user's profile | — |
| `PUT` | `/profile` | Update profile fields | `{ name?, profile?, handles?, preferences? }` |
| `DELETE` | `/profile` | Delete account permanently | — |

---

### Health Check

```
GET /api/health
```
**Response:** `{ "status": "ok", "message": "CodeLens API is running" }`

---

## Database Schema

### `User` Model

| Field | Type | Description |
|---|---|---|
| `name` | String (required) | Display name |
| `email` | String (required, unique) | Login identifier, lowercased |
| `password` | String (select: false) | bcrypt hashed, min 6 chars |
| `role` | Enum: `user` \| `admin` | User role (default: `user`) |
| `isVerified` | Boolean | Email verified flag (default: `false`) |
| `authProvider` | Enum: `local` \| `google` \| `github` | Auth method |
| `profile.avatar` | String | Avatar URL |
| `profile.bio` | String | Short biography |
| `profile.college` | String | College/University |
| `profile.location` | String | Geographic location |
| `profile.skills` | `[{ name, level }]` | Skill list with `beginner`/`intermediate`/`advanced` level |
| `handles.codeforces` | String | Codeforces username |
| `handles.leetcode` | String | LeetCode username |
| `handles.github` | String | GitHub username |
| `oauth.github.id` | String | GitHub user ID |
| `oauth.github.username` | String | GitHub login handle |
| `oauth.github.profileUrl` | String | GitHub profile URL |
| `oauth.github.accessToken` | String (select: false) | GitHub OAuth access token |
| `goals` | `[{ title, type, target, progress, deadline }]` | User-defined goals |
| `activity.lastActive` | Date | Timestamp of last login |
| `activity.streak.current` | Number | Current coding streak (days) |
| `activity.streak.longest` | Number | Longest streak ever |
| `preferences.theme` | Enum: `light` \| `dark` | UI theme preference |
| `preferences.emailNotifications` | Boolean | Email notifications toggle |
| `metadata.onboardingCompleted` | Boolean | First-time setup flag |
| `createdAt` / `updatedAt` | Date | Mongoose timestamps |

---

### `Otp` Model

| Field | Type | Description |
|---|---|---|
| `email` | String (required) | Recipient email, lowercased |
| `otp` | String (required) | bcrypt-hashed OTP string |
| `purpose` | Enum: `signup` \| `forgot-password` | OTP use case |
| `createdAt` | Date (TTL: 600s) | Auto-expires after **10 minutes** |

> **Security Note:** OTPs are stored as bcrypt hashes (cost factor 4 for speed). MongoDB TTL index auto-deletes records after 10 minutes. Old OTPs for the same email+purpose are deleted before creating a new one.

---

### `ApexConversation` Model

Stores APEX AI chat history per user. Each document links to a `User` and contains a messages array with `role` (`user`/`model`) and `content` fields.

---

### `GithubData` Model

Stores aggregated GitHub telemetry: repositories, languages, contribution graph, pinned repos, and profile stats. Linked to `User` by userId.

---

### `CodeforcesProfile`, `CodeforcesRatingHistory`, `CodeforcesSubmission` Models

Three models store the full Codeforces telemetry: current rating, max rating, rank, rating history over time, and problem submission records (verdict, tags, difficulty).

---

## Frontend Pages & Components

### Pages

| Page | Route | Access | Description |
|---|---|---|---|
| `LandingPage` | `/` | Public | Hero landing page |
| `LoginPage` | `/login` | PublicRoute | Email/password form, JWT login |
| `SignupPage` | `/signup` | PublicRoute | Two-step: registration → OTP verification with 60s resend cooldown |
| `DashboardPage` | `/dashboard` | ProtectedRoute | Executive summary with GitHub/LeetCode/CF stat cards |
| `AccountCenterPage` | `/account-center` | ProtectedRoute | Profile settings, handle management, GitHub connect |
| `CodeforcesPage` | `/codeforces` | ProtectedRoute | Codeforces stats, rating graph, submission history |
| `GitHubIntelligencePage` | `/github` | ProtectedRoute | GitHub repos, languages, contribution data |
| `ApexAIPage` | `/apex` | ProtectedRoute | APEX AI entry — Gemini-powered chat |
| `ApexWorkspacePage` | `/apex/workspace` | ProtectedRoute | Full APEX AI chat workspace with SSE streaming |
| `AlgoVersePage` | `/algoverse` | ProtectedRoute | Algorithm practice area |
| `PracticePage` | `/practice` | ProtectedRoute | Problem practice interface |
| `ContestCodeforcesPage` | `/contests/codeforces` | ProtectedRoute | Codeforces contest schedule |
| `ContestLeetCodePage` | `/contests/leetcode` | ProtectedRoute | LeetCode contest schedule |
| `ContestCodeChefPage` | `/contests/codechef` | ProtectedRoute | CodeChef contest schedule |
| `ContestAtCoderPage` | `/contests/atcoder` | ProtectedRoute | AtCoder contest schedule |
| `ExplorePage` | `/explore` | Public | 14-section platform showcase |
| `FAQPage` | `/faq` | Public | 13-category FAQ accordion |
| `AboutCodeLensPage` | `/about` | Public | Project and team info |
| `Contact` | `/contact` | Public | Contact and feedback form |
| `BugReportsPage` | `/bug-reports` | Public | Bug reporting interface |
| `PrivacyPage` | `/privacy` | Public | Privacy policy |
| `TermsPage` | `/terms` | Public | Terms of service |
| `GitHubCallbackPage` | `/auth/github/callback` | Public | GitHub OAuth callback handler |
| `NotFoundPage` | `/*` | Public | 404 fallback |

#### SignupPage — Two-Step Flow
1. **Step 1:** Collects `name`, `email`, `password`. On submit, calls `POST /api/auth/register`. Advances to Step 2.
2. **Step 2:** Displays OTP input field. Calls `POST /api/auth/verify-otp`. On success, logs the user in and navigates to `/dashboard`. Features a 60-second resend cooldown managed by `useEffect` + `setInterval`.

---

### Components

#### `shared/` — Reusable Application Shell

| Component | Description |
|---|---|
| `Navbar.jsx` | Sticky top nav. Responsive with hamburger menu on mobile. Shows Login/Signup for guests; Dashboard link + user avatar initial + Logout for authenticated users. Reads from `AuthContext`. |
| `Footer.jsx` | Full-width footer with Platform links, Integrations, Legal links, and social links. |
| `ProtectedRoute.jsx` | Renders loader while auth is initializing; redirects to `/login` if not authenticated. |
| `PublicRoute.jsx` | Redirects authenticated users away from auth pages (to `/dashboard`). |
| `loaders/LoaderPrimary.jsx` | Primary full-screen loading spinner. |
| `loaders/LoaderAlt.jsx` | Alternate loader style. |
| `loaders/LoaderSwitcher.jsx` | Switches between loader variants based on context. |

#### `auth/`

| Component | Description |
|---|---|
| `ForgotPassword.jsx` | Multi-step forgot password flow: email input → OTP verification → new password entry. |

#### `codeforces/`

| Component | Description |
|---|---|
| `ConnectBanner.jsx` | Banner prompting user to connect their Codeforces handle. |
| `VerifyModal.jsx` | Modal for verifying Codeforces handle ownership. |

#### `dashboard/`

| Component | Description |
|---|---|
| `DashboardExecutiveSummary.jsx` | Aggregated stats card shown at the top of the Dashboard. |

#### `github/`

| Component | Description |
|---|---|
| `GitHubComponents.jsx` | Reusable GitHub data display components (repos, language bars, contribution graph). |

#### `about/`

| Component | Description |
|---|---|
| `AboutCarousel.jsx` | Image/info carousel for the About page. |

#### `faq/` — 13 Categorized FAQ Components

Each file corresponds to a FAQ category: Getting Started, Platform Integration, Analytics Dashboard, Roadmap, Account Management, Open Source Contribution, Data Privacy, Community, Performance, Accessibility, Legal Compliance, Troubleshooting, and a shared `FAQAccordion` component.

#### `explore/` — 14 Modular Sections

`ExploreHero`, `AIExplanation`, `FeatureGrid`, `PlatformSync`, `ArchitectureDeepDive`, `RoadmapVisualizer`, `DailyChallenge`, `Leaderboard`, `Testimonials`, `DataPrivacy`, `OpenSourceVision`, `FAQSection`, `SubscribeNewsletter`, `FinalCTA`.

---

### Services

#### `api.js` — Axios Instance
- `baseURL`: set from `VITE_API_BASE_URL` env variable
- **Request interceptor:** Reads `token` from `localStorage` and appends `Authorization: Bearer <token>` header.
- **Response interceptor:** Catches `401` errors globally, clears `localStorage`, and redirects to `/login`.

#### `authService.js`
- `register(name, email, password)`
- `verifyOtp(email, otp)`
- `login(email, password)`
- `logout(refreshToken)`
- `forgotPassword(email)`
- `resetPassword(email, otp, newPassword)`
- `resendOtp(email, purpose)`

#### `userService.js`
- `getProfile()` → `GET /api/user/profile`
- `updateProfile(data)` → `PUT /api/user/profile`

#### `codeforcesService.js`
Wraps all Codeforces sync and data fetch endpoints.

#### `githubService.js`
Wraps GitHub data fetch endpoints (REST + GraphQL via backend proxy).

#### `aiService.js` / `apexService.js`
Wraps APEX AI chat endpoints including SSE streaming connection management.

---

### Context & State Management

#### `AuthContext.jsx`

Provides global auth state using React Context API.

**State:**
| Value | Type | Description |
|---|---|---|
| `user` | Object \| null | Current authenticated user object |
| `token` | String \| null | JWT access token from localStorage |
| `isAuthenticated` | Boolean | True if both token and user are set |
| `loading` | Boolean | True while initial auth check is in progress |

**Methods:**
| Method | Description |
|---|---|
| `login(token, userData)` | Stores token in localStorage, sets user/token state |
| `logout()` | Clears localStorage and resets user/token to null |

**Initialization (`useEffect`):** On mount, reads `token` from localStorage. If found, calls `GET /api/user/profile` to validate the token and populate the `user` object. If the request fails (token expired/invalid), clears all auth state.

---

## Backend Modules

### Auth Module

**Path:** `server/modules/auth/`

Implements complete dual-authentication: email OTP and GitHub OAuth 2.0.

| File | Responsibility |
|---|---|
| `routes.js` | Mounts Zod validation middleware and delegates to controller methods |
| `controller.js` | Extracts request body, calls `AuthService`, returns `ApiResponse` or forwards errors |
| `service.js` | All business logic: hashing, token generation, OTP flow, GitHub OAuth |
| `repository.js` | All Mongoose queries: create/find/update users, OTP CRUD, GitHub identity |
| `validation.js` | Zod schemas for all auth endpoints + reusable `validate()` middleware factory |

**Auth Flow — Registration:**
```
POST /register → validate(registerSchema) → AuthController.register
→ AuthService.register():
  1. Check if email already exists (throw 409 if so)
  2. Hash password with bcrypt (cost 10)
  3. Create user (isVerified: false)
  4. Generate 6-digit plain OTP
  5. Hash OTP (bcrypt cost 4)
  6. Store hashed OTP to MongoDB (TTL 10 min)
  7. Send styled HTML verification email via Brevo API
→ Return user object (201)
```

**Auth Flow — OTP Verification:**
```
POST /verify-otp → validate(verifyOtpSchema) → AuthController.verifyOtp
→ AuthService.verifyOtp():
  1. Find OTP record by email+purpose (throw 400 if not found)
  2. bcrypt.compare(plain, hashed) — throw 400 if mismatch
  3. Mark user isVerified: true
  4. Delete OTP record
  5. Generate JWT access token (15 min) + refresh token (30 days)
→ Return { accessToken, refreshToken, user } (200)
```

**Auth Flow — GitHub OAuth (Login / Signup):**
```
GET /github → build GitHub authorization URL → redirect
↓ (user approves on GitHub)
GET /github/callback?code&state
→ AuthService.handleGithubCallback():
  1. Verify state JWT (anti-CSRF)
  2. Exchange code for GitHub access token
  3. Fetch GitHub profile + email
  4. Case 1: GitHub ID exists in DB → update lastActive, return tokens
  5. Case 2: Email exists (local account) → merge GitHub identity, return tokens
  6. Case 3: Brand new user → create account (isVerified: true), return tokens
→ Redirect to frontend with tokens in query params
```

**Auth Flow — GitHub Connect (link to existing account):**
```
GET /github/connect-init (requires auth cookie)
→ Build connect URL with mode="connect" + userId in state JWT
↓ (user approves on GitHub)
GET /github/callback?code&state (mode=connect)
→ AuthService.handleGithubCallback():
  1. Verify state JWT, extract userId
  2. Exchange code for GitHub token
  3. Check no other user has this GitHub ID (throw 409 if so)
  4. Update existing user's oauth.github fields
→ Redirect to /account-center?githubStatus=connected
```

---

### User Module

**Path:** `server/modules/user/`

Manages authenticated user profile operations.

| Endpoint | Method | Description |
|---|---|---|
| `GET /profile` | authMiddleware → getProfile | Returns full user document |
| `PUT /profile` | authMiddleware → validate → updateProfile | Updates whitelisted fields only |
| `DELETE /profile` | authMiddleware → deleteAccount | Hard deletes user document |

**Whitelisted update fields:** `name`, `profile`, `handles`, `preferences`

---

### AI Module (APEX AI)

**Path:** `server/modules/ai/`

Fully implemented. Powers the APEX AI chat system.

- Accepts user messages with a compiled context payload (Codeforces stats, GitHub data, platform handles)
- Constructs a Gemini prompt instructing the model to act as a Staff Engineer / personalized mentor
- Streams responses to the frontend using **Server-Sent Events (SSE)**
- Per-user rate limit: **20 messages per hour**
- Conversation history stored in `ApexConversation` MongoDB model
- Config: `server/config/gemini.js`

---

### Codeforces Module

**Path:** `server/modules/codeforces/`

Fully implemented. Handles all Codeforces data synchronization.

- Fetches user rating, rank, max rating from the Codeforces public API
- Syncs full rating history (all contests participated)
- Syncs problem submission records (verdict, tags, difficulty rating)
- Stores data in `CodeforcesProfile`, `CodeforcesRatingHistory`, `CodeforcesSubmission` models
- Wrapper utility: `server/utils/codeforcesApi.js`

---

### GitHub Module

**Path:** `server/modules/github/`

Fully implemented. Fetches and stores GitHub telemetry via REST and GraphQL APIs.

- Fetches public profile, repository list, pinned repos, language breakdown
- Uses the GitHub GraphQL API for contribution graph data
- Stores aggregated data in `GithubData` model linked to the user

---

### CP Module

**Path:** `server/modules/cp/`  
Scaffolded. Intended to aggregate LeetCode solved problem counts by difficulty. Codeforces data is handled by the dedicated Codeforces Module.

---

### Tasks Module

**Path:** `server/modules/tasks/`  
Scaffolded. Intended to store AI-generated task items and track user completion progress.

---

## Middleware & Utilities

### `authMiddleware.js`
JWT authentication guard applied to all protected routes.

1. Reads `Authorization` header, expects `Bearer <token>` format.
2. Calls `verifyToken(token)` (wraps `jwt.verify`).
3. Extracts `userId` from decoded payload.
4. Fetches user from DB (excludes password).
5. Attaches `user` to `req.user` for downstream handlers.
6. Returns `401` on any failure.

### `rateLimiter.js`
Multi-layer rate limiting applied at different granularities:

- **Global limiter** — caps total requests per IP across all routes
- **Auth limiter** — strict limit on `/api/auth/*` to prevent brute force
- **OTP limiter** — extra-strict limit on OTP send/resend endpoints
- **API limiter** — applied to data-fetch routes
- **Per-user APEX limiter** — 20 messages/hour per authenticated user

### `errorHandler.js`
Centralized Express error-handling middleware (4-arg signature).

| Error Type | HTTP Status | Handling |
|---|---|---|
| `ApiError` | `err.statusCode` | Passes through custom message |
| Mongoose `ValidationError` | `400` | Collects all field messages |
| Mongoose `CastError` | `400` | Invalid ObjectId format |
| Mongoose duplicate key (`11000`) | `409` | Extracts conflicting field name |
| `JsonWebTokenError` | `401` | "Invalid token" |
| `TokenExpiredError` | `401` | "Token expired" |
| Generic `Error` | `500` | `err.message` |

> In `development` mode, the `stack` trace is included in the response.

### `ApiError.js`
Custom error class extending `Error`:
```js
new ApiError(statusCode, message, isOperational?, stack?)
```

### `ApiResponse.js`
Standardized response factory:
```js
ApiResponse.success("message", data)  // { success: true, message, data }
ApiResponse.error("message", data)    // { success: false, message, data }
```

### `tokenHelper.js`
```js
generateAccessToken(payload)   // Signs JWT with JWT_SECRET, expires in JWT_ACCESS_EXPIRES_IN
generateRefreshToken(payload)  // Signs JWT with JWT_REFRESH_SECRET, expires in JWT_REFRESH_EXPIRES_IN
verifyToken(token)             // Verifies and decodes a JWT (access token)
```

### `otpHelper.js`
```js
generateOTP()  // Returns a 6-digit numeric string OTP
```

---

## Email Service

**Path:** `server/utils/emailService.js`

CodeLens uses the **[Brevo Transactional Email API](https://www.brevo.com/)** — a professional email infrastructure service. No SMTP, no Nodemailer. Email is sent via a single HTTPS POST to `https://api.brevo.com/v3/smtp/email` using `axios`.

### Why Brevo instead of Gmail/SMTP?

**1. Gmail throttles automated emails from datacenter IPs like Render**
OTPs arrived 10–15 minutes late or went straight to Spam.

**2. Gmail App Passwords caused `535 Authentication Failed` errors on shared hosting**
Users saw "Invalid login" on the signup page with no way to fix it themselves.

**3. `smtp.gmail.com` resolved to IPv6 addresses that Render and macOS couldn't route**
Emails silently failed with `ENETUNREACH` in the server logs — no useful error shown to the user.

**4. Required 5 fragile SMTP environment variables just to send a single email**
Complex and error-prone local setup for every contributor joining the project.

Brevo requires only **3 environment variables** and works reliably on any hosting platform.

### Email Templates

#### `sendVerificationOTP(email, otp)`
- Subject: *"Verify Your CodeLens Account"*
- Purple gradient header (`#667eea → #764ba2`)
- Displays the 6-digit OTP in large monospace font
- Warning: expires in 10 minutes

#### `sendPasswordResetOTP(email, otp)`
- Subject: *"Reset Your CodeLens Password"*
- Red gradient header (`#ff6b6b → #ee5a24`)
- Same OTP display format
- Warning: expires in 10 minutes, security advisory not to share

### Brevo Setup for Contributors

1. **Create a free account** at [brevo.com](https://www.brevo.com/pricing/) — the Free plan gives 300 emails/day, no credit card needed.

2. **Generate an API key:**
   - Log in → click your profile icon → **Settings** → **SMTP & API**
   - Click the **API Keys** tab → **Generate a new API key**
   - Copy the full key immediately — it is shown only once
   - Check that its status shows **Active** (green) in the keys list

3. **Add a verified sender email:**
   - Go to **Senders, Domains & IPs** → **Senders** tab
   - Click **Add a new sender** → enter your name and Gmail address
   - Verify it via the confirmation email Brevo sends you

4. **Add to `server/.env`:**
   ```env
   BREVO_API_KEY=your_api_key_here
   BREVO_SENDER_EMAIL=yourname@gmail.com
   BREVO_SENDER_NAME=CodeLens
   ```

> **Never commit your `BREVO_API_KEY` to Git.** `server/.env` is in `.gitignore`. Each contributor uses their own free Brevo account for local development.

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Server port (default: `8000`) |
| `NODE_ENV` | ✅ | `development` \| `production` |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for access token signing (min 64 chars) |
| `JWT_ACCESS_EXPIRES_IN` | ✅ | Access token expiry (e.g., `15m`) |
| `JWT_REFRESH_SECRET` | ✅ | Separate secret for refresh token signing (never reuse JWT_SECRET) |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | Refresh token expiry (e.g., `30d`) |
| `CLIENT_URL` | ✅ | Frontend origin for CORS + OAuth redirects |
| `GITHUB_CLIENT_ID` | ✅ | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | ✅ | GitHub OAuth App client secret |
| `GITHUB_CALLBACK_URL` | ✅ | GitHub OAuth callback URL |
| `GITHUB_STATE_SECRET` | Optional | JWT secret for OAuth state token (falls back to `JWT_SECRET`) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/)) |
| `NVIDIA_API_KEY` | Optional | NVIDIA NIM API key (only if NVIDIA AI features are used) |
| `BREVO_API_KEY` | ✅ | Brevo Transactional Email API key |
| `BREVO_SENDER_EMAIL` | ✅ | Verified sender email address in your Brevo account |
| `BREVO_SENDER_NAME` | Optional | Display name in recipient's inbox (default: `CodeLens`) |

> **Startup validation:** `config/env.js` checks for all required variables at startup and throws immediately if any are missing — the server will not start with incomplete configuration.

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (e.g., `http://localhost:8000/api`) |

---

## Getting Started

### Prerequisites

- **Node.js** v20+ (LTS recommended)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier
- **npm** v9+
- **Brevo account** — [register free](https://www.brevo.com/pricing/) for transactional email (300 emails/day)
- **Google Gemini API key** — from [Google AI Studio](https://aistudio.google.com/)
- **GitHub OAuth App** — create one at [github.com/settings/developers](https://github.com/settings/developers)

---

### Backend Setup

```bash
# 1. Navigate to the server directory
cd CodeLens/server

# 2. Install dependencies
npm install

# 3. Create environment file from template
cp .env.example .env
# Fill in all required variables — see Environment Variables section above

# 4. Start the development server
npm run dev
```

The API will be available at `http://localhost:8000`.

**Health check:**
```bash
curl http://localhost:8000/api/health
# → { "status": "ok", "message": "CodeLens API is running" }
```

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd CodeLens/frontend

# 2. Install dependencies
npm install

# 3. Create environment file
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

**Other commands:**
```bash
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # ESLint check
```

---

## Design System

CodeLens enforces a strict **Brutalist** design aesthetic across all UI:

| Design Token | Value |
|---|---|
| **Colors** | Pure `black` (`#000`) and `white` (`#fff`) — no other colors |
| **Border radius** | `rounded-none` — zero corner radius on all interactive elements |
| **Border width** | `border-4` (4px solid borders) — thick, assertive outlines |
| **Typography** | `font-black`, `uppercase`, `tracking-widest` or `tracking-tighter` |
| **Header scale** | `text-5xl` to `text-9xl` — dramatically large headings |
| **Shadows** | Offset box shadows (`shadow-[16px_16px_0_0_rgba(0,0,0,1)]`) — no blurred shadows |
| **Spacing** | Extremely generous padding (`py-20`, `py-32`) |
| **Hover effects** | Color inversion (white bg → black, black bg → white) or underline with `decoration-[3px]` |

**Tailwind CSS version:** v4 (via `@tailwindcss/vite` plugin).

---

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting issues or PRs.

### Quick Reference

**Branch naming:**
- `feat/feature-name` — new features
- `fix/bug-description` — bug fixes
- `docs/description` — documentation updates
- `chore/task-name` — dependencies, tooling

**Frontend rules:**
- No `rounded-*` classes (except `rounded-none`)
- No colors outside black/white/grayscale
- All headers must use `font-black uppercase`

**Backend rules:**
- `require()` is **strictly forbidden** — use ESM `import`/`export` only
- All local imports **must** include `.js` extension
- Follow the Controller → Service → Repository pattern
- All request bodies must have a Zod validation schema
- Never expose secrets or API keys in responses

**PR checklist:**
- [ ] Code passes `npm run lint`
- [ ] UI tested on mobile and desktop viewports
- [ ] PR description maps solution to the original GitHub issue
- [ ] No secrets or `.env` values committed

---

## License

This project uses the [MIT License](./LICENSE).

---

<div align="center">
  <strong>CodeLens — Stop the Guesswork. Dictate the Path.</strong><br>
  Built with ❤️ for the developer community as part of GSSoC 2026.
</div>
