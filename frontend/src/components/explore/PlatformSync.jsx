export default function PlatformSync() {
  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-white">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        <div className="flex-1 w-full text-center lg:text-left">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-8 leading-none">Trilateral Sync</h2>
          <p className="text-lg sm:text-2xl font-bold uppercase tracking-widest text-black leading-relaxed">
            Connect GitHub, LeetCode, and Codeforces simultaneously. We normalize your disparate data streams into one undeniable metric of progress.
          </p>
        </div>
        <div className="flex-1 w-full grid grid-cols-1 gap-6 sm:gap-8">
          {['GitHub', 'LeetCode', 'Codeforces'].map(plat => (
            <div key={plat} className="w-full p-6 sm:p-8 border-[4px] border-black font-black uppercase tracking-widest text-xl sm:text-2xl text-center shadow-[8px_8px_0_0_rgba(0,0,0,1)] break-words">
              {plat} Integration
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
