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
  - [AI Module (Planned)](#ai-module-planned)
  - [CP Module (Planned)](#cp-module-planned)
  - [GitHub Module (Planned)](#github-module-planned)
  - [Tasks Module (Planned)](#tasks-module-planned)
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
| Node.js (ESM) | — | Runtime |
| Express | ^5.2.1 | Web framework |
| MongoDB / Mongoose | ^9.3.3 | Database & ODM |
| JSON Web Token (JWT) | ^9.0.3 | Authentication |
| bcryptjs | ^3.0.3 | Password hashing |
| Nodemailer | ^8.0.4 | Email/OTP service |
| Zod | ^4.3.6 | Request validation |
| @google/generative-ai | ^0.24.1 | Google Gemini AI integration |
| dotenv | ^17.3.1 | Environment management |
| cors | ^2.8.6 | Cross-origin resource sharing |

---

## Features

### ✅ Implemented
- **User Registration** with email OTP verification
- **User Login** with JWT-based authentication
- **Forgot Password** via OTP email flow
- **Password Reset** with OTP verification
- **OTP Resend** with 60 second cooldown
- **Protected Routes** — client-side route guards
- **Persistent Sessions** — token stored in `localStorage`, re-validated on app load
- **Responsive Navbar** — mobile hamburger menu + desktop navigation
- **User Profile** management (get, update, delete)
- **Explore Page** — 14-section informational landing showcasing platform features
- **Dashboard** — "Command Center" with placeholder stats layout
- **Global Error Handling** — centralized middleware for all error types
- **Input Validation** — Zod schemas for all API endpoints
- **Structured Email Templates** — styled HTML emails for OTP verification and password reset

### 🚧 Planned / Scaffolded (Modules Present, Logic Pending)
- **AI Module** — Gemini-powered analysis and roadmap generation
- **CP Module** — Codeforces & LeetCode data aggregation
- **GitHub Module** — Repository and commit data fetching
- **Tasks Module** — Personalized task/challenge tracking

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
│   │   │   ├── auth/
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── explore/             # 14 Explore page sections
│   │   │   │   ├── AIExplanation.jsx
│   │   │   │   ├── ArchitectureDeepDive.jsx
│   │   │   │   ├── DailyChallenge.jsx
│   │   │   │   ├── DataPrivacy.jsx
│   │   │   │   ├── ExploreHero.jsx
│   │   │   │   ├── FAQSection.jsx
│   │   │   │   ├── FeatureGrid.jsx
│   │   │   │   ├── FinalCTA.jsx
│   │   │   │   ├── Leaderboard.jsx
│   │   │   │   ├── OpenSourceVision.jsx
│   │   │   │   ├── PlatformSync.jsx
│   │   │   │   ├── RoadmapVisualizer.jsx
│   │   │   │   ├── SubscribeNewsletter.jsx
│   │   │   │   └── Testimonials.jsx
│   │   │   ├── shared/
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── PublicRoute.jsx
│   │   │   └── ui/
│   │   │       └── Hero.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state (React Context)
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx       # Navbar + Footer wrapper
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ExplorePage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PrivacyPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── TermsPage.jsx
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   ├── authService.js       # Auth API calls
│   │   │   └── userService.js       # User profile API calls
│   │   ├── App.jsx                  # Root component + routing
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # React DOM entry point
│   ├── index.html                   # HTML entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                          # Node.js + Express (ESM)
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   ├── env.js                   # Environment variable validation
    │   └── gemini.js                # Gemini AI client (scaffolded)
    ├── middlewares/
    │   ├── authMiddleware.js        # JWT verification middleware
    │   └── errorHandler.js          # Global error handler
    ├── models/
    │   ├── Otp.js                   # OTP schema (10-min TTL)
    │   └── User.js                  # User schema (full telemetry model)
    ├── modules/
    │   ├── auth/                    # Authentication module
    │   │   ├── controller.js
    │   │   ├── repository.js
    │   │   ├── routes.js
    │   │   ├── service.js
    │   │   └── validation.js
    │   ├── user/                    # User profile module
    │   │   ├── controller.js
    │   │   ├── repository.js
    │   │   ├── routes.js
    │   │   ├── service.js
    │   │   └── validation.js
    │   ├── ai/                      # Gemini AI module (scaffolded)
    │   ├── cp/                      # Competitive programming module (scaffolded)
    │   ├── github/                  # GitHub data module (scaffolded)
    │   └── tasks/                   # Task tracking module (scaffolded)
    ├── utils/
    │   ├── ApiError.js             # Custom error class
    │   ├── ApiResponse.js          # Standardized response class
    │   ├── emailService.js         # Nodemailer OTP email templates
    │   ├── otpHelper.js            # OTP generation utility
    │   └── tokenHelper.js          # JWT sign & verify utilities
    ├── app.js                       # Express app config (CORS, routes)
    ├── server.js                    # Entry point (DB connect + listen)
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
/              → LandingPage
/login         → LoginPage (PublicRoute)
/signup        → SignupPage (PublicRoute)
/forgot-password → ForgotPassword (PublicRoute)
/dashboard     → DashboardPage (ProtectedRoute)
/explore       → ExplorePage (public)
/terms         → TermsPage (public)
/privacy       → PrivacyPage (public)
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
Request → CORS → express.json() → Route → Zod Validation → Auth Middleware (if protected) → Controller → Service → Repository → MongoDB
                                                                                                    ↓ (any error)
                                                                                              Global Error Handler
```

---

## API Reference

### Auth Endpoints

Base path: `/api/auth`

| Method | Endpoint | Description | Auth Required | Body |
|---|---|---|---|---|
| `POST` | `/register` | Register new user, sends OTP | No | `{ name, email, password }` |
| `POST` | `/verify-otp` | Verify signup OTP, returns JWT | No | `{ email, otp }` |
| `POST` | `/login` | Login with credentials, returns JWT | No | `{ email, password }` |
| `POST` | `/forgot-password` | Sends password reset OTP | No | `{ email }` |
| `POST` | `/reset-password` | Resets password using OTP | No | `{ email, otp, newPassword }` |
| `POST` | `/resend-otp` | Resend OTP for signup or password reset | No | `{ email, purpose }` |

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
    "token": "<jwt>",
    "user": { "id": "...", "name": "Kunal Verma", "email": "...", "role": "user", "handles": {...} }
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

#### Example: Update Profile
```json
PUT /api/user/profile
Authorization: Bearer <token>
{
  "handles": {
    "github": "kunalverma2512",
    "leetcode": "kunalverma",
    "codeforces": "kunalv"
  },
  "profile": {
    "bio": "Full-stack developer",
    "college": "BITS Pilani",
    "location": "India"
  }
}
```

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
| `stats.cpStats` | ObjectId → CPStats | Reference to CP stats (future) |
| `stats.githubStats` | ObjectId → GithubStats | Reference to GitHub stats (future) |
| `stats.analytics` | ObjectId → Analytics | Reference to analytics (future) |
| `goals` | `[{ title, type, target, progress, deadline }]` | User-defined goals |
| `activity.lastActive` | Date | Timestamp of last login |
| `activity.streak.current` | Number | Current coding streak (days) |
| `activity.streak.longest` | Number | Longest streak ever |
| `preferences.theme` | Enum: `light` \| `dark` | UI theme preference |
| `preferences.emailNotifications` | Boolean | Email notifications toggle |
| `security.resetPasswordToken` | String | Token for password reset |
| `security.resetPasswordExpiry` | Date | Token expiry |
| `metadata.onboardingCompleted` | Boolean | First-time setup flag |
| `metadata.tags` | `[String]` | Arbitrary metadata tags |
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

## Frontend Pages & Components

### Pages

| Page | Route | Access | Description |
|---|---|---|---|
| `LandingPage` | `/` | Public | Hero landing (currently minimal wrapper) |
| `LoginPage` | `/login` | PublicRoute | Email/password form, JWT login |
| `SignupPage` | `/signup` | PublicRoute | Two-step form: registration → OTP verification with 60s resend cooldown |
| `DashboardPage` | `/dashboard` | ProtectedRoute | Command Center with GitHub/LeetCode/CF stat cards + Gemini AI insight panel |
| `ExplorePage` | `/explore` | Public | 14-section platform showcase page |
| `PrivacyPage` | `/privacy` | Public | Privacy policy |
| `TermsPage` | `/terms` | Public | Terms of service |

#### SignupPage — Two-Step Flow
1. **Step 1:** Collects `name`, `email`, `password`. On submit, calls `POST /api/auth/register`. Advances to Step 2.
2. **Step 2:** Displays OTP input field. Calls `POST /api/auth/verify-otp`. On success, logs the user in and navigates to `/dashboard`. Features a 60-second resend cooldown managed by `useEffect` + `setInterval`.

---

### Components

#### `shared/` — Reusable Application Shell

| Component | Description |
|---|---|
| `Navbar.jsx` | Sticky top nav. Responsive with hamburger menu on mobile. Shows Login/Signup for guests; Dashboard link + user avatar initial + Logout for authenticated users. Reads from `AuthContext`. |
| `Footer.jsx` | Full-width footer with Platform links (Dashboard, Explore), Integrations (GitHub Sync, LeetCode Auth, Codeforces API), Legal links (Privacy, Terms), and social links. |
| `ProtectedRoute.jsx` | Renders `<Loader>` while auth is initializing; redirects to `/login` if not authenticated. |
| `PublicRoute.jsx` | Redirects authenticated users away from auth pages (to `/dashboard`). |
| `Loader.jsx` | Full-screen loading spinner component. |

#### `auth/`

| Component | Description |
|---|---|
| `ForgotPassword.jsx` | Multi-step forgot password flow: email input → OTP verification → new password entry. |

#### `explore/` — 14 Modular Sections

| Component | Description |
|---|---|
| `ExploreHero.jsx` | Full-width hero banner for the Explore page |
| `AIExplanation.jsx` | Explains the Gemini AI synthesis engine |
| `FeatureGrid.jsx` | Grid of platform features |
| `PlatformSync.jsx` | Showcases GitHub, LeetCode, Codeforces sync |
| `ArchitectureDeepDive.jsx` | Technical breakdown of the platform architecture |
| `RoadmapVisualizer.jsx` | Visual representation of AI-generated learning roadmaps |
| `DailyChallenge.jsx` | Daily problem challenge feature preview |
| `Leaderboard.jsx` | Community leaderboard preview |
| `Testimonials.jsx` | User testimonials section |
| `DataPrivacy.jsx` | Data privacy and security commitment section |
| `OpenSourceVision.jsx` | Open-source mission and community vision |
| `FAQSection.jsx` | Frequently Asked Questions accordion |
| `SubscribeNewsletter.jsx` | Newsletter subscription form |
| `FinalCTA.jsx` | Final call-to-action to sign up |

#### `ui/`
| Component | Description |
|---|---|
| `Hero.jsx` | Generic hero component (used in the UI component library) |

---

### Services

#### `api.js` — Axios Instance
- `baseURL`: set from `VITE_API_BASE_URL` env variable
- **Request interceptor:** Reads `token` from `localStorage` and appends `Authorization: Bearer <token>` header.
- **Response interceptor:** Catches `401` errors globally, clears `localStorage`, and redirects to `/login`.

#### `authService.js`
Wraps all `POST /api/auth/*` endpoints:
- `register(name, email, password)`
- `verifyOtp(email, otp)`
- `login(email, password)`
- `forgotPassword(email)`
- `resetPassword(email, otp, newPassword)`
- `resendOtp(email, purpose)`

#### `userService.js`
- `getProfile()` → `GET /api/user/profile`
- `updateProfile(data)` → `PUT /api/user/profile`

---

### Context & State Management

#### `AuthContext.jsx`

Provides global auth state using React Context API.

**State:**
| Value | Type | Description |
|---|---|---|
| `user` | Object \| null | Current authenticated user object |
| `token` | String \| null | JWT token from localStorage |
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

Implements complete email-based authentication:

| File | Responsibility |
|---|---|
| `routes.js` | Mounts Zod validation middleware and delegates to controller methods |
| `controller.js` | Extracts request body, calls `AuthService`, returns `ApiResponse` or forwards errors to global handler |
| `service.js` | All business logic: hashing passwords/OTPs, generating tokens, orchestrating email sends |
| `repository.js` | All Mongoose queries: create/find/update users, OTP CRUD |
| `validation.js` | Zod schemas for all 6 auth endpoints + reusable `validate()` middleware factory |

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
  7. Send styled HTML verification email
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
  5. Generate JWT access token
→ Return { token, user } (200)
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

### AI Module (Planned)

**Path:** `server/modules/ai/`  
Folder scaffolded. Intended integration with `@google/generative-ai` to:
- Accept normalized platform stats payload
- Construct a prompt instructing Gemini to act as a Staff Engineer
- Return a deterministic JSON roadmap
- Config: `server/config/gemini.js`

---

### CP Module (Planned)

**Path:** `server/modules/cp/`  
Folder scaffolded. Intended to:
- Fetch and store Codeforces rating, contest history, problem-solving stats
- Fetch and store LeetCode solved problem counts by difficulty

---

### GitHub Module (Planned)

**Path:** `server/modules/github/`  
Folder scaffolded. Intended to:
- Fetch GitHub commit history, repository count, contribution graph
- Store aggregated stats linked to the User document

---

### Tasks Module (Planned)

**Path:** `server/modules/tasks/`  
Folder scaffolded. Intended to:
- Store AI-generated task items and learning milestones
- Track user task completion progress

---

## Middleware & Utilities

### `authMiddleware.js`
JWT authentication guard applied to all protected routes.

1. Reads `Authorization` header, expects `Bearer <token>` format.
2. Calls `verifyToken(token)` (wraps `jwt.verify`).
3. Extracts `userId` from decoded payload.
4. Fetches user from DB (excludes password).
5. Attaches `user` to `req.user` for downstream handlers.
6. Returns `401` on any failure without forwarding to global handler.

### `errorHandler.js`
Centralized Express error-handling middleware (4-arg signature). Handles:

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
generateAccessToken(payload)  // Signs JWT with JWT_SECRET + JWT_EXPIRES_IN
verifyToken(token)             // Verifies and decodes JWT
```

### `otpHelper.js`
```js
generateOTP()  // Returns a 6-digit numeric string OTP
```

---

## Email Service

**Path:** `server/utils/emailService.js`

Uses **Nodemailer** with SMTP transport. Two styled HTML email templates:

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

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Server port (e.g., `5000`) |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | ✅ | JWT expiry duration (e.g., `7d`) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `CLIENT_URL` | ✅ | Frontend origin for CORS |
| `NODE_ENV` | ✅ | `development` \| `production` |
| `SMTP_HOST` | ✅ | SMTP server hostname |
| `SMTP_PORT` | ✅ | SMTP server port (e.g., `587`) |
| `SMTP_USER` | ✅ | SMTP sender email |
| `SMTP_PASS` | ✅ | SMTP sender password |

> **Startup validation:** `config/env.js` checks for all required variables at startup and throws immediately if any are missing.

**Template (`server/.env.example`):**
```env
PORT=
MONGO_URI=
```

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (e.g., `http://localhost:5000/api`) |

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (recommend v20 LTS)
- **MongoDB** (local instance or MongoDB Atlas)
- **npm** v9+
- SMTP credentials (Gmail, Mailtrap, or similar)
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/))

---

### Backend Setup

```bash
# 1. Navigate to the server directory
cd CodeLens/server

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Fill in all required variables in .env

# 4. Start the development server
node server.js
```

The API will be available at `http://localhost:5000`.

**Health check:**
```bash
curl http://localhost:5000/api/health
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
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

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
| **Disabled states** | `opacity-50` with grayscale fallbacks |
| **Hover effects** | Color inversion (white bg → black, black bg → white) or underline with thick `decoration-[3px]` |

**Tailwind CSS version:** v4 (via `@tailwindcss/vite` plugin).

---

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting issues or PRs.

### Quick Reference

**Branch naming:**
- `feat/feature-name` — new features
- `fix/bug-description` — bug fixes
- `chore/task-name` — docs, dependencies, tooling

**Frontend rules:**
- No `rounded-*` classes (except `rounded-none`)
- No colors outside black/white/grayscale
- All headers must use `font-black uppercase`

**Backend rules:**
- `require()` is **strictly forbidden** — use ESM `import`/`export` only
- All local imports **must** include `.js` extension
- Follow the Controller → Service → Repository pattern
- All request bodies must have a Zod validation schema

**PR checklist:**
- [ ] Code passes `npm run lint`
- [ ] UI tested on mobile and desktop viewports
- [ ] PR description maps solution to the original GitHub issue

---

## License

This project uses the [MIT License](./LICENSE).

---

<div align="center">
  <strong>CodeLens — Stop the Guesswork. Dictate the Path.</strong><br>
  Built with ❤️ for the developer community as part of GSSoC 2026.
</div>
