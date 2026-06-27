import { X } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-black text-white flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 border-b-[4px] border-white">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-white px-3 py-1 mb-8 uppercase">
          Integration
        </span>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-[5rem] font-black uppercase tracking-tighter leading-none mb-8">
          GitHub <span className="text-gray-400 inline-flex items-center"><X className="inline w-[0.7em] h-[0.7em] mx-1" strokeWidth={3} />CodeLens</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg font-bold uppercase tracking-widest text-gray-400 max-w-2xl leading-relaxed mb-12">
          Connect your GitHub account to CodeLens and turn your repositories,
          commits, and contribution history into meaningful insights — code
          activity, language breakdowns, and project growth, all in one place.
        </p>

        {/* Stats row */}
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            "Millions of developers worldwide",
            "Hundreds of millions of repositories",
            "Used by organizations of every size",
            "Trusted by startups and large enterprises alike",
          ].map((phrase) => (
            <div
              key={phrase}
              className="border-2 border-gray-700 p-6"
            >
              <p className="text-sm sm:text-base font-black uppercase tracking-widest text-gray-300 leading-snug">
                {phrase}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}