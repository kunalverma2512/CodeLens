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
  
  const navigate = useNavigate();

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
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setStep(2);
      setCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(email, otp, newPassword);
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
          </div>
        )}

        {step === 1 ? (
          <form className="flex flex-col space-y-8" onSubmit={handleSendResetCode}>
            <p className="text-sm font-black uppercase tracking-widest text-black">
              Enter your email address and we'll send you a code to reset your password.
            </p>
            
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-black">
                Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="YOUR@EMAIL.COM"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 py-6 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors border-4 border-black rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'SENDING...' : 'SEND RESET CODE'}
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
          <form className="flex flex-col space-y-8" onSubmit={handleResetPassword}>
            <p className="text-sm font-black uppercase tracking-widest text-black text-center">
              Enter the code sent to<br />
              <span className="text-base">{email}</span>
            </p>
            
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-black">
                Verification Code
              </label>
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
            
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-black">
                New Password
              </label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-black">
                Confirm Password
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 py-6 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors border-4 border-black rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'RESETTING...' : 'RESET PASSWORD'}
            </button>
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || loading}
                className="text-sm font-black uppercase tracking-widest text-black underline underline-offset-4 decoration-[3px] hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              >
                {cooldown > 0 ? `RESEND CODE (${cooldown})` : 'RESEND CODE'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
