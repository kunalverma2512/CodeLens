import { useState } from "react";

export default function ContestCodeChefPage() {
  const [selectedType, setSelectedType] = useState("all");

  const contestSolutions = [
    {
      id: 1,
      contestName: "Starters 115",
      date: "Dec 2023",
      type: "Starters",
      problems: 8,
      difficulty: "Easy-Hard",
      tags: ["Arrays", "DP", "Greedy"],
    },
    {
      id: 2,
      contestName: "CodeChef Long Challenge",
      date: "Nov 2023",
      type: "Long",
      problems: 10,
      difficulty: "Medium-Expert",
      tags: ["Graphs", "Number Theory", "Strings"],
    },
    {
      id: 3,
      contestName: "Lunch Time December",
      date: "Dec 2023",
      type: "Lunchtime",
      problems: 6,
      difficulty: "Easy-Medium",
      tags: ["Math", "Implementation", "Binary Search"],
    },
  ];

  return (
    <main>
      <style>CodeChef Constests - CodeLens</style>
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full border-b-4 border-black px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-3 border-4 border-black bg-amber-700 text-white px-6 py-3">
              <span className="text-2xl">🟤</span>
              <span className="font-black text-sm sm:text-base uppercase tracking-widest">
                Contest Arsenal
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-black">
              CodeChef
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide text-black max-w-4xl mx-auto leading-relaxed">
              Comprehensive solutions for Long, Lunchtime & Starters contests
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="border-4 border-black px-6 py-4 bg-white">
                <div className="text-3xl sm:text-4xl font-black text-black">120+</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                  Contests
                </div>
              </div>
              <div className="border-4 border-black px-6 py-4 bg-amber-700 text-white">
                <div className="text-3xl sm:text-4xl font-black">750+</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest mt-1">
                  Solutions
                </div>
              </div>
              <div className="border-4 border-black px-6 py-4 bg-white">
                <div className="text-3xl sm:text-4xl font-black text-black">3</div>
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
            {["all", "Starters", "Long", "Lunchtime", "Cook-Off"].map((type) => (
              <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-3 border-4 border-black font-black text-sm uppercase tracking-widest transition-all ${
                selectedType === type
                ? "bg-amber-700 text-white"
                : "bg-white text-black hover:bg-amber-700 hover:text-white"
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
                  <div className="border-2 border-amber-700 bg-orange-50 text-amber-900 px-3 py-1 text-xs font-black uppercase tracking-wide">
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
                      Level
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

                <button className="w-full px-6 py-3 border-4 border-black bg-amber-700 text-white font-black uppercase tracking-widest hover:bg-black transition-colors">
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
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Complete Editorials</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-700">
                In-depth problem analysis with multiple solution approaches
              </p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <div className="text-4xl font-black mb-4">⚡</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Optimized Code</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-700">
                Battle-tested solutions in multiple programming languages
              </p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <div className="text-4xl font-black mb-4">📊</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Difficulty Rating</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-700">
                Clear difficulty classification from beginner to expert level
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
            </main>
  );
}
