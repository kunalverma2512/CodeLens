export default function DataPrivacy() {
  return (
    <section className="w-full px-4 sm:px-6 py-16 sm:py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-4 border-black bg-black text-white overflow-hidden">
      <div className="max-w-6xl w-full mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-8 sm:mb-12 leading-none">
          Radical Data Privacy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 text-left mt-8 sm:mt-16 w-full">
          <div className="border-4 border-white p-6 sm:p-10 shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] sm:shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] md:shadow-[12px_12px_0_0_rgba(255,255,255,0.2)] md:hover:-translate-y-2 transition-transform w-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 sm:mb-6 leading-none">Zero Telemetry Sale</h3>
            <p className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest leading-relaxed text-gray-300">
              Your source code, algorithms, and repository metadata never leave the application scope. We explicitly block third-party analytics trackers.
            </p>
          </div>
          <div className="border-4 border-white p-6 sm:p-10 shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] sm:shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] md:shadow-[12px_12px_0_0_rgba(255,255,255,0.2)] md:hover:-translate-y-2 transition-transform w-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 sm:mb-6 leading-none">Ephemeral LLM Context</h3>
            <p className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest leading-relaxed text-gray-300">
              When analyzing your weaknesses via Gemini, your competitive profiles are anonymized. The AI retains absolute zero memory of your identifiers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
