export default function BottomCTA() {
  return (
    <section className="w-full border-t-4 border-black px-4 sm:px-6 md:px-8 py-14 sm:py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter">
          Stop Guessing. Start Executing.
        </h2>
        <p className="text-sm sm:text-base font-bold uppercase tracking-wide max-w-2xl mx-auto opacity-80 leading-relaxed">
          APEX analyzes your complete developer footprint to engineer precision
          growth strategies. No generic advice—only actionable intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button className="w-full sm:w-auto px-8 py-4 border-4 border-white bg-white text-black font-black uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors">
            Activate APEX Free
          </button>
          <button className="w-full sm:w-auto px-8 py-4 border-4 border-white bg-transparent text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
            View Capabilities
          </button>
        </div>
      </div>
    </section>
  );
}
