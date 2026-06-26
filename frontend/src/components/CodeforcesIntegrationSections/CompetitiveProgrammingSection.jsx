export default function CompetitiveProgrammingSection() {
  return (
    <section className="bg-black text-white border-b-[4px] border-white px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-white px-3 py-1 mb-8 uppercase">
          Why CP Matters
        </span>

        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-12">
          The Importance of<br />Competitive Programming
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Algorithmic Thinking",
              desc: "CP trains you to break complex problems into structured, efficient solutions — a skill that directly transfers to real-world software engineering.",
            },
            {
              title: "Interview Preparation",
              desc: "Most top tech companies — Google, Meta, Amazon — use algorithmic problems in their hiring process. Consistent CP practice is the most direct preparation.",
            },
            {
              title: "Speed and Accuracy",
              desc: "Writing correct code under time pressure builds habits that make everyday development faster and less error-prone.",
            },
            {
              title: "Data Structures Mastery",
              desc: "CP exposes you to a wide range of data structures — trees, graphs, segment trees, tries — that you may rarely encounter otherwise.",
            },
            {
              title: "Problem Decomposition",
              desc: "Breaking a hard problem into smaller solvable parts is the core skill of engineering. CP is essentially a gym for this ability.",
            },
            {
              title: "Global Benchmarking",
              desc: "Codeforces ratings give you an objective, global benchmark of where you stand against hundreds of thousands of other developers.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="border-[3px] border-gray-700 p-6 hover:border-white transition-colors"
            >
              <h3 className="text-sm font-black uppercase tracking-widest mb-3 border-b-[2px] border-gray-700 pb-3">
                {title}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}