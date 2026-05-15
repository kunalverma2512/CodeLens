export default function BottomCTA() {
  return (
    <section className="w-full border-t-4 border-black px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-black text-white">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter">
          Stop Guessing. Start Executing.
        </h2>

        <p className="text-base sm:text-lg font-bold uppercase tracking-wide max-w-3xl mx-auto">
          APEX analyzes your complete developer footprint to engineer precision
          growth strategies. No generic advice—only actionable intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6">
          <button className="w-full sm:w-auto px-10 py-5 border-4 border-white bg-white text-black font-black uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors">
            Activate APEX Free
          </button>

          <button className="w-full sm:w-auto px-10 py-5 border-4 border-white bg-transparent text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
            View Capabilities
          </button>
        </div>
      </div>
    </section>
  );
}