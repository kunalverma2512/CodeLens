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
              Why CodeLens<br />Supports GitHub
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
              GitHub is where the vast majority of real-world software gets
              built, reviewed, and shipped. For most developers, it is the
              single most accurate record of what they have actually built —
              far beyond what a resume or a contest rating can show.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
              CodeLens integrates with GitHub because commit history, repository
              activity, and language usage are some of the richest, most
              continuous signals available for tracking a developer's real
              engineering growth over time.
            </p>
          </div>
          {/* Right — reasons */}
          <div className="flex flex-col gap-4">
            {[
              {
                number: "01",
                title: "Real Engineering Signal",
                desc: "Unlike contest problems, GitHub activity reflects production-style code, refactors, and real collaboration.",
              },
              {
                number: "02",
                title: "Continuous Data",
                desc: "Commits happen daily, not in scheduled rounds — giving CodeLens a steady, longitudinal view of consistency.",
              },
              {
                number: "03",
                title: "Industry Standard",
                desc: "Recruiters and engineering teams routinely review GitHub profiles as part of evaluating real candidates.",
              },
              {
                number: "04",
                title: "Rich, Structured API",
                desc: "GitHub's public API exposes detailed repository, commit, and contribution data that CodeLens can reliably sync.",
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