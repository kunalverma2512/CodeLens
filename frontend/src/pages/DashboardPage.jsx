import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useCodeforces } from "../hooks/useCodeforces";
import ConnectBanner from "../components/codeforces/ConnectBanner";
import VerifyModal from "../components/codeforces/VerifyModal";
import DashboardExecutiveSummary from "../components/dashboard/DashboardExecutiveSummary";
import LoaderSwitcher from "../components/shared/loaders/LoaderSwitcher";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    dashboardSummary: cfData,
    isConnected: cfConnected,
    loading: cfLoading,
    initiateConnect,
    verifyConnect,
    verificationCode,
    connectLoading,
    connectError,
  } = useCodeforces(true);

  const handleLogout = async () => {
    await logout(); // clears HttpOnly cookies server-side
    navigate("/");
  };

  if (loading) {
    return <LoaderSwitcher />;
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
              Welcome back, {user?.name || "Engineer"}.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 sm:px-8 py-3 sm:py-4 border-4 border-black bg-white text-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded-none w-full md:w-auto"
          >
            Logout
          </button>
        </header>

        {/* AI Executive Summary - The Hero of the Dashboard */}
        <DashboardExecutiveSummary />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 mb-12 sm:mb-16">
          {/* GitHub Stats */}
          <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black mb-6 border-b-4 border-black pb-4">GitHub</h3>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-black text-black uppercase tracking-widest text-sm">Commits</span>
                <span className="font-black text-3xl">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black text-black uppercase tracking-widest text-sm">Active PRs</span>
                <span className="font-black text-3xl">—</span>
              </div>
            </div>
          </div>

          {/* Codeforces Widget */}
          {cfLoading ? (
            <div className="border-4 border-black p-6 sm:p-8 bg-white flex items-center justify-center shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="w-10 h-10 border-[4px] border-black border-t-transparent animate-spin" />
            </div>
          ) : cfConnected && cfData ? (
            <Link
              to="/codeforces"
              className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300 block"
            >
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black mb-6 border-b-4 border-black pb-4">Codeforces</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-black text-black uppercase tracking-widest text-sm">Rating</span>
                  <span className="font-black text-3xl">{cfData.rating ?? "—"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-black text-black uppercase tracking-widest text-sm">Solved</span>
                  <span className="font-black text-3xl">{cfData.totalSolved ?? "—"}</span>
                </div>
                <div className="flex justify-between items-end mt-2 pt-4 border-t-2 border-dashed border-gray-300">
                  <span className="font-black text-black uppercase tracking-widest text-xs">Streak</span>
                  <span className="font-black text-lg text-red-600">{cfData.currentStreak ?? 0} Days 🔥</span>
                </div>
              </div>
            </Link>
          ) : (
            <div
              className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black mb-4 border-b-4 border-black pb-4">Codeforces</h3>
              <p className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-6 flex-1">
                No CF account connected. Click to link your handle.
              </p>
              <button className="w-full py-3 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors border-2 border-black">
                Connect →
              </button>
            </div>
          )}

          {/* Focus Quality */}
          <div className="border-4 border-black p-6 sm:p-8 bg-black text-white shadow-[8px_8px_0_0_rgba(200,200,200,1)] hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white mb-6 border-b-4 border-white pb-4">Focus Quality</h3>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-end">
                <span className="font-black uppercase tracking-widest text-gray-300 text-sm">CF Streak</span>
                <span className="font-black text-5xl text-white">
                  {cfConnected && cfData ? `${cfData.currentStreak}D` : "—"}
                </span>
              </div>
              <div>
                <div className="w-full bg-gray-800 h-3 border border-white overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-700"
                    style={{
                      width: cfConnected && cfData
                        ? `${Math.min((cfData.currentStreak / Math.max(cfData.longestStreak, 1)) * 100, 100)}%`
                        : "0%"
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Best: {cfConnected && cfData ? `${cfData.longestStreak}D` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connect Banner — only shown if CF is not connected */}
        {!cfLoading && !cfConnected && (
          <div className="mb-12 sm:mb-16">
            <ConnectBanner onConnect={() => setModalOpen(true)} />
          </div>
        )}
      </div>

      {/* Verify Modal */}
      <VerifyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initiateConnect={initiateConnect}
        verifyConnect={verifyConnect}
        verificationCode={verificationCode}
        connectLoading={connectLoading}
        connectError={connectError}
      />
    </div>
  );
}
