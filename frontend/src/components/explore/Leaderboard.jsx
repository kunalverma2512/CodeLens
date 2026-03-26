export default function Leaderboard() {
  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-white overflow-hidden">
      <div className="max-w-6xl w-full mx-auto">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-12 sm:mb-16 text-center leading-none">Global Consistency</h2>
        <div className="w-full overflow-x-auto shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)] border-[4px] border-black">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-black text-white uppercase tracking-widest font-black text-sm sm:text-xl border-b-[4px] border-black">
                <th className="p-4 sm:p-6 border-r-[4px] border-black w-1/4">Rank</th>
                <th className="p-4 sm:p-6 border-r-[4px] border-black w-1/2">Engineer</th>
                <th className="p-4 sm:p-6 w-1/4">Streak</th>
              </tr>
            </thead>
            <tbody className="font-bold uppercase tracking-widest text-black bg-white text-sm sm:text-lg">
              {[1, 2, 3].map(rank => (
                <tr key={rank} className="border-b-[4px] border-black last:border-0 hover:bg-gray-100">
                  <td className="p-4 sm:p-6 border-r-[4px] border-black text-2xl sm:text-3xl font-black leading-none">#{rank}</td>
                  <td className="p-4 sm:p-6 border-r-[4px] border-black truncate">User_{1000 + rank}</td>
                  <td className="p-4 sm:p-6 whitespace-nowrap">{300 - rank * 15} Days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
