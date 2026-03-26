<div align="center">
  <h1 align="center">👁️ CODELENS</h1>
  <p align="center">
    <strong>Stop Guessing. Start Growing. The unapologetically brutalist engineering telemetry platform.</strong>
  </p>
</div>

***

## ⚡ The Overview

Modern engineering growth is chaotic. You push commits to GitHub, grind algorithms on LeetCode, and compete in contests on Codeforces—but your performance data remains entirely siloed. Existing tools throw raw graphs at you without actionable context. 

**CodeLens fixes this.** CodeLens parses the chaos, normalizing your cross-platform metrics into a singular, undeniable truth. It then feeds your aggregated telemetry into **Google's Gemini AI engine** to ruthlessly identify your logic weaknesses and generate a dynamic, precision-guided roadmap to mastery.

## 🛠️ Technological Architecture

We follow a strict, highly modular, and production-ready MERN stack methodology.

### Frontend (The Interface)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS v4 (Strict Black & White Brutalist Design System)
- **Routing:** React Router v6
- **Architecture:** Feature-based modular structure (`src/features`, `src/components`, `src/layouts`).
- *Note: Pure JavaScript. No TypeScript. No `.jsx` extensions in import paths.*

### Backend (The Core Engine)
- **Runtime:** Node.js + Express
- **Architecture:** Strict ES Modules (`import`/`export`), Controller/Service/Repository pattern.
- **Database:** MongoDB via Mongoose.
- **AI Integration:** Official Google Gemini API (`@google/genai`).

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas URI)
- A valid Google Gemini API Key

### 1. Clone & Install
```bash
git clone https://github.com/your-username/CodeLens.git
cd CodeLens

# Install Frontend
cd frontend
npm install

# Install Backend
cd ../server
npm install
```

### 2. Configure Environment Variables
Create `.env` files in both the `frontend` and `server` directories based on the `.env.example` templates.

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GEMINI_KEY=your_optional_client_side_key
```

**`server/.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/codelens
JWT_SECRET=super_secret_dev_key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Initialize the Platform
```bash
# In the frontend directory:
npm run dev

# In the server directory:
npm run dev
```

## 🧠 Core Features
1. **Trilateral Sync:** Real-time data aggregation from GitHub, LeetCode, and Codeforces APIs.
2. **AI Actionable Roadmaps:** Gemini analyzes your failed submissions and generates a milestone-based curriculum.
3. **Problem of the Day:** Curated algorithm challenges based exclusively on your identified weaknesses.
4. **Radical Data Privacy:** Ephemeral LLM context ensures your telemetry remains anonymized.

## 🤝 Contribution Mandate
CodeLens is fully open source. We reject black-box algorithms dictating how engineers learn. Please refer to [`CONTRIBUTING.md`](./CONTRIBUTING.md) for our strict coding standards, PR workflow, and architectural guidelines.

## 📄 License
This codebase is released under the **MIT License**.
