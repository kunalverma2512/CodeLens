export default function DataPrivacy() {
  return (
    <section className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-black text-white">
      <div className="max-w-6xl w-full mx-auto text-center">
        <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-12 leading-none">
          Radical Data Privacy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-left mt-12 sm:mt-16 w-full">
          <div className="border-[4px] border-white p-8 sm:p-10 shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] md:shadow-[12px_12px_0_0_rgba(255,255,255,0.2)] md:hover:-translate-y-2 transition-transform w-full">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-6 leading-none">Zero Telemetry Sale</h3>
            <p className="text-base sm:text-lg font-bold uppercase tracking-widest leading-relaxed text-gray-300">
              Your source code, algorithms, and repository metadata never leave the application scope. We explicitly block third-party analytics trackers.
            </p>
          </div>
          <div className="border-[4px] border-white p-8 sm:p-10 shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] md:shadow-[12px_12px_0_0_rgba(255,255,255,0.2)] md:hover:-translate-y-2 transition-transform w-full">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-6 leading-none">Ephemeral LLM Context</h3>
            <p className="text-base sm:text-lg font-bold uppercase tracking-widest leading-relaxed text-gray-300">
              When analyzing your weaknesses via Gemini, your competitive profiles are anonymized. The AI retains absolute zero memory of your identifiers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
