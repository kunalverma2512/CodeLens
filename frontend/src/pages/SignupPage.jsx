import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SignupPage() {
  const [step, setStep]           = useState(1);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [otp, setOtp]             = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [cooldown, setCooldown]   = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const { login, isAuthenticated } = useAuth();
  const navigate                   = useNavigate();
  const [searchParams]             = useSearchParams();
  const isPasswordValid            = password.length >= 6;

  // Show GitHub OAuth errors forwarded from the callback
  useEffect(() => {
    const ghError = searchParams.get("githubAuthError") || searchParams.get("error");
    if (ghError) setError(decodeURIComponent(ghError));
  }, [searchParams]);

  // If already authenticated, redirect away from signup
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const validateEmail = (value, validity) => {
    return (
      value.trim().length > 0 &&
      validity.valid &&
      value.split("@")[1]?.includes(".")
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!isEmailValid) {
      setError("Please enter a valid email address");
      return;
    }
    if (!isPasswordValid) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authService.register(name, email, password);
      setStep(2);
      setCooldown(60);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      // Guide GitHub users to the right flow
      if (msg.includes("already exists")) {
        setError(`${msg} — if you signed up with GitHub, use "Continue with GitHub" to log in.`);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Server sets HttpOnly cookies on success.
      // Response body: { success, message, data: { user } }
      const response = await authService.verifyOtp(email, otp);
      const userData = response.data?.user;
      if (!userData) {
        throw new Error('Verification succeeded but no user data returned.');
      }
      login(userData);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await authService.resendOtp(email, "signup");
      setCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /**
   * GitHub signup — identical OAuth flow to login.
   * GitHub doesn't distinguish signup vs login; the backend will find-or-create the user.
   * We pass redirectPath=/dashboard so after GitHub auth the user lands on dashboard.
   */
  const handleGitHubSignup = () => {
    window.location.href = `${API_BASE}/auth/github/start?redirectPath=${encodeURIComponent('/dashboard')}`;
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-20 bg-white">
      <div className="w-full max-w-md border-4 border-black p-6 sm:p-8 md:p-12 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 sm:mb-12">
          {step === 1 ? "SIGN UP" : "VERIFY EMAIL"}
        </h2>

        {error && (
          <div className="mb-8 border-4 border-red-600 bg-red-50 p-4">
            <p className="text-sm font-black uppercase tracking-widest text-red-600">
              {error}
            </p>
          </div>
        )}

        {step === 1 ? (
          <form noValidate className="flex flex-col space-y-8" onSubmit={handleRegister}>
            <button
              type="button"
              onClick={handleGitHubSignup}
              className="w-full py-5 border-4 border-black bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign up with GitHub
            </button>

            <div className="relative py-1">
              <div className="border-t-4 border-black" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-black uppercase tracking-[0.22em]">
                or register with email
              </span>
            </div>

            <div className="flex flex-col space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-black">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="JOHN DOE"
                required
              />
            </div>

            <div className="flex flex-col space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-black">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailValid(validateEmail(e.target.value, e.target.validity));
                }}
                aria-describedby={email && !isEmailValid ? "email-error" : undefined}
                aria-invalid={email.length > 0 && !isEmailValid}
                className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="YOUR@EMAIL.COM"
                required
              />
              <div className="min-h-[16px]">
                {email && !isEmailValid && (
                  <p id="email-error" role="alert" className="text-xs font-black uppercase tracking-widest text-red-600">
                    Please enter a valid email address
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-black">Password</label>
              <input
                type="password"
                value={password}
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={password.length > 0 && !isPasswordValid}
                className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="••••••••"
                required
              />
              <div className="min-h-[16px]">
                {password && !isPasswordValid && (
                  <p role="alert" className="text-xs font-black uppercase tracking-widest text-red-600">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim() || !isEmailValid || !isPasswordValid}
              className="w-full mt-1 py-6 bg-white text-black text-xl font-black uppercase tracking-widest hover:bg-gray-100 transition-colors border-4 border-black rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
          </form>
        ) : (
          <form className="flex flex-col space-y-8" onSubmit={handleVerifyOtp}>
            <p className="text-sm font-black uppercase tracking-widest text-black text-center">
              We've sent a 6-digit code to
              <br />
              <span className="text-base">{email}</span>
            </p>

            <div className="flex flex-col space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-black">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full p-5 border-4 border-black rounded-none text-black font-black text-2xl tracking-[0.5em] text-center focus:outline-none focus:ring-0 focus:border-gray-500 uppercase"
                placeholder="______"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-6 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors border-4 border-black rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "VERIFYING..." : "VERIFY"}
            </button>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || loading}
                className="text-sm font-black uppercase tracking-widest text-black underline underline-offset-4 decoration-[3px] hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              >
                {cooldown > 0 ? `RESEND CODE (${cooldown})` : "RESEND CODE"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-10 text-center border-t-4 border-black pt-8">
          <p className="text-sm font-black uppercase tracking-widest text-black">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-8 decoration-[3px] hover:text-gray-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
