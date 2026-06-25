import { docsConfig } from "../../docs/docs.config";
import { Link } from "react-router-dom";

const SUPPORT_TEXTS = {
  description: "If you encounter issues syncing data, experience outages, or have suggestions, please open a bug ticket or reach out directly to the core developers.",
  contributing: "CodeLens is a collaborative open source project built under the MIT License by and for developers. Check the GitHub repository for issues marked as good-first-issue or help-wanted."
};

export default function SupportSection() {
  const { bugReport, contact } = docsConfig.supportPaths;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4">
            Need Support?
          </h3>
          <p className="text-sm font-bold text-zinc-600 uppercase tracking-wide leading-relaxed mb-6">
            {SUPPORT_TEXTS.description}
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          {bugReport && (
            <Link
              to={bugReport}
              className="px-4 py-2 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Report Bug
            </Link>
          )}
          {contact && (
            <Link
              to={contact}
              className="px-4 py-2 border-2 border-black bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          )}
        </div>
      </div>

      <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4">
            Contributing
          </h3>
          <p className="text-sm font-bold text-zinc-600 uppercase tracking-wide leading-relaxed">
            {SUPPORT_TEXTS.contributing}
          </p>
        </div>
        <div className="mt-6 border-t border-zinc-100 pt-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            MIT Open Source License
          </span>
        </div>
      </div>
    </div>
  );
}
