export default function HowCPHelpsSection() {
  return (
    <section className="bg-white border-b-[4px] border-black px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-black px-3 py-1 mb-8 uppercase">
          Real Benefits
        </span>

        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-12">
          How CP Helps<br />Students & Developers
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Students */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black pb-3 mb-6">
              For Students
            </h3>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: "Build a Strong Foundation",
                  desc: "CP forces you to deeply understand core computer science concepts — sorting, searching, graphs, dynamic programming — in a practical, applied way.",
                },
                {
                  title: "Crack Technical Interviews",
                  desc: "Most software engineering interviews at top companies test the same algorithmic thinking that CP trains. A consistent CP practice schedule is the most reliable interview preparation.",
                },
                {
                  title: "Stand Out in Applications",
                  desc: "A strong Codeforces rating is a concrete, verifiable signal of problem-solving ability — more meaningful than many certification courses.",
                },
                {
                  title: "Learn to Work Under Pressure",
                  desc: "Timed contests simulate real-world deadlines and train you to deliver working solutions quickly and accurately.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <span className="w-2 h-2 bg-black flex-shrink-0 mt-2" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-1">
                      {title}
                    </h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black pb-3 mb-6">
              For Working Developers
            </h3>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: "Stay Sharp",
                  desc: "Day-to-day software engineering work often doesn't challenge your algorithmic thinking. CP keeps that muscle active and prevents skill stagnation.",
                },
                {
                  title: "Switch Roles or Companies",
                  desc: "If you are targeting a move to a more algorithmic role — systems, infrastructure, or a FAANG-tier company — CP is the fastest way to prepare.",
                },
                {
                  title: "Mentor Junior Developers",
                  desc: "Developers who have done CP can explain core algorithms clearly because they have solved them from scratch, not just used library functions.",
                },
                {
                  title: "Build Better Software",
                  desc: "Understanding time and space complexity at a deep level leads to naturally writing more efficient, scalable production code.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <span className="w-2 h-2 bg-black flex-shrink-0 mt-2" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-1">
                      {title}
                    </h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}