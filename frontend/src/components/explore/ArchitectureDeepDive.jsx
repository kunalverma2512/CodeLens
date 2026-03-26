export default function ArchitectureDeepDive() {
  return (
    <section className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-white">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        <div className="flex-1 w-full text-center lg:text-left">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-8 leading-none">
            Architectural Supremacy
          </h2>
          <div className="space-y-6">
            <p className="text-base sm:text-lg font-bold text-black uppercase tracking-widest leading-relaxed">
              Our infrastructure is designed for instantaneous telemetry processing. By leveraging asynchronous task queues and direct platform APIs, we fetch, crunch, and analyze your competitive programming metrics with zero latency.
            </p>
            <p className="text-base sm:text-lg font-bold text-black uppercase tracking-widest leading-relaxed">
              We don't cache stale data. Every refresh pings GitHub, LeetCode, and Codeforces directly, passing the raw JSON payloads through our proprietary parsing engine.
            </p>
          </div>
          <div className="w-full flex justify-center lg:justify-start">
            <button className="mt-10 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-black text-white text-base sm:text-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors border-[4px] border-black rounded-none shadow-[8px_8px_0_0_rgba(200,200,200,1)]">
              Read System Specs
            </button>
          </div>
        </div>
        <div className="flex-1 w-full border-[4px] border-black p-6 sm:p-8 bg-gray-50 shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)] md:hover:-translate-y-2 transition-transform overflow-x-auto whitespace-pre text-left">
          <div className="font-mono text-xs sm:text-sm font-bold text-black leading-loose">
            <p className="text-gray-500">// Telemetry Payload Protocol</p>
            <p><span className="text-blue-600">const</span> <span className="text-black">engine</span> = <span className="text-purple-600">new</span> CodeLensCore();</p>
            <p><span className="text-blue-600">await</span> <span className="text-black">engine</span>.sync([<span className="text-green-700">'GITHUB'</span>, <span className="text-green-700">'LEETCODE'</span>]);</p>
            <br />
            <p className="border-l-[4px] border-black pl-4">
              [SYSTEM] Normalized data streams... <br />
              [SYSTEM] Invoking Gemini AI model... <br />
              [OK] Roadmap generated in 240ms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
