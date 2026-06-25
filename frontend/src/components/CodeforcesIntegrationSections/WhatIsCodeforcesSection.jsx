export default function WhatIsCodeforcessSection() {
  return (
    <section className="bg-white border-b-[4px] border-black px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-black px-3 py-1 mb-8 uppercase">
          What Is Codeforces
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Codeforces,<br />Explained Simply
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
              Codeforces is a competitive programming platform founded in 2009
              by Mikhail Mirzayanov at Saratov State University, Russia. It
              hosts regular programming contests and provides a problem archive
              for practice.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
              Users register, participate in rated rounds, and receive an
              Elo-style rating that reflects their skill level. Ratings range
              from unrated newcomers to legendary grandmasters.
            </p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
              It is not affiliated with CodeLens. CodeLens uses Codeforces'
              public API to read your profile and submission data — with your
              permission — to provide analytics inside the CodeLens platform.
            </p>
          </div>

          {/* Right — rank table */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black pb-3 mb-4">
              Codeforces Rank System
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { rank: "Newbie", range: "< 1200", color: "bg-gray-200" },
                { rank: "Pupil", range: "1200 – 1399", color: "bg-green-100" },
                { rank: "Specialist", range: "1400 – 1599", color: "bg-cyan-100" },
                { rank: "Expert", range: "1600 – 1899", color: "bg-blue-100" },
                { rank: "Candidate Master", range: "1900 – 2099", color: "bg-purple-100" },
                { rank: "Master", range: "2100 – 2299", color: "bg-orange-100" },
                { rank: "International Master", range: "2300 – 2399", color: "bg-orange-200" },
                { rank: "Grandmaster", range: "2400 – 2599", color: "bg-red-100" },
                { rank: "International Grandmaster", range: "2600 – 2999", color: "bg-red-200" },
                { rank: "Legendary Grandmaster", range: "3000+", color: "bg-red-300" },
              ].map(({ rank, range, color }) => (
                <div
                  key={rank}
                  className={`flex items-center justify-between border-[2px] border-black px-4 py-3 ${color}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">
                    {rank}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                    {range}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}