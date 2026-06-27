import { Lock, Eye, Trash2, Ban } from "lucide-react";

export default function PrivacySection() {
  return (
    <section className="bg-black text-white border-b-[4px] border-white px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-white px-3 py-1 mb-8 uppercase">
          Privacy & Transparency
        </span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Your Data,<br />Your Control
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 leading-relaxed mb-6">
              CodeLens connects to GitHub through GitHub's official OAuth flow.
              You authenticate directly on GitHub's own login screen — your
              password is never seen, requested, or stored by CodeLens.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 leading-relaxed mb-6">
              You can revoke access at any time, either from your CodeLens
              account settings or directly from your GitHub account's
              authorized apps. Once revoked, CodeLens stops future syncing,
              and cached GitHub data is deleted according to our
              data-retention policy.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 leading-relaxed">
              We do not sell your GitHub data. Any handling or
              sharing of data is limited to what is described in
              our Privacy Policy. CodeLens exists to help you grow
              as a developer — not to profit from your personal
              information.
            </p>
          </div>
          {/* Right — key points */}
          <div className="flex flex-col gap-4">
            {[
              {
                icon: Lock,
                title: "OAuth, Not Passwords",
                desc: "CodeLens never asks for your GitHub password. You authenticate directly through GitHub's own secure OAuth screen.",
              },
              {
                icon: Eye,
                title: "Scoped Access Only",
                desc: "We request only the permissions needed to read repository and contribution data for this integration.",
              },
              {
                icon: Trash2,
                title: "Delete Anytime",
                desc: "Disconnect your account at any time, and CodeLens stops future syncing. Cached GitHub data is deleted according to our data-retention policy.",
              },
              {
                icon: Ban,
                title: "No Third-Party Sharing",
                desc: "Your data is never sold, and is only shared as described in our Privacy Policy.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="border-[3px] border-gray-700 p-6 flex gap-4 items-start hover:border-white transition-colors"
              >
                <Icon size={24} strokeWidth={2} className="shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-2">
                    {title}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}