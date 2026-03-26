export default function FAQSection() {
  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-white">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-12 sm:mb-20 text-center leading-none">Frequently Asked</h2>
        <div className="space-y-6 sm:space-y-8 w-full">
          {['Do I need to pay for Gemini AI?', 'Is my repository data private?', 'How often does LeetCode sync?'].map((q, idx) => (
            <div key={idx} className="border-[4px] border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[12px_12px_0_0_rgba(0,0,0,1)] md:hover:-translate-y-2 transition-transform bg-white w-full">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black mb-3 sm:mb-4 leading-tight">Q: {q}</h3>
              <p className="font-bold uppercase tracking-widest text-xs sm:text-sm text-black leading-relaxed">
                A: The platform is built to be an open API engine. Configuration determines visibility and update frequency. Privacy is guaranteed.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
