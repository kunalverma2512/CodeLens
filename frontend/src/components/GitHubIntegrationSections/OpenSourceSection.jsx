export default function OpenSourceSection() {
  return (
    <section className="bg-black text-white border-b-[4px] border-white px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-white px-3 py-1 mb-8 uppercase">
          Open Source
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Open Source &<br />Portfolio Building
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 leading-relaxed mb-6">
              Contributing to open-source projects is one of the few ways a
              developer can build a public, verifiable track record — without
              needing a job title, a degree, or anyone's permission to start.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 leading-relaxed">
              Every merged pull request becomes part of a permanent, visible
              history. Over time, that history becomes a portfolio that speaks
              for itself — read by recruiters, fellow developers, and
              maintainers deciding who to trust with bigger contributions.
            </p>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "1B+", label: "Commits in 2025" },
              { value: "255K+", label: "First-Time Contributors (1 Month)" },
              { value: "36M+", label: "New Developers in 2025" },
              { value: "180+", label: "Countries Represented" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="border-2 border-gray-700 p-6"
              >
                <p className="text-2xl sm:text-3xl font-black tracking-tighter leading-none mb-1">
                  {value}
                </p>
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}