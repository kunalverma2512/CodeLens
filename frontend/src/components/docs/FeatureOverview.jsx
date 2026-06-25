import { docsRegistry } from "../../docs/docsRegistry";
import { Link } from "react-router-dom";

export default function FeatureOverview() {
  const verifiedFeatures = docsRegistry.filter(
    (item) => item.visibility === "visible" && item.status === "VERIFIED"
  );

  if (verifiedFeatures.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {verifiedFeatures.map((feat) => (
        <div
          key={feat.id}
          className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-4 border-b-2 border-black pb-3 mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                {feat.status}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 font-mono">
                {feat.id}
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4">
              {feat.id.replace("-", " ")}
            </h3>

            <div className="space-y-3 font-mono text-xs text-zinc-600 mb-6">
              <div>
                <span className="font-bold text-zinc-400">ROUTE: </span>
                <span className="text-black font-semibold">{feat.route}</span>
              </div>
              <div>
                <span className="font-bold text-zinc-400">SOURCE: </span>
                <span className="break-all">{feat.sourceFile}</span>
              </div>
              {feat.apiDependency && feat.apiDependency !== "none" && (
                <div>
                  <span className="font-bold text-zinc-400">API: </span>
                  <span className="break-all">{feat.apiDependency}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <Link
              to={feat.route}
              className="text-xs font-black uppercase tracking-widest text-black hover:underline underline-offset-4 decoration-2"
            >
              Launch Tool →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
