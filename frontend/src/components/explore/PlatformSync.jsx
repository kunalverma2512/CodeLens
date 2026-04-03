export default function PlatformSync() {
  return (
    <div className="w-full px-4 sm:px-6 py-16 sm:py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-4 border-black bg-white overflow-hidden">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        <div className="flex-1 w-full text-center lg:text-left">
          <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-6 sm:mb-8 leading-none">Trilateral Sync</h2>
          <p className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-widest text-black leading-relaxed">
            Connect GitHub, LeetCode, and Codeforces simultaneously. We normalize your disparate data streams into one undeniable metric of progress.
          </p>
        </div>
        <div className="flex-1 w-full grid grid-cols-1 gap-4 sm:gap-8">
          {['GitHub', 'LeetCode', 'Codeforces'].map(plat => (
            <div key={plat} className="w-full p-4 sm:p-8 border-4 border-black font-black uppercase tracking-widest text-lg sm:text-2xl text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] break-words">
              {plat} Integration
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
