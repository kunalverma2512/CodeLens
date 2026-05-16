import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

const API_BASE = import.meta.env.VITE_API_BASE_URL; // http://localhost:8000/api

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const auth           = useAuth();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle GitHub OAuth callback redirect:
  // Backend sends: /login?authStatus=success#token=JWT
  useEffect(() => {
    const ghError = searchParams.get('githubAuthError') || searchParams.get('error');
    if (ghError) {
      setError(decodeURIComponent(ghError));
      return;
    }

    const authStatus = searchParams.get('authStatus');
    if (authStatus === 'success') {
      // Token is in the URL hash: #token=JWT
      const hash = window.location.hash.slice(1);
      const hashParams = new URLSearchParams(hash);
      const token = hashParams.get('token');

      if (token) {
        localStorage.setItem('token', token);
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          auth.login(token, { id: payload.userId, email: payload.email, role: payload.role });
        } catch {
          auth.login(token, {});
        }
        navigate('/dashboard', { replace: true });
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      auth.login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  /** Redirect browser to backend — backend handles the entire OAuth dance */
  const handleGitHubLogin = () => {
    window.location.href = `${API_BASE}/auth/github/start`;
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-20 bg-white">
      <div className="w-full max-w-md border-4 border-black p-6 sm:p-8 md:p-12 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 sm:mb-12">
          LOGIN
        </h2>

        {error && (
          <div className="mb-8 border-4 border-black bg-black p-4">
            <p className="text-sm font-black uppercase tracking-widest text-white">
              {error}
            </p>
          </div>
        )}

        {/* ── GitHub button — top of form, most prominent ── */}
        <button
          type="button"
          onClick={handleGitHubLogin}
          className="w-full mb-8 py-5 border-4 border-black bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3"
        >
          {/* GitHub SVG icon — no dependency */}
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
