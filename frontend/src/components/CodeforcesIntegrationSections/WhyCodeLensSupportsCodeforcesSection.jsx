export default function WhyCodeLensSupportsCodeforcesSection() {
  return (
    <section className="bg-white border-b-[4px] border-black px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-black px-3 py-1 mb-8 uppercase">
          Our Rationale
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Why CodeLens<br />Chose Codeforces
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
              CodeLens is built around the idea that developers deserve clear,
              honest visibility into their own growth. Codeforces is the best
              source of structured competitive programming data available — so
              it was a natural first integration.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
              The platform's public API is reliable, well-documented, and
              returns rich data including full submission history, rating
              changes, and contest participation records.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
              Our goal is not to replace Codeforces — it is to sit on top of
              it and give you a clearer picture of your own progress than the
              platform itself provides.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            {[
              {
                title: "Public API",
                desc: "Codeforces provides a free, stable public API that returns structured JSON data — no scraping, no workarounds.",
              },
              {
                title: "Rich Signal",
                desc: "Submission verdicts, timestamps, problem ratings, and tags give CodeLens enough signal to build genuinely useful analytics.",
              },
              {
                title: "Global Adoption",
                desc: "Codeforces is used by developers in every country. Supporting it means CodeLens is useful to a global audience from day one.",
              },
              {
                title: "Rating Integrity",
                desc: "The Codeforces rating system is transparent and well-understood. It is a trustworthy signal that CodeLens can present with confidence.",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="border-l-[6px] border-black pl-6 py-2"
              >
                <h3 className="text-sm font-black uppercase tracking-widest mb-2">
                  {title}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}