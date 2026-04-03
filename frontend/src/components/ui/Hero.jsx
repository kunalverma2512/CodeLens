import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-24 sm:py-32 md:py-48 bg-white overflow-hidden">
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-none text-black mb-8 sm:mb-12 max-w-6xl break-words">
        Unify Your Coder Journey.
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black max-w-4xl mb-12 sm:mb-20 leading-relaxed uppercase tracking-wide">
        Stop scattering your progress across LeetCode, GitHub, and Codeforces. CodeLens aggregates your raw data and delivers AI-driven, actionable roadmaps to shatter stagnation and accelerate your growth.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
        <Link to="/dashboard" className="w-full sm:w-auto px-12 py-6 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors border-4 border-black rounded-none">
          Start Building
        </Link>
        <Link to="/explore" className="w-full sm:w-auto px-12 py-6 bg-white text-black text-xl font-black uppercase tracking-widest hover:bg-gray-100 transition-colors border-4 border-black rounded-none">
          Explore Platform
        </Link>
      </div>
    </section>
  );
}
