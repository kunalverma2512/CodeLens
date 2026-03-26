export default function DashboardPage() {
  return (
    <div className="w-full flex-1 flex flex-col px-8 py-16 bg-white">
      <div className="max-w-7xl mx-auto w-full">
        <header className="mb-16 border-b-[4px] border-black pb-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-6">
            Command Center
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest text-black">
            Welcome back, Engineer. Here is your unified growth telemetry.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* GitHub Stats */}
          <div className="border-[4px] border-black p-8 bg-white shadow-[16px_16px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[24px_24px_0_0_rgba(0,0,0,1)] transition-all">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-black mb-8 border-b-[4px] border-black pb-4">GitHub Activity</h3>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-black text-black uppercase tracking-widest">Total Commits</span>
                <span className="font-black text-4xl">1,204</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black text-black uppercase tracking-widest">Active PRs</span>
                <span className="font-black text-4xl">12</span>
              </div>
            </div>
          </div>

          {/* LeetCode Stats */}
          <div className="border-[4px] border-black p-8 bg-white shadow-[16px_16px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[24px_24px_0_0_rgba(0,0,0,1)] transition-all">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-black mb-8 border-b-[4px] border-black pb-4">Problem Solving</h3>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-black text-black uppercase tracking-widest">LeetCode Solved</span>
                <span className="font-black text-4xl">450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black text-black uppercase tracking-widest">CF Rating</span>
                <span className="font-black text-4xl">1650</span>
              </div>
            </div>
          </div>

          {/* Consistency */}
          <div className="border-[4px] border-black p-8 bg-black text-white shadow-[16px_16px_0_0_rgba(200,200,200,1)] hover:-translate-y-2 hover:shadow-[24px_24px_0_0_rgba(200,200,200,1)] transition-all">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-8 border-b-[4px] border-white pb-4">Focus Quality</h3>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-end">
                <span className="font-black uppercase tracking-widest text-gray-300">Streak</span>
                <span className="font-black text-5xl text-white">42 D</span>
              </div>
              <div className="w-full bg-gray-800 h-6 mt-4 border-2 border-white">
                <div className="bg-white h-full w-[75%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="w-full border-[4px] border-black p-12 bg-white shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-black mb-10 leading-none">Gemini Dynamic Insight</h2>
          <div className="border-l-[8px] border-black pl-8 py-2">
            <p className="text-2xl font-bold text-black leading-relaxed tracking-wide uppercase">
              "Your recent GitHub commits show strong focus on React architecture, but algorithmic practice has plummeted by 40%. 
              To solidify your upcoming Stripe interview, dedicate your next 2 hours to Dynamic Programming on LeetCode. 
              I have curated 5 high-yield problems aligned to your weakness."
            </p>
          </div>
          <button className="mt-12 px-10 py-5 bg-black text-white text-lg font-black uppercase tracking-widest hover:bg-gray-800 transition-colors border-[4px] border-black rounded-none">
            Launch Curated Study Session
          </button>
        </div>
      </div>
    </div>
  );
}
