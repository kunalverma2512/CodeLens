import { GitCommit, Flame, Code2, GitPullRequest, BarChart2, TrendingUp } from "lucide-react";

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
              icon: GitCommit,
              title: "Commit Activity",
              desc: "See your full commit history visualised as a heatmap. Spot patterns in when and how consistently you actually write code.",
            },
            {
              icon: Code2,
              title: "Language Breakdown",
              desc: "Understand which languages and technologies dominate your repositories — and track how your stack evolves over time.",
            },
            {
              icon: GitPullRequest,
              title: "Pull Request Stats",
              desc: "Track how many PRs you have opened, merged, and reviewed. See your real contribution footprint, not just commit counts.",
            },
            {
              icon: Flame,
              title: "Contribution Streaks",
              desc: "Monitor your current and longest contribution streaks across all repositories. Build a consistent shipping habit backed by data.",
            },
            {
              icon: BarChart2,
              title: "Repository Insights",
              desc: "See stars, forks, and activity trends across your repositories at a glance — understand which projects are actually growing.",
            },
            {
              icon: TrendingUp,
              title: "Growth Over Time",
              desc: "Track how your GitHub footprint — repos, followers, contributions — has changed month over month, not just a single snapshot.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="border-[3px] border-black bg-white p-8 shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
            >
              <Icon size={32} strokeWidth={2} className="mb-4" />
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