import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUnverifiedError, setIsUnverifiedError] = useState(false);

  const navigate = useNavigate();

  const isPasswordValid = newPassword.length >= 6;
  const isOtpValid = otp.trim().length === 6;

  const doPasswordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  const validateEmail = (value, validity) => {
    return (
      value.trim().length > 0 &&
      validity.valid &&
      value.split("@")[1]?.includes(".")
    );
  };

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnverifiedError(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !isEmailValid) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(trimmedEmail);
      setStep(2);
      setCooldown(60);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Failed to send reset code';
      setError(msg);
      // 403 = user exists but is not yet verified
      // Guide them to complete signup verification instead
      if (status === 403) {
        setIsUnverifiedError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const normalizedOtp = otp.trim();

    if (normalizedOtp.length !== 6) {
      setError("OTP must be 6 characters");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Password cannot be empty or whitespace");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(email.trim(), normalizedOtp, newPassword);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    setError('');
    setLoading(true);

    try {
      await authService.resendOtp(email, 'reset');
      setCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-20 bg-white">
      <div className="w-full max-w-md border-4 border-black p-6 sm:p-8 md:p-12 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 sm:mb-12">
          RESET PASSWORD
        </h2>

        {error && (
          <div className="mb-8 border-4 border-red-600 bg-red-50 p-4">
            <p className="text-sm font-black uppercase tracking-widest text-red-600">
              {error}
            </p>
            {/* If unverified, guide them to complete signup instead */}
            {isUnverifiedError && (
              <div className="mt-3 pt-3 border-t border-red-300">
                <Link
                  to="/signup"
                  className="text-xs font-black uppercase tracking-widest text-red-600 underline underline-offset-4 decoration-[2px] hover:text-red-800"
                >
                  Go back to verify your email →
                </Link>
              </div>
            )}
          </div>
        )}

        {step === 1 ? (
          <form
            noValidate
            className="flex flex-col space-y-8"
            onSubmit={handleSendResetCode}
          >
            <p className="text-sm font-black uppercase tracking-widest text-black">
              Enter your email address and we'll send you a code to reset your
              password.
            </p>

            <div className="flex flex-col space-y-3">
              <label
                htmlFor="email"
                className="text-sm font-black uppercase tracking-widest text-black"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                autoComplete="email"
                aria-describedby={
                  email && !isEmailValid ? "email-error" : undefined
                }
                aria-invalid={email.length > 0 && !isEmailValid}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailValid(
                    validateEmail(e.target.value, e.target.validity),
                  );
                }}
                className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="YOUR@EMAIL.COM"
                required
              />
              <div className="min-h-[16px]">
                {email && !isEmailValid && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-xs font-black uppercase tracking-widest text-red-600"
                  >
                    Please enter a valid email address
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !isEmailValid}
              className="w-full mt-4 py-6 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors border-4 border-black rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "SENDING..." : "SEND RESET CODE"}
            </button>

            <div className="flex justify-center">
              <Link
                to="/login"
                className="text-sm font-black uppercase tracking-widest text-black underline underline-offset-4 decoration-[3px] hover:text-gray-600"
              >
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <form
            noValidate
            className="flex flex-col space-y-8"
            onSubmit={handleResetPassword}
          >
            <p className="text-sm font-black uppercase tracking-widest text-black text-center">
              Enter the code sent to
              <br />
              <span className="text-base">{email}</span>
            </p>

            <div className="flex flex-col space-y-3">
              <label 
                htmlFor="otp"
                className="text-sm font-black uppercase tracking-widest text-black">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                id="otp"
                name="otp"
                inputMode="text"
                aria-invalid={otp.length > 0 && !isOtpValid}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/[^A-Z0-9]/gi, "").toUpperCase(),
                  )
                }
                maxLength={6}
                className="w-full p-5 border-4 border-black rounded-none text-black font-black text-2xl tracking-[0.5em] text-center focus:outline-none focus:ring-0 focus:border-gray-500 uppercase"
                placeholder="______"
                required
              />
              <div className="min-h-[16px]">
                {otp && !isOtpValid && (
                  <p
                    role="alert"
                    className="text-xs font-black uppercase tracking-widest text-red-600"
                  >
                    OTP must be 6 characters
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <label
                htmlFor="new-password"
                className="text-sm font-black uppercase tracking-widest text-black"
              >
                New Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                minLength={6}
                aria-invalid={newPassword.length > 0 && !isPasswordValid}
                value={newPassword}
                id="new-password"
                name="newPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="••••••••"
                required
              />
              <div className="min-h-[16px]">
                {newPassword && !isPasswordValid && (
                  <p
                    role="alert"
                    className="text-xs font-black uppercase tracking-widest text-red-600"
                  >
                    Password must be at least 6 characters
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <label
              htmlFor="confirm-password"
              className="text-sm font-black uppercase tracking-widest text-black">
                Confirm Password
              </label>
              <input
                type="password"
                aria-invalid={confirmPassword.length > 0 && !doPasswordsMatch}
                value={confirmPassword}
                id="confirm-password"
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="••••••••"
                required
              />
              <div className="min-h-[16px]">
                {confirmPassword && !doPasswordsMatch && (
                  <p
                    role="alert"
                    className="text-xs font-black uppercase tracking-widest text-red-600"
                  >
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !isOtpValid ||
                !newPassword.trim() ||
                !confirmPassword.trim() ||
                !isPasswordValid ||
                !doPasswordsMatch
              }
              className="w-full mt-4 py-6 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors border-4 border-black rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
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
      </div>
    </div>
  );
}
