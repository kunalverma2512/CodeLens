export default function FeatureGrid() {
  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-white">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-16 text-center leading-none">Core Telemetry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full">
          {['Unified Metrics', 'AI Guidance', 'Actionable Roadmap'].map((feature, idx) => (
            <div key={idx} className="border-[4px] border-black p-8 sm:p-10 shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:hover:-translate-y-2 md:hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] transition-transform bg-white w-full">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black mb-6 leading-none">{feature}</h3>
              <p className="font-bold text-black uppercase tracking-widest text-xs sm:text-sm leading-relaxed">
                Experience unparalleled clarity through data aggregation and structural logic engineered for maximum impact.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
