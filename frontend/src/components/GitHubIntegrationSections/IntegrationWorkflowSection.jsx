export default function IntegrationWorkflowSection() {
  return (
    <section className="bg-black text-white border-b-[4px] border-white px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-white px-3 py-1 mb-8 uppercase">
          How It Works
        </span>
        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-12">
          How GitHub<br />Integration Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "OAuth Authentication",
              desc: "You connect your GitHub account through GitHub's official OAuth flow — CodeLens never sees or stores your GitHub password.",
            },
            {
              title: "Scoped Permissions",
              desc: "CodeLens requests only the minimum permissions needed to read public repository and contribution data — nothing more.",
            },
            {
              title: "Repository Sync",
              desc: "Once connected, CodeLens reads your repositories' metadata, languages, and commit history to build your analytics.",
            },
            {
              title: "Periodic Refresh",
              desc: "Data is re-synced on a regular schedule, so your dashboard reflects recent activity without needing constant manual updates.",
            },
            {
              title: "Rate Limit Respect",
              desc: "All syncing strictly follows GitHub's API rate limits, so your account is never put at risk of being flagged or throttled.",
            },
            {
              title: "Disconnect Anytime",
              desc: "Revoking access from your CodeLens account settings — or directly from GitHub — immediately stops all future syncing.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="border-[3px] border-gray-700 p-6 hover:border-white transition-colors"
            >
              <h3 className="text-sm font-black uppercase tracking-widest mb-3 border-b-[2px] border-gray-700 pb-3">
                {title}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}