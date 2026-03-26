import { Link } from 'react-router-dom';

export default function SignupPage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-8 py-20 bg-white">
      <div className="w-full max-w-md border-[4px] border-black p-12 bg-white shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-black mb-12">
          Sign Up
        </h2>
        <form className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-black">
              Full Name
            </label>
            <input 
              type="text" 
              className="w-full p-5 border-[4px] border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
              placeholder="JOHN DOE"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-black">
              Email
            </label>
            <input 
              type="email" 
              className="w-full p-5 border-[4px] border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
              placeholder="YOUR@EMAIL.COM"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-black">
              Password
            </label>
            <input 
              type="password" 
              className="w-full p-5 border-[4px] border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full mt-4 py-6 bg-white text-black text-xl font-black uppercase tracking-widest hover:bg-gray-100 transition-colors border-[4px] border-black rounded-none"
          >
            Create Account
          </button>
        </form>
        <div className="mt-10 text-center border-t-[4px] border-black pt-8">
          <p className="text-sm font-black uppercase tracking-widest text-black">
            Already have an account? <Link to="/login" className="underline underline-offset-8 decoration-[3px] hover:text-gray-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
