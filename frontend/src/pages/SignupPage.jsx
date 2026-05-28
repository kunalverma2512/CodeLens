import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isPasswordValid = password.length >= 6;

  // OAuth error handling
  useEffect(() => {
    const ghError =
      searchParams.get("githubAuthError") || searchParams.get("error");

    if (ghError) {
      setError(decodeURIComponent(ghError));
    }
  }, [searchParams]);

  // cooldown timer
  useEffect(() => {
    let timer;

    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
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
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.verifyOtp(email, otp);

      const { token, user } = response.data;

      auth.login(token, user);

      navigate("/dashboard");
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

  // GitHub Signup
  const handleGitHubSignup = () => {
    window.location.href = `${API_BASE}/api/auth/github/start`;
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
          <form
            onSubmit={handleRegister}
            className="flex flex-col space-y-8"
          >
            {/* GitHub Button */}
            <button
              type="button"
              onClick={handleGitHubSignup}
              className="w-full py-5 border-4 border-black bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition flex items-center justify-center gap-3"
            >
              Sign up with GitHub
            </button>

            {/* FULL NAME */}
            <div className="flex flex-col space-y-3">
              <label
                htmlFor="fullname"
                className="text-sm font-black uppercase"
              >
                Full Name
              </label>

              <input
                id="fullname"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-5 border-4 border-black font-bold"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col space-y-3">
              <label
                htmlFor="email"
                className="text-sm font-black uppercase"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  setIsEmailValid(
                    validateEmail(
                      e.target.value,
                      e.target.validity
                    )
                  );
                }}
                className="p-5 border-4 border-black font-bold"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col space-y-3">
              <label
                htmlFor="password"
                className="text-sm font-black uppercase"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-5 border-4 border-black font-bold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-6 bg-black text-white font-black uppercase"
            >
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            className="flex flex-col space-y-8"
          >
            <p className="text-center font-black">
              OTP sent to {email}
            </p>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-5 border-4 border-black text-center font-black tracking-[0.5em]"
              maxLength={6}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="py-6 bg-black text-white font-black uppercase"
            >
              {loading ? "VERIFYING..." : "VERIFY"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0}
              className="text-sm font-black underline"
            >
              {cooldown > 0
                ? `RESEND (${cooldown})`
                : "RESEND OTP"}
            </button>
          </form>
        )}

        <div className="mt-10 text-center border-t-4 border-black pt-8">
          <Link
            to="/login"
            className="font-black underline"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}