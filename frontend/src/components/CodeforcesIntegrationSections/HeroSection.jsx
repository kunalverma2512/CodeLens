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
          Codeforces <span className="text-gray-400">× CodeLens</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg font-bold uppercase tracking-widest text-gray-400 max-w-2xl leading-relaxed mb-12">
          Connect your Codeforces account to CodeLens and turn raw competitive
          programming data into meaningful insights — ratings, streaks, problem
          analytics, and contest history, all in one place.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { value: "400K+", label: "Problems" },
            { value: "700K+", label: "Registered Users" },
            { value: "Round 1000+", label: "Contests Held" },
            { value: "Real-time", label: "Data Sync" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="border-2 border-gray-700 p-6"
            >
              <p className="text-2xl sm:text-3xl font-black tracking-tighter leading-none mb-1">
                {value}
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}