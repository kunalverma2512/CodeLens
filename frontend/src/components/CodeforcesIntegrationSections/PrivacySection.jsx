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
              CodeLens only reads data that is already publicly available on
              Codeforces. We do not require your password. We use a
              verification-based connection flow to confirm you own the account
              you are connecting.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 leading-relaxed mb-6">
              You can disconnect your Codeforces account from CodeLens at any
              time from your account settings. When you disconnect, we stop
              syncing and delete your cached Codeforces data from our servers.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 leading-relaxed">
              We do not sell, share, or monetise your data in any way. CodeLens
              exists to help you grow as a developer — not to profit from your
              personal information.
            </p>
          </div>

          {/* Right — key points */}
          <div className="flex flex-col gap-4">
            {[
              {
                icon: Lock,
                title: "No Password Required",
                desc: "CodeLens never asks for your Codeforces password. Connection is verified through a code you place in your profile.",
              },
              {
                icon: Eye,
                title: "Public Data Only",
                desc: "We only read data that is already visible to anyone on Codeforces — your profile, ratings, and submissions.",
              },
              {
                icon: Trash2,
                title: "Delete Anytime",
                desc: "Disconnect your account at any time. Your Codeforces data is removed from CodeLens servers immediately.",
              },
              {
                icon: Ban,
                title: "No Third-Party Sharing",
                desc: "Your data is never sold or shared with advertisers, analytics platforms, or any third party.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="border-[3px] border-gray-700 p-6 flex gap-4 items-start hover:border-white transition-colors"
              >
                <Icon size={24} strokeWidth={2} className="flex-shrink-0 mt-1" />
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