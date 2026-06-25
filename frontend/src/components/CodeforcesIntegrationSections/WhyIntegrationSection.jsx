export default function WhyIntegrationSection() {
  return (
    <section className="bg-white border-b-[4px] border-black px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-black px-3 py-1 mb-8 uppercase">
          Why This Integration
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Why CodeLens<br />Supports Codeforces
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
              Codeforces is one of the most active competitive programming
              platforms in the world. Millions of developers use it to practice
              algorithmic thinking, prepare for technical interviews, and compete
              in rated contests.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
              CodeLens integrates with Codeforces because the data it produces —
              ratings, submissions, contest history — is some of the most
              structured and meaningful signal available for measuring a
              developer's growth over time.
            </p>
          </div>

          {/* Right — reasons */}
          <div className="flex flex-col gap-4">
            {[
              {
                number: "01",
                title: "Structured Data",
                desc: "Codeforces exposes a clean public API with rich submission and contest data that CodeLens can reliably sync.",
              },
              {
                number: "02",
                title: "Objective Rating System",
                desc: "The Elo-based rating system provides an objective, globally comparable measure of competitive programming skill.",
              },
              {
                number: "03",
                title: "Active Community",
                desc: "With regular Div. 1–4 rounds and educational contests, there is always fresh data to track and analyse.",
              },
              {
                number: "04",
                title: "Developer Relevance",
                desc: "Many top engineering companies use Codeforces ratings as a signal during hiring — tracking it matters.",
              },
            ].map(({ number, title, desc }) => (
              <div
                key={number}
                className="border-[3px] border-black p-6 flex gap-6 items-start"
              >
                <span className="text-3xl font-black tracking-tighter text-gray-200 flex-shrink-0">
                  {number}
                </span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-2">
                    {title}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}