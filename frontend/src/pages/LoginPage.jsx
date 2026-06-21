import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  // ── Unverified-email recovery state ────────────────────────────────────────
  const [isUnverified, setIsUnverified]     = useState(false);
  const [resendLoading, setResendLoading]   = useState(false);
  const [resendSuccess, setResendSuccess]   = useState(false);
  const [cooldown, setCooldown]             = useState(0);

  const { login, isAuthenticated } = useAuth();
  const navigate                   = useNavigate();
  const [searchParams]             = useSearchParams();

  // Show GitHub OAuth errors forwarded via query param from the callback
  useEffect(() => {
    const ghError = searchParams.get('githubAuthError') || searchParams.get('error');
    if (ghError) {
      setError(decodeURIComponent(ghError));
    }
  }, [searchParams]);

  // If already authenticated, redirect away from login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 60-second resend cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnverified(false);
    setResendSuccess(false);
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const userData = response.data?.user;
      if (!userData) {
        throw new Error('Login succeeded but no user data returned.');
      }
      login(userData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);

      // 403 = email registered but OTP verification never completed
      // Show a resend path so user is not stuck on a dead screen
      if (status === 403) {
        setIsUnverified(true);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend verification OTP then navigate to SignupPage Step 2.
   * The user already has an account — they just never verified.
   * We send a fresh OTP and drop them directly on the OTP entry screen
   * with their email pre-filled via router state.
   */
  const handleResendVerification = async () => {
    if (cooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setError('');
    try {
      await authService.resendOtp(email, 'signup');
      // Navigate to SignupPage Step 2 with email pre-filled.
      // SignupPage reads location.state and skips Step 1 registration form.
      navigate('/signup', {
        state: { email, skipToStep2: true }
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send verification email. Please try again.';
      setError(msg);
      setCooldown(30); // short cooldown even on failure to prevent spam
    } finally {
      setResendLoading(false);
    }
  };

  /**
   * GitHub login:
   * Redirects the browser to the backend, which builds a state JWT and
   * redirects to GitHub. GitHub redirects to /api/auth/github/callback,
   * which sets cookies and redirects to /auth/github/callback (frontend).
   */
  const handleGitHubLogin = () => {
    window.location.href = `${API_BASE}/auth/github/start?redirectPath=${encodeURIComponent('/dashboard')}`;
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-20 bg-white">
      <div className="w-full max-w-md border-4 border-black p-6 sm:p-8 md:p-12 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 sm:mb-12">
          LOGIN
        </h2>

        {/* ── Error / Unverified recovery block ── */}
        {error && (
          <div className={`mb-8 border-4 p-4 ${isUnverified ? 'border-black bg-black' : 'border-black bg-black'}`}>
            <p className="text-sm font-black uppercase tracking-widest text-white">
              {error}
            </p>

            {/* Only shown when the error is a 403 unverified-email response */}
            {isUnverified && (
              <div className="mt-4 pt-4 border-t-2 border-white/30">
                <p className="text-xs font-black uppercase tracking-widest text-white/70 mb-3">
                  Didn't receive a code or it expired?
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={cooldown > 0 || resendLoading}
                  className="text-sm font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-[2px] hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline transition-colors"
                >
                  {resendLoading
                    ? 'SENDING...'
                    : cooldown > 0
                    ? `RESEND VERIFICATION EMAIL (${cooldown}s)`
                    : 'RESEND VERIFICATION EMAIL →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Success confirmation after resend */}
        {resendSuccess && (
          <div className="mb-8 border-4 border-black bg-white p-4">
            <p className="text-sm font-black uppercase tracking-widest text-black">
              ✓ VERIFICATION EMAIL SENT — CHECK YOUR INBOX
            </p>
          </div>
        )}

        {/* ── GitHub button — top, most prominent ── */}
        <button
          type="button"
          onClick={handleGitHubLogin}
          className="w-full mb-8 py-5 border-4 border-black bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>

        <div className="relative py-1 mb-8">
          <div className="border-t-4 border-black" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-black uppercase tracking-[0.22em]">
            or sign in with email
          </span>
        </div>

        <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-black">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:border-gray-500"
              placeholder="YOUR@EMAIL.COM"
              required
            />
          </div>

          <div className="flex flex-col space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-black">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:border-gray-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-black uppercase tracking-widest text-black underline underline-offset-4 decoration-[3px] hover:text-gray-600"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors border-4 border-black rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-10 text-center border-t-4 border-black pt-8">
          <p className="text-sm font-black uppercase tracking-widest text-black">
            Don't have an account?{' '}
            <Link to="/signup" className="underline underline-offset-8 decoration-[3px] hover:text-gray-600">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
