import { Link } from "react-router-dom";
import { TrendingUp, Flame, Puzzle, Trophy, BarChart2, Zap } from "lucide-react";

export default function GetStartedSection() {
  return (
    <section className="bg-white px-6 sm:px-12 lg:px-24 py-24">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-black px-3 py-1 mb-8 uppercase">
          Get Started
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Connect Your<br />Codeforces Account
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-8">
              Linking your Codeforces account takes less than two minutes. Sign
              in to CodeLens, navigate to the Codeforces section, and follow
              the verification steps. No password required.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-4 mb-10">
              {[
                "Sign in or create a CodeLens account",
                "Go to the Codeforces section from the dashboard",
                "Enter your Codeforces handle",
                "Place the verification code in your Codeforces profile",
                "Click verify — your data syncs automatically",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 border-[3px] border-black flex items-center justify-center font-black text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/codeforces"
                className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-sm border-[3px] border-black hover:bg-gray-900 transition-colors shadow-[6px_6px_0_0_rgba(0,0,0,0.2)]"
              >
                Connect Codeforces →
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm border-[3px] border-black hover:bg-gray-100 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Right — feature preview with Lucide icons */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, label: "Rating History" },
              { icon: Flame, label: "Activity Heatmap" },
              { icon: Puzzle, label: "Problem Analytics" },
              { icon: Trophy, label: "Contest Stats" },
              { icon: BarChart2, label: "Submission Breakdown" },
              { icon: Zap, label: "Streak Tracking" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="border-[3px] border-black p-6 text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              >
                <Icon size={28} strokeWidth={2} className="mx-auto mb-3" />
                <p className="text-xs font-black uppercase tracking-widest">
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