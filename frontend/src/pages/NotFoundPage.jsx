import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white border-t-4 border-black">
      
      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-6 lg:grid-cols-12 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="border-r border-black/10 h-full"
          />
        ))}
      </div>

      {/* Main Layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        
        {/* LEFT PANEL */}
        <div className="relative flex-[1.1] border-b-4 lg:border-b-0 lg:border-r-4 border-black overflow-hidden flex flex-col justify-between px-6 sm:px-10 py-16 lg:py-20">
          
          {/* Background 404 */}
          <p className="absolute inset-0 flex items-center justify-center text-[55vw] lg:text-[30vw] font-black tracking-tighter leading-none text-black opacity-[0.04] pointer-events-none select-none">
            404
          </p>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            
            {/* Top Label */}
            <div>
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.35em] text-black">
                Error / Route Unavailable
              </p>
            </div>

            {/* Main 404 Content */}
            <div className="flex flex-col items-start py-12 lg:py-0">
              
              <h1 className="text-[5rem] sm:text-[7rem] md:text-[9rem] xl:text-[12rem] font-black uppercase tracking-tighter leading-[0.85] text-black">
                404
              </h1>

              <div className="mt-8 w-32 h-[6px] bg-black" />

              <h2 className="mt-10 text-4xl sm:text-5xl md:text-6xl xl:text-[6rem] font-black uppercase tracking-tighter leading-[0.9] text-black">
                Page
                <br />
                Not Found.
              </h2>
            </div>

            {/* Bottom Description */}
            <div className="max-w-xl pt-10">
              <p className="text-lg md:text-xl xl:text-2xl font-bold leading-relaxed text-black">
                The requested route does not exist,
                may have been moved, or is currently unavailable.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col justify-between px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-16 lg:py-20">
          
          {/* TOP CONTENT */}
          <div>
            
            <p className="max-w-3xl text-lg md:text-xl xl:text-2xl font-bold leading-relaxed text-black">
              Double-check the URL or continue navigating
              through the platform using the available
              navigation options below.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-16 flex flex-col sm:flex-row flex-wrap gap-5">
              
              <Link
                to="/"
                className="inline-flex items-center justify-center border-4 border-black bg-black px-10 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-white transition-all duration-200 hover:bg-white hover:text-black hover:-translate-y-1"
              >
                Go Home
              </Link>

              <Link
                to="/explore"
                className="inline-flex items-center justify-center border-4 border-black bg-white px-10 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-black transition-all duration-200 hover:bg-black hover:text-white hover:-translate-y-1"
              >
                Explore
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center border-4 border-black bg-white px-10 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-black transition-all duration-200 hover:bg-black hover:text-white hover:-translate-y-1"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="mt-28 border-t-4 border-black pt-12 grid grid-cols-1 xl:grid-cols-2 gap-12">
            
            {/* STATUS PANEL */}
            <div className="border-4 border-black bg-white max-w-xl">
              
              <div className="border-b-4 border-black px-6 py-5">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-black">
                  System Status
                </p>
              </div>

              <div className="flex flex-col divide-y-4 divide-black">
                
                <div className="px-6 py-6">
                  <p className="text-xs uppercase tracking-widest font-black text-black mb-3">
                    Error Code
                  </p>

                  <p className="text-5xl font-black text-black">
                    404
                  </p>
                </div>

                <div className="px-6 py-6">
                  <p className="text-xs uppercase tracking-widest font-black text-black mb-3">
                    Requested Status
                  </p>

                  <p className="text-xl font-black uppercase text-black leading-tight">
                    Route Not Found
                  </p>
                </div>

                <div className="px-6 py-6">
                  <p className="text-xs uppercase tracking-widest font-black text-black mb-3">
                    Suggested Action
                  </p>

                  <p className="text-base md:text-lg font-bold leading-relaxed text-black">
                    Return to the homepage or continue exploring
                    the platform through the navigation system.
                  </p>
                </div>
              </div>
            </div>

            {/* PLATFORM ACCESS PANEL */}
            <div className="border-4 border-black bg-white flex flex-col">
              
              {/* Header */}
              <div className="border-b-4 border-black px-6 py-5">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-black">
                  Platform Access
                </p>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between h-full px-6 py-8">
                
                {/* Branding */}
                <div>
                  <p className="text-lg sm:text-xl font-black uppercase tracking-[0.28em] leading-relaxed text-black">
                    CodeLens / Developer Intelligence Platform
                  </p>

                  <p className="mt-6 text-sm md:text-base font-bold leading-relaxed text-black max-w-md">
                    Navigate through the platform using the
                    primary access routes below.
                  </p>
                </div>

                {/* Navigation */}
                <div className="mt-12 flex flex-wrap gap-6 sm:gap-10">
                  
                  <Link
                    to="/"
                    className="text-sm font-black uppercase tracking-[0.25em] text-black transition-all duration-200 hover:-translate-y-1"
                  >
                    Home
                  </Link>

                  <Link
                    to="/explore"
                    className="text-sm font-black uppercase tracking-[0.25em] text-black transition-all duration-200 hover:-translate-y-1"
                  >
                    Explore
                  </Link>

                  <Link
                    to="/login"
                    className="text-sm font-black uppercase tracking-[0.25em] text-black transition-all duration-200 hover:-translate-y-1"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}