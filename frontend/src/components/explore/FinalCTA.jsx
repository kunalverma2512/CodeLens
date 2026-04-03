import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <div className="w-full px-4 sm:px-6 py-16 sm:py-20 md:py-32 min-h-screen border-b-4 border-black bg-black text-center text-white flex flex-col items-center justify-center overflow-hidden">
      <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter mb-8 sm:mb-12 md:mb-16 leading-none max-w-6xl break-words w-full">
        Stop Guessing. <br className="hidden md:block"/> Start Growing.
      </h2>
      <Link to="/signup" className="w-full sm:w-auto px-8 sm:px-16 py-5 sm:py-8 bg-white text-black text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest md:hover:-translate-y-2 hover:bg-gray-200 transition-all border-4 sm:border-[6px] border-white rounded-none shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] sm:shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] md:shadow-[16px_16px_0_0_rgba(255,255,255,0.2)]">
        Create Your Account
      </Link>
    </div>
  );
}
