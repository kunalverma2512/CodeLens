import { useState } from "react";

export default function ContestLeetCodePage() {
  const [selectedType, setSelectedType] = useState("all");

  const contestSolutions = [
    {
      id: 1,
      contestName: "Weekly Contest 375",
      date: "Dec 2023",
      type: "Weekly",
      problems: 4,
      difficulty: "Easy-Hard",
      tags: ["Arrays", "DP", "Sliding Window"],
    },
    {
      id: 2,
      contestName: "Biweekly Contest 120",
      date: "Dec 2023",
      type: "Biweekly",
      problems: 4,
      difficulty: "Easy-Medium",
      tags: ["Hash Table", "Binary Search", "Greedy"],
    },
    {
      id: 3,
      contestName: "Weekly Contest 374",
      date: "Nov 2023",
      type: "Weekly",
      problems: 4,
      difficulty: "Easy-Hard",
      tags: ["Trees", "Graph", "Math"],
    },
  ];

  return (
  <>
    <title>LeetCode Contests - CodeLens</title>

    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full border-b-4 border-black px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 bg-gradient-to-br from-yellow-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-3 border-4 border-black bg-yellow-500 text-black px-6 py-3">
              <span className="text-2xl">🟡</span>
              <span className="font-black text-sm sm:text-base uppercase tracking-widest">
                Contest Arsenal
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-black">
              LeetCode
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide text-black max-w-4xl mx-auto leading-relaxed">
              Weekly & Biweekly contest editorials with optimized solutions
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="border-4 border-black px-6 py-4 bg-white">
                <div className="text-3xl sm:text-4xl font-black text-black">200+</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                  Contests
                </div>
              </div>
              <div className="border-4 border-black px-6 py-4 bg-yellow-500 text-black">
                <div className="text-3xl sm:text-4xl font-black">800+</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest mt-1">
                  Solutions
                </div>
              </div>
              <div className="border-4 border-black px-6 py-4 bg-white">
                <div className="text-3xl sm:text-4xl font-black text-black">2</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                  Formats
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
            {["all", "Weekly", "Biweekly"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 border-4 border-black font-black text-sm uppercase tracking-widest transition-all ${
                  selectedType === type
                    ? "bg-yellow-500 text-black"
                    : "bg-white text-black hover:bg-yellow-500"
                }`}
              >
                {type}
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
                  <div className="border-2 border-yellow-600 bg-yellow-50 text-yellow-800 px-3 py-1 text-xs font-black uppercase tracking-wide">
                    {contest.type}
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
                      Range
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

                <button className="w-full px-6 py-3 border-4 border-black bg-yellow-500 text-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
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
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Fast Editorials</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-700">
                Solutions published within hours of contest completion
              </p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <div className="text-4xl font-black mb-4">⚡</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Multiple Languages</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-700">
                Code examples in Python, Java, C++, and JavaScript
              </p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <div className="text-4xl font-black mb-4">📊</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Video Explanations</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-700">
                Visual walkthroughs for complex problems and approaches
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
   </>
  );
}
