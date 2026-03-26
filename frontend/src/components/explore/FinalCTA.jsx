import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen border-b-[4px] border-black bg-black text-center text-white flex flex-col items-center justify-center">
      <h2 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tighter mb-12 sm:mb-16 leading-none max-w-6xl break-words w-full">
        Stop Guessing. <br className="hidden md:block"/> Start Growing.
      </h2>
      <Link to="/signup" className="w-full sm:w-auto px-10 sm:px-16 py-6 sm:py-8 bg-white text-black text-lg sm:text-2xl font-black uppercase tracking-widest md:hover:-translate-y-2 hover:bg-gray-200 transition-all border-[4px] sm:border-[6px] border-white rounded-none shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] md:shadow-[16px_16px_0_0_rgba(255,255,255,0.2)]">
        Create Your Account
      </Link>
    </div>
  );
}
