# Developer Setup & Contribution Guide

This guide provides step-by-step instructions to set up the CodeLens development environment on your local machine.

---

## 🛠️ Prerequisites

Make sure you have the following tools installed:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Git**

---

## 📂 Project Structure

CodeLens is structured as a monorepo consisting of:
- [frontend/](file:///c:/Users/babin/Desktop/GSSoC_2026/CodeLens/frontend) - Vite-powered React client.
- [server/](file:///c:/Users/babin/Desktop/GSSoC_2026/CodeLens/server) - Node.js / Express backend API server.

---

## 🚀 Setting Up the Backend

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Open `.env` and fill in the required parameters:
   - `PORT`: Server port (e.g., `5000`)
   - `MONGO_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/codelens` or MongoDB Atlas URI)
   - `JWT_SECRET`: Secret key for JWT generation (at least 8 characters)
   - `GEMINI_API_KEY`: API key for Gemini AI features
   - `CLIENT_URL`: URL of the frontend (e.g., `http://localhost:5173`)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Mail credentials for OTP/notifications.

5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```

---

## 💻 Setting Up the Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Configure local development environmental keys if needed. The frontend connects to `http://localhost:5000` by default.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Linting and Formatting

Before submitting a Pull Request, ensure that your code complies with the project's standards by running linting checks:

- **Frontend Linting**:
  ```bash
  cd frontend
  npm run lint
  ```
- **Frontend Building**:
  ```bash
  npm run build
  ```
