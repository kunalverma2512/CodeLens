import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="w-full flex-1 flex flex-col md:flex-row bg-white" role="region" aria-label="Page Not Found Information">
      {/* Left panel — large 404 */}
      <div className="flex-1 flex items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-black px-8 py-16 md:py-0" aria-hidden="true">
        <p className="text-[clamp(8rem,22vw,18rem)] font-black leading-none tracking-tighter text-black select-none">
          404
        </p>
      </div>

      {/* Right panel — message + CTA */}
      <div className="flex-1 flex flex-col justify-center px-10 sm:px-16 py-16 md:py-0 max-w-xl md:max-w-none">
        <p className="text-xs font-black uppercase tracking-widest text-black mb-4">
          Error / Not Found
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight mb-6">
          Page not<br />found.
        </h1>

        <div className="w-16 h-1 bg-black mb-8" aria-hidden="true" />

        <p className="text-base sm:text-lg font-bold text-black leading-relaxed mb-12 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
          Double-check the URL, or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            aria-label="Go back to the homepage"
            className="inline-block py-5 px-10 bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black border-4 border-black transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/explore"
            aria-label="Explore other platform features"
            className="inline-block py-5 px-10 bg-white text-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white border-4 border-black transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
