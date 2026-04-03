import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-20 bg-white">
      <div className="w-full max-w-md border-4 border-black p-6 sm:p-8 md:p-12 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 sm:mb-12">
          LOGIN
        </h2>
        
        {error && (
          <div className="mb-8 border-4 border-red-600 bg-red-50 p-4">
            <p className="text-sm font-black uppercase tracking-widest text-red-600">
              {error}
            </p>
          </div>
        )}
        
        <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
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
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-black">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 border-4 border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
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
            className="w-full mt-4 py-6 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors border-4 border-black rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>
        
        <div className="mt-10 text-center border-t-4 border-black pt-8">
          <p className="text-sm font-black uppercase tracking-widest text-black">
            Don't have an account? <Link to="/signup" className="underline underline-offset-8 decoration-[3px] hover:text-gray-600">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
