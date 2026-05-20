import { Link } from "react-router-dom";

/**
 * Full-width banner shown on the dashboard when CF is not connected.
 * Props:
 *   onConnect — optional callback to open the ConnectModal directly
 */
export default function ConnectBanner({ onConnect }) {
  return (
    <div className="w-full border-[4px] border-black bg-black text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-[12px_12px_0_0_rgba(100,100,100,0.3)]">
      {/* Left */}
      <div className="flex-1">
        <div className="inline-block border-[3px] border-white px-4 py-1 text-xs font-black uppercase tracking-widest mb-4">
          Action Required
        </div>
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
          Connect Codeforces
        </h2>
        <p className="text-base sm:text-lg font-bold uppercase tracking-widest leading-relaxed text-gray-300 max-w-2xl">
          Your competitive programming telemetry is dark. Connect your Codeforces handle to unlock rating history, problem analytics, activity heatmap, and AI-driven growth roadmaps.
        </p>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-1 h-full bg-gray-600"></div>

      {/* Right — CTA */}
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        {onConnect ? (
          <button
            onClick={onConnect}
            className="w-full sm:w-auto px-8 py-5 bg-white text-black text-lg font-black uppercase tracking-widest border-[4px] border-white hover:bg-gray-200 transition-colors shadow-[6px_6px_0_0_rgba(200,200,200,0.2)]"
          >
            Connect Now →
          </button>
        ) : (
          <Link
            to="/codeforces"
            className="w-full sm:w-auto px-8 py-5 bg-white text-black text-lg font-black uppercase tracking-widest border-[4px] border-white hover:bg-gray-200 transition-colors shadow-[6px_6px_0_0_rgba(200,200,200,0.2)] text-center"
          >
            Connect Now →
          </Link>
        )}
      </div>
    </div>
  );
}
