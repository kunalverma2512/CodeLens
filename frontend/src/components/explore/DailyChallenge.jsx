export default function DailyChallenge() {
  return (
    <div className="w-full px-4 sm:px-6 py-16 sm:py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-4 border-black bg-white overflow-hidden">
      <div className="max-w-4xl w-full border-4 border-black p-6 sm:p-12 md:p-16 shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[24px_24px_0_0_rgba(0,0,0,1)] text-center bg-white">
        <div className="inline-block border-4 border-black px-4 sm:px-8 py-3 font-black uppercase tracking-widest mb-10 text-sm sm:text-xl break-words">
          Problem of the Day
        </div>
        <h3 className="text-2xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-6 sm:mb-8 leading-none break-words">Median of Two Sorted Arrays</h3>
        <p className="font-bold uppercase tracking-widest text-black mb-12 sm:mb-16 text-sm sm:text-xl leading-relaxed">
          Difficulty: <span className="underline decoration-4">Hard</span> | Core Topic: Binary Search
        </p>
        <button className="w-full px-8 sm:px-16 py-5 sm:py-6 bg-black text-white text-lg sm:text-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors border-4 border-black rounded-none">
          Attempt Now
        </button>
      </div>
    </div>
  );
}
