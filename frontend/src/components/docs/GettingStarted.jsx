const GETTING_STARTED_STEPS = {
  signup: "Register an account using email credentials or direct GitHub OAuth.",
  connect: "Navigate to Account Center. Supply your Codeforces handle to initiate verification or connect your GitHub account via OAuth callback."
};

export default function GettingStarted() {
  const { signup, connect } = GETTING_STARTED_STEPS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {signup && (
        <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
          <div>
            <div className="text-4xl font-black text-zinc-300 border-b-2 border-black pb-3 mb-6">
              01
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4">
              Account Registration
            </h3>
            <p className="text-sm font-bold text-zinc-600 uppercase tracking-wide leading-relaxed">
              {signup}
            </p>
          </div>
          <div className="mt-8 flex gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest border border-black px-2 py-0.5">
              Email Auth
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest border border-black px-2 py-0.5">
              GitHub Auth
            </span>
          </div>
        </div>
      )}

      {connect && (
        <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
          <div>
            <div className="text-4xl font-black text-zinc-300 border-b-2 border-black pb-3 mb-6">
              02
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4">
              Link Connected Handles
            </h3>
            <p className="text-sm font-bold text-zinc-600 uppercase tracking-wide leading-relaxed">
              {connect}
            </p>
          </div>
          <div className="mt-8 flex gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest border border-black px-2 py-0.5">
              Account Settings
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest border border-black px-2 py-0.5">
              Profile Synced
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
