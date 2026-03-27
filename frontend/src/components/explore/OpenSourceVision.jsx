export default function OpenSourceVision() {
  return (
    <section className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-white">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-center">
        <div className="flex-1 w-full text-center lg:text-right">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-8 leading-none">
            The Open Source Mandate
          </h2>
          <div className="space-y-6">
            <p className="text-base sm:text-lg font-bold text-black uppercase tracking-widest leading-relaxed">
              CodeLens is unapologetically open source. We reject black-box algorithms dictating how engineers should learn. 
            </p>
            <p className="text-base sm:text-lg font-bold text-black uppercase tracking-widest leading-relaxed">
              By open-sourcing our core engine, the community audit ensures our recommendation weights remain unbiased and fiercely accurate. Join the revolution on GitHub.
            </p>
          </div>
          <div className="w-full flex justify-center lg:justify-end">
            <a
              href="https://github.com/kunalverma2512/CodeLens"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white text-black text-base sm:text-lg font-black uppercase tracking-widest hover:bg-gray-100 transition-colors border-[4px] border-black rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:hover:-translate-y-1 inline-block text-center"
            >
              Contribute Code
            </a>
          </div>
        </div>
        <div className="flex-1 w-full grid grid-cols-2 gap-4 sm:gap-6">
          <div className="border-[4px] border-black p-6 sm:p-8 text-center shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[12px_12px_0_0_rgba(0,0,0,1)] bg-black text-white hover:bg-gray-900 transition-colors">
            <div className="text-4xl sm:text-5xl font-black mb-2 leading-none">1.2K+</div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest">Forks</div>
          </div>
          <div className="border-[4px] border-black p-6 sm:p-8 text-center shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:bg-gray-50 transition-colors">
            <div className="text-4xl sm:text-5xl font-black mb-2 leading-none">350</div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest">Contributors</div>
          </div>
          <div className="border-[4px] border-black p-6 sm:p-8 text-center shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[12px_12px_0_0_rgba(0,0,0,1)] col-span-2 bg-white">
            <div className="text-5xl sm:text-7xl font-black mb-2 tracking-tighter leading-none">12.5K</div>
            <div className="text-sm sm:text-lg font-bold uppercase tracking-widest">Star Gazers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
