import { useState } from "react";

export default function ContestCodeforcesPage() {
  const [selectedDivision, setSelectedDivision] = useState("all");

  const contestSolutions = [
    {
      id: 1,
      contestName: "Codeforces Round 918 (Div. 2)",
      date: "Dec 2023",
      division: "Div. 2",
      problems: 6,
      difficulty: "1200-2400",
      tags: ["DP", "Graphs", "Greedy"],
    },
    {
      id: 2,
      contestName: "Educational Round 160",
      date: "Nov 2023",
      division: "Educational",
      problems: 7,
      difficulty: "900-2300",
      tags: ["Math", "Binary Search", "Trees"],
    },
    {
      id: 3,
      contestName: "Codeforces Round 917 (Div. 1)",
      date: "Dec 2023",
      division: "Div. 1",
      problems: 5,
      difficulty: "1800-3000",
      tags: ["Advanced DP", "FFT", "Segment Trees"],
    },
  ];

  return (
  <>
    <title>Codeforces Contests - CodeLens</title>

    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full border-b-4 border-black px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-3 border-4 border-black bg-blue-600 text-white px-6 py-3">
              <span className="text-2xl">🔵</span>
              <span className="font-black text-sm sm:text-base uppercase tracking-widest">
                Contest Arsenal
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-black">
              Codeforces
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide text-black max-w-4xl mx-auto leading-relaxed">
              Premium editorial solutions with detailed explanations for every rated contest
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="border-4 border-black px-6 py-4 bg-white">
                <div className="text-3xl sm:text-4xl font-black text-black">150+</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                  Contests
                </div>
              </div>
              <div className="border-4 border-black px-6 py-4 bg-blue-600 text-white">
                <div className="text-3xl sm:text-4xl font-black">900+</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest mt-1">
                  Solutions
                </div>
              </div>
              <div className="border-4 border-black px-6 py-4 bg-white">
                <div className="text-3xl sm:text-4xl font-black text-black">All</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                  Divisions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="w-full border-b-4 border-black px-4 sm:px-6 md:px-8 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {["all", "Div. 1", "Div. 2", "Div. 3", "Div. 4", "Educational", "Global"].map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-6 py-3 border-4 border-black font-black text-sm uppercase tracking-widest transition-all ${
                  selectedDivision === div
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black hover:bg-blue-600 hover:text-white"
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contest Solutions Grid */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 sm:mb-12">
            Recent Contests
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contestSolutions.map((contest) => (
              <div
                key={contest.id}
                className="border-4 border-black bg-white p-6 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="border-2 border-blue-600 bg-blue-50 text-blue-800 px-3 py-1 text-xs font-black uppercase tracking-wide">
                    {contest.division}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-500">
                    {contest.date}
                  </div>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight text-black mb-3">
                  {contest.contestName}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border-2 border-black p-3 bg-gray-50">
                    <div className="text-2xl font-black text-black">{contest.problems}</div>
                    <div className="text-xs font-black uppercase tracking-wide text-gray-600 mt-1">
                      Problems
                    </div>
                  </div>
                  <div className="border-2 border-black p-3 bg-gray-50">
                    <div className="text-sm font-black text-black">{contest.difficulty}</div>
                    <div className="text-xs font-black uppercase tracking-wide text-gray-600 mt-1">
                      Rating
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {contest.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-black uppercase tracking-wide border-2 border-black px-2 py-1 bg-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full px-6 py-3 border-4 border-black bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-black transition-colors">
                  View Solutions →
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-10 py-4 border-4 border-black bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Load More Contests
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full border-t-4 border-black px-4 sm:px-6 md:px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-4 border-black bg-white p-6">
              <div className="text-4xl font-black mb-4">✓</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Detailed Editorials</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-700">
                Step-by-step explanations with multiple approaches and optimizations
              </p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <div className="text-4xl font-black mb-4">⚡</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Code Templates</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-700">
                Clean, production-ready code in C++, Python, and Java
              </p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <div className="text-4xl font-black mb-4">📊</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Complexity Analysis</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-700">
                Time and space complexity breakdown for every solution
              </p>
            </div>
          </div>
        </div>
      </section>
        </div>
  </>
  );
}