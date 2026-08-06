import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden border-t-4 border-black bg-white"
      aria-label="404 Not Found Page"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent calc(100% / 12))",
        }}
      />

      <div className="relative z-10 mx-auto flex flex-1 max-w-screen-2xl flex-col lg:flex-row">
        {/* LEFT PANEL */}
        <div className="relative flex-1 overflow-hidden border-b-4 border-black px-6 py-16 sm:px-10 lg:border-r-4 lg:border-b-0 lg:py-20">
          {/* Ghost 404 */}
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[clamp(10rem,35vw,30rem)] font-black tracking-tighter text-black opacity-[0.06]"
          >
            404
          </p>

          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Label */}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-black sm:text-sm">
                Error / Route Unavailable
              </p>
            </div>

            {/* Main Content */}
            <div className="py-12 lg:py-0">
              <h1 className="text-[clamp(5rem,12vw,12rem)] font-black uppercase leading-[0.85] tracking-tighter text-black">
                404
              </h1>

              <div className="mt-8 h-[6px] w-32 bg-black" />

              <h2 className="mt-10 text-[clamp(3rem,7vw,6rem)] font-black uppercase leading-[0.9] tracking-tighter text-black">
                Page
                <br />
                Not Found.
              </h2>
            </div>

            {/* Description */}
            <div className="max-w-xl">
              <p className="text-lg font-medium leading-relaxed text-black md:text-xl">
                The page you're looking for doesn't exist, may have been moved,
                or is temporarily unavailable.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-1 items-center px-6 py-16 sm:px-10 md:px-16 lg:px-20 lg:py-20">
          <div className="max-w-xl">
            <p className="text-2xl font-medium leading-relaxed text-black md:text-3xl">
              Double-check the URL or continue exploring the platform using one
              of the options below.
            </p>

            {/* Actions */}
            <nav
              aria-label="404 page actions"
              className="mt-12 flex flex-wrap gap-5"
            >
              <Link
                to="/"
                className="inline-flex transform-gpu items-center justify-center border-4 border-black bg-black px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Go Home
              </Link>

              <Link
                to="/explore"
                className="inline-flex transform-gpu items-center justify-center border-4 border-black bg-white px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-black transition-all duration-200 hover:-translate-y-1 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Explore
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </main>
  );
}