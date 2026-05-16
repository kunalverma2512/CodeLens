import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ExplorePage from "./pages/ExplorePage";
import CodeforcesPage from "./pages/CodeforcesPage";
import PracticePage from "./pages/PracticePage";

import ApexAIPage from "./pages/ApexAIPage";
import AlgoVersePage from "./pages/AlgoVersePage";
import ContestCodeforcesPage from "./pages/ContestCodeforcesPage";
import ContestCodeChefPage from "./pages/ContestCodeChefPage";
import ContestLeetCodePage from "./pages/ContestLeetCodePage";
import ContestAtCoderPage from "./pages/ContestAtCoderPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import AccountCenterPage from "./pages/AccountCenterPage";
import GitHubIntelligencePage from "./pages/GitHubIntelligencePage";
import GitHubCallbackPage from "./pages/GitHubCallbackPage";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PublicRoute from "./components/shared/PublicRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/account-center"
              element={
                <ProtectedRoute>
                  <AccountCenterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/github-intelligence"
              element={
                <ProtectedRoute>
                  <GitHubIntelligencePage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/forgot-password" 
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } 
            />
            <Route path="/explore" element={<ExplorePage />} />
            {/* GitHub OAuth callback — must be public, no auth required */}
            <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
            <Route path="/practice" element={<PracticePage />} />

            <Route path="/apex-ai" element={<ApexAIPage />} />
            <Route path="/algoverse" element={<AlgoVersePage />} />
            <Route path="/contests/codeforces" element={<ContestCodeforcesPage />} />
            <Route path="/contests/codechef" element={<ContestCodeChefPage />} />
            <Route path="/contests/leetcode" element={<ContestLeetCodePage />} />
            <Route path="/contests/atcoder" element={<ContestAtCoderPage />} />
            <Route 
              path="/codeforces"
              element={
                <ProtectedRoute>
                  <CodeforcesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/terms" element={<TermsPage/>} />
            <Route path="/privacy" element={<PrivacyPage/>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
