export default function AIExplanation() {
  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-black text-white">
      <div className="max-w-5xl mx-auto w-full text-center">
        <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-12 leading-none">Powered by Gemini</h2>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-widest leading-relaxed mb-16 mx-auto">
          CodeLens strips away noise. It feeds your raw coding data into a highly-tuned AI engine to generate ruthless, precision-guided feedback.
        </p>
        <div className="inline-block border-[4px] border-white px-8 sm:px-12 py-6 font-black uppercase tracking-widest text-xl sm:text-3xl shadow-[8px_8px_0_0_rgba(200,200,200,1)] md:shadow-[12px_12px_0_0_rgba(200,200,200,1)]">
          0 Hallucinations. 100% Signal.
        </div>
      </div>
    </div>
  );
}
