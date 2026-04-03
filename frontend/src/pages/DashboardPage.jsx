import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/shared/Loader";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full flex-1 flex flex-col px-4 sm:px-6 md:px-8 py-12 sm:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <header className="mb-12 sm:mb-16 border-b-4 border-black pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-4 sm:mb-6">
              Command Center
            </h1>
            <p className="text-base sm:text-xl font-bold uppercase tracking-widest text-black">
              Welcome back, {user?.name || "Engineer"}. Here is your unified growth telemetry.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 sm:px-8 py-3 sm:py-4 border-4 border-black bg-white text-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded-none w-full md:w-auto"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 mb-12 sm:mb-16">
          {/* GitHub Stats */}
          <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-[16px_16px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] sm:hover:shadow-[24px_24px_0_0_rgba(0,0,0,1)] transition-all">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black mb-6 sm:mb-8 border-b-4 border-black pb-4">GitHub Activity</h3>
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
          <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-[16px_16px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] sm:hover:shadow-[24px_24px_0_0_rgba(0,0,0,1)] transition-all">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black mb-6 sm:mb-8 border-b-4 border-black pb-4">Problem Solving</h3>
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
          <div className="border-4 border-black p-6 sm:p-8 bg-black text-white shadow-[8px_8px_0_0_rgba(200,200,200,1)] sm:shadow-[16px_16px_0_0_rgba(200,200,200,1)] hover:-translate-y-2 hover:shadow-[16px_16px_0_0_rgba(200,200,200,1)] sm:hover:shadow-[24px_24px_0_0_rgba(200,200,200,1)] transition-all">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white mb-6 sm:mb-8 border-b-4 border-white pb-4">Focus Quality</h3>
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
        <div className="w-full border-4 border-black p-6 sm:p-8 md:p-12 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-6 sm:mb-10 leading-none">Gemini Dynamic Insight</h2>
          <div className="border-l-4 sm:border-l-[8px] border-black pl-4 sm:pl-8 py-2">
            <p className="text-base sm:text-xl md:text-2xl font-bold text-black leading-relaxed tracking-wide uppercase">
              "Your recent GitHub commits show strong focus on React architecture, but algorithmic practice has plummeted by 40%. 
              To solidify your upcoming Stripe interview, dedicate your next 2 hours to Dynamic Programming on LeetCode. 
              I have curated 5 high-yield problems aligned to your weakness."
            </p>
          </div>
          <button className="mt-8 sm:mt-12 px-6 sm:px-10 py-4 sm:py-5 bg-black text-white text-base sm:text-lg font-black uppercase tracking-widest hover:bg-gray-800 transition-colors border-4 border-black rounded-none w-full sm:w-auto">
            Launch Curated Study Session
          </button>
        </div>
      </div>
    </div>
  );
}
