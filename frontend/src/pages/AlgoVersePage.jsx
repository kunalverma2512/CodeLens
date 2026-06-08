import { useState } from "react";

export default function AlgoVersePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const algorithmCategories = [
    { id: "all", name: "All Algorithms", icon: "◬", count: 250 },
    { id: "sorting", name: "Sorting", icon: "⇅", count: 12 },
    { id: "searching", name: "Searching", icon: "🔍", count: 8 },
    { id: "graph", name: "Graph", icon: "◈", count: 35 },
    { id: "dynamic", name: "Dynamic Programming", icon: "⚡", count: 45 },
    { id: "greedy", name: "Greedy", icon: "💎", count: 28 },
    { id: "backtracking", name: "Backtracking", icon: "↩", count: 18 },
    { id: "divide", name: "Divide & Conquer", icon: "✂", count: 15 },
    { id: "string", name: "String", icon: "📝", count: 32 },
    { id: "tree", name: "Tree", icon: "🌲", count: 38 },
    { id: "array", name: "Array", icon: "▦", count: 42 },
    { id: "math", name: "Mathematical", icon: "∑", count: 25 },
  ];

  const featuredAlgorithms = [
    {
      id: 1,
      name: "Dijkstra's Algorithm",
      category: "Graph",
      difficulty: "Medium",
      timeComplexity: "O((V + E) log V)",
      spaceComplexity: "O(V)",
      description: "Find shortest paths from source to all vertices in weighted graph",
      tags: ["Shortest Path", "Greedy", "Priority Queue"],
    },
    {
      id: 2,
      name: "Quick Sort",
      category: "Sorting",
      difficulty: "Medium",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(log n)",
      description: "Efficient divide-and-conquer sorting algorithm",
      tags: ["Divide & Conquer", "In-place", "Unstable"],
    },
    {
      id: 3,
      name: "Knuth-Morris-Pratt (KMP)",
      category: "String",
      difficulty: "Hard",
      timeComplexity: "O(n + m)",
      spaceComplexity: "O(m)",
      description: "Pattern matching algorithm with linear time complexity",
      tags: ["Pattern Matching", "Prefix Function"],
    },
    {
      id: 4,
      name: "Binary Search",
      category: "Searching",
      difficulty: "Easy",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      description: "Search sorted array by repeatedly dividing search interval",
      tags: ["Divide & Conquer", "Iterative"],
    },
    {
      id: 5,
      name: "Floyd-Warshall",
      category: "Graph",
      difficulty: "Hard",
      timeComplexity: "O(V³)",
      spaceComplexity: "O(V²)",
      description: "All-pairs shortest path algorithm for weighted graphs",
      tags: ["Dynamic Programming", "All Pairs"],
    },
    {
      id: 6,
      name: "Merge Sort",
      category: "Sorting",
      difficulty: "Medium",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      description: "Stable divide-and-conquer sorting with guaranteed performance",
      tags: ["Divide & Conquer", "Stable", "External Sorting"],
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800 border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-800";
    }
  };

  return (
    <main>
      <title>AlgoVerse - CodeLens</title>
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full border-b-4 border-black px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-block border-4 border-black bg-black text-white px-6 py-3">
              <span className="font-black text-sm sm:text-base uppercase tracking-widest">
                Algorithm Mastery Hub
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-black">
              AlgoVerse
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide text-black max-w-4xl mx-auto leading-relaxed">
              Every algorithm. Every visualization. Every explanation. All in one universe.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="border-4 border-black px-6 py-4 bg-white">
                <div className="text-3xl sm:text-4xl font-black text-black">250+</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                  Algorithms
                </div>
              </div>
              <div className="border-4 border-black px-6 py-4 bg-black text-white">
                <div className="text-3xl sm:text-4xl font-black">100%</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest mt-1">
                  Interactive
                </div>
              </div>
              <div className="border-4 border-black px-6 py-4 bg-white">
                <div className="text-3xl sm:text-4xl font-black text-black">12</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-black mt-1">
                  Categories
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="w-full border-b-4 border-black px-4 sm:px-6 md:px-8 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="SEARCH ALGORITHMS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-4 border-black px-6 py-4 font-bold text-base uppercase tracking-wide placeholder:text-black placeholder:opacity-40 focus:outline-none focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-shadow"
                />
            </div>
            {/* Filter Button */}
            <button className="px-8 py-4 border-4 border-black bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Filter Results
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full border-b-4 border-black px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 sm:mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {algorithmCategories.map((category) => (
              <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`border-4 border-black p-4 sm:p-6 transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] ${
                selectedCategory === category.id
                ? "bg-black text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
                    : "bg-white text-black"
                  }`}
              >
                <div className="text-3xl font-black mb-3">{category.icon}</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight mb-2">
                  {category.name}
                </div>
                <div className="text-xs font-bold opacity-70">{category.count} algos</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Algorithms */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
              Featured Algorithms
            </h2>
            <button className="text-sm font-black uppercase tracking-widest border-b-4 border-black hover:opacity-60 transition-opacity">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAlgorithms.map((algo) => (
              <div
              key={algo.id}
              className="border-4 border-black bg-white p-6 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`border-2 px-3 py-1 text-xs font-black uppercase tracking-wide ${getDifficultyColor(
                      algo.difficulty
                    )}`}
                    >
                    {algo.difficulty}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-500">
                    {algo.category}
                  </div>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight text-black mb-3 group-hover:underline">
                  {algo.name}
                </h3>

                <p className="text-sm font-bold text-gray-700 mb-4 leading-relaxed">
                  {algo.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="uppercase tracking-wide text-gray-600">Time:</span>
                    <span className="font-black text-black">{algo.timeComplexity}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="uppercase tracking-wide text-gray-600">Space:</span>
                    <span className="font-black text-black">{algo.spaceComplexity}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-black">
                  {algo.tags.map((tag, idx) => (
                    <span
                    key={idx}
                    className="text-[10px] font-black uppercase tracking-wide border-2 border-black px-2 py-1 bg-gray-50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black flex gap-3">
                  <button className="flex-1 px-4 py-2 border-2 border-black bg-black text-white font-black text-xs uppercase tracking-wide hover:bg-white hover:text-black transition-colors">
                    Learn
                  </button>
                  <button className="flex-1 px-4 py-2 border-2 border-black bg-white text-black font-black text-xs uppercase tracking-wide hover:bg-black hover:text-white transition-colors">
                    Visualize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full border-t-4 border-black px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Master Every Algorithm
          </h2>
          <p className="text-base sm:text-lg font-bold uppercase tracking-wide max-w-3xl mx-auto">
            Interactive visualizations, step-by-step explanations, and real-world applications for every algorithm you need to master.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6">
            <button className="w-full sm:w-auto px-10 py-5 border-4 border-white bg-white text-black font-black uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors">
              Start Learning Free
            </button>
            <button className="w-full sm:w-auto px-10 py-5 border-4 border-white bg-transparent text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Browse All Algorithms
            </button>
          </div>
        </div>
      </section>
    </div>
            </main>
  );
}
