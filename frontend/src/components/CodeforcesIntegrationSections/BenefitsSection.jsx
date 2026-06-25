export default function BenefitsSection() {
  return (
    <section className="bg-gray-50 border-b-[4px] border-black px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-black px-3 py-1 mb-8 uppercase">
          Benefits
        </span>

        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-12">
          What You Gain<br />Inside CodeLens
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "📈",
              title: "Rating History",
              desc: "See your full Codeforces rating progression plotted over time. Identify which contests helped you grow and which ones set you back.",
            },
            {
              icon: "🔥",
              title: "Activity Heatmap",
              desc: "A GitHub-style heatmap of your daily submission activity. Visualise your consistency and identify gaps in your practice schedule.",
            },
            {
              icon: "🧩",
              title: "Problem Analytics",
              desc: "Understand which problem tags and difficulty levels you solve most — and which ones you avoid. Fix your weak spots with data.",
            },
            {
              icon: "🏆",
              title: "Contest Stats",
              desc: "Track your best rank, total contests participated, and average performance across different contest divisions.",
            },
            {
              icon: "📊",
              title: "Submission Breakdown",
              desc: "See your accepted, wrong answer, TLE, and runtime error rates at a glance. Understand your most common mistakes.",
            },
            {
              icon: "⚡",
              title: "Streak Tracking",
              desc: "Monitor your current and longest submission streaks. Build a consistent daily practice habit backed by real data.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="border-[3px] border-black bg-white p-8 shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3">
                {title}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}