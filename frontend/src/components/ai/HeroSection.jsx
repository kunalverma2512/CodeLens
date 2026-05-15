export default function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full border-b-4 border-black px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8 sm:space-y-12">
              <div className="border-4 border-black bg-black text-white px-6 py-3 inline-block">
                <span className="font-black text-sm sm:text-base uppercase tracking-widest">
                  AI-POWERED EXCELLENCE
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-black">
                APEX AI
              </h1>

              <div className="space-y-4 sm:space-y-6">
                <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide text-black leading-relaxed border-l-4 border-black pl-6">
                  Advanced Performance Excellence eXecutive
                </p>

                <p className="text-base sm:text-lg font-bold text-black leading-relaxed">
                  Your personal AI strategist that cross-references CP rankings,
                  DSA proficiency, development velocity, and project
                  architecture to deliver precision-targeted growth blueprints.
                  APEX doesn't give generic advice—it engineers your trajectory
                  from current state to elite performance.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="border-4 border-black px-6 py-4 bg-white">
                  <div className="text-3xl sm:text-4xl font-black text-black">
                    99.2%
                  </div>

                  <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                    Precision Rate
                  </div>
                </div>

                <div className="border-4 border-black px-6 py-4 bg-white">
                  <div className="text-3xl sm:text-4xl font-black text-black">
                    24/7
                  </div>

                  <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                    Available
                  </div>
                </div>

                <div className="border-4 border-black px-6 py-4 bg-white">
                  <div className="text-3xl sm:text-4xl font-black text-black">
                    &lt;1.5s
                  </div>

                  <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                    Response Time
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="border-4 border-black p-6 bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-transform">
                <div className="text-4xl font-black mb-4">01</div>

                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  Unified Analytics
                </h3>

                <p className="text-sm font-bold leading-relaxed">
                  Complete metric synthesis from CP platforms, DSA progress,
                  and dev projects
                </p>
              </div>

              <div className="border-4 border-black p-6 bg-black text-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-transform">
                <div className="text-4xl font-black mb-4">02</div>

                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  Strategic Roadmaps
                </h3>

                <p className="text-sm font-bold leading-relaxed">
                  AI-architected learning paths targeting your specific
                  performance gaps
                </p>
              </div>

              <div className="border-4 border-black p-6 bg-black text-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-transform">
                <div className="text-4xl font-black mb-4">03</div>

                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  Real-Time Guidance
                </h3>

                <p className="text-sm font-bold leading-relaxed">
                  Instant insights on code patterns, algorithmic choices, and
                  architecture
                </p>
              </div>

              <div className="border-4 border-black p-6 bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-transform">
                <div className="text-4xl font-black mb-4">04</div>

                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  Elite Benchmarks
                </h3>

                <p className="text-sm font-bold leading-relaxed">
                  Performance comparison against top-tier developers and
                  industry standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

