import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import useDebounce from "../hooks/useDebounce";

// ─── Constants ────────────────────────────────────────────────────────────────

const CF_API = "https://codeforces.com/api/problemset.problems";
const CF_BASE = "https://codeforces.com/problemset/problem";

const PAGE_SIZE = 50;

const RATING_RANGES = [
  { label: "All Ratings", min: 0, max: Infinity },
  { label: "800", min: 800, max: 800 },
  { label: "900", min: 900, max: 900 },
  { label: "1000", min: 1000, max: 1000 },
  { label: "1100", min: 1100, max: 1100 },
  { label: "1200", min: 1200, max: 1200 },
  { label: "1300", min: 1300, max: 1300 },
  { label: "1400", min: 1400, max: 1400 },
  { label: "1500", min: 1500, max: 1500 },
  { label: "1600", min: 1600, max: 1600 },
  { label: "1700", min: 1700, max: 1700 },
  { label: "1800", min: 1800, max: 1800 },
  { label: "1900", min: 1900, max: 1900 },
  { label: "2000", min: 2000, max: 2000 },
  { label: "2100", min: 2100, max: 2100 },
  { label: "2200", min: 2200, max: 2200 },
  { label: "2300", min: 2300, max: 2300 },
  { label: "2400+", min: 2400, max: Infinity },
];

const SORT_OPTIONS = [
  { value: "rating-asc", label: "Rating ↑ (Easiest First)" },
  { value: "rating-desc", label: "Rating ↓ (Hardest First)" },
  { value: "solved-desc", label: "Most Solved" },
  { value: "solved-asc", label: "Least Solved" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "contest-desc", label: "Newest Contest" },
];

const ALL_TAGS = [
  "2-sat","binary search","bitmasks","brute force","chinese remainder theorem",
  "combinatorics","constructive algorithms","data structures","dfs and similar",
  "divide and conquer","dp","dsu","expression parsing","fft","flows",
  "games","geometry","graph matchings","graphs","greedy","hashing",
  "implementation","interactive","math","matrices","meet-in-the-middle",
  "number theory","probabilities","schedules","shortest paths","sortings",
  "special","string suffix structures","strings","ternary search","trees","two pointers",
];

// ─── Rating → difficulty badge ────────────────────────────────────────────────

function difficultyLabel(rating) {
  if (!rating) return { label: "Unrated", cls: "border-black text-gray-500" };
  if (rating <= 1000) return { label: "Beginner", cls: "border-black bg-gray-100 text-black" };
  if (rating <= 1400) return { label: "Easy", cls: "border-black bg-black text-white" };
  if (rating <= 1800) return { label: "Medium", cls: "border-black bg-gray-700 text-white" };
  if (rating <= 2200) return { label: "Hard", cls: "border-black bg-black text-white" };
  return { label: "Expert", cls: "border-black bg-black text-white" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <div className="w-12 h-12 border-[4px] border-black border-t-transparent animate-spin" />
      <p className="font-black uppercase tracking-widest text-sm text-gray-500">
        Fetching problems from Codeforces...
      </p>
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="border-[4px] border-black p-8 text-center my-12">
      <p className="text-2xl font-black uppercase tracking-tighter mb-2">
        Failed to Load Problems
      </p>
      <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-sm border-[4px] border-black hover:bg-gray-900 transition-colors"
      >
        Retry →
      </button>
    </div>
  );
}

function ProblemRow({ problem, stats, index }) {
  const url = `${CF_BASE}/${problem.contestId}/${problem.index}`;
  const { label: diffLabel, cls: diffCls } = difficultyLabel(problem.rating);
  const solvedCount = stats?.solvedCount;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 border-b-[2px] border-black px-4 py-4 hover:bg-black hover:text-white transition-colors duration-150"
    >
      {/* Index number */}
      <span className="hidden sm:block w-10 text-xs font-black text-gray-400 group-hover:text-gray-300 flex-shrink-0">
        {index + 1}
      </span>

      {/* Problem ID */}
      <span className="w-20 font-black text-xs uppercase tracking-widest flex-shrink-0 font-mono">
        {problem.contestId}/{problem.index}
      </span>

      {/* Name */}
      <span className="flex-1 font-black text-sm tracking-tight group-hover:underline underline-offset-4 decoration-2 min-w-0">
        {problem.name}
      </span>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 sm:w-52 lg:w-64 flex-shrink-0">
        {(problem.tags || []).slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-[10px] font-black uppercase tracking-widest border border-current px-1.5 py-0.5 group-hover:border-white"
          >
            {t}
          </span>
        ))}
        {problem.tags?.length > 3 && (
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
            +{problem.tags.length - 3}
          </span>
        )}
      </div>

      {/* Rating */}
      <span className="w-14 text-center flex-shrink-0">
        {problem.rating ? (
          <span className="font-black text-sm">{problem.rating}</span>
        ) : (
          <span className="text-gray-400 font-bold text-xs">—</span>
        )}
      </span>



            {/* Difficulty badge */}
    <span className="w-20 text-center flex-shrink-0 hidden lg:block">
      <span className={`text-[10px] font-black uppercase tracking-widest border-2 px-2 py-0.5
      group-hover:text-white
      group-hover:bg-black
      group-hover:border-white
          ${diffCls}`}>
        {diffLabel}
      </span>
    </span>

      {/* Solved count */}
      <span className="w-20 text-right flex-shrink-0">
        {solvedCount != null ? (
          <span className="font-black text-sm tabular-nums">
            {solvedCount >= 1000 ? `${(solvedCount / 1000).toFixed(1)}k` : solvedCount}
          </span>
        ) : (
          <span className="text-gray-400 font-bold text-xs">—</span>
        )}
      </span>

      {/* External link arrow */}
      <span className="w-8 text-right flex-shrink-0 text-xs font-black opacity-30 group-hover:opacity-100 hidden sm:block">
        ↗
      </span>
    </a>
  );
}

function TagPill({ tag, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(tag)}
      className={`text-[11px] font-black uppercase tracking-widest border-2 border-black px-2.5 py-1 transition-colors duration-100 ${
        selected ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
      }`}
    >
      {tag}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PracticePage() {
  // Data state
  const [problems, setProblems] = useState([]);
  const [statsMap, setStatsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [ratingIdx, setRatingIdx] = useState(0); // index into RATING_RANGES
  const [sortBy, setSortBy] = useState("rating-asc");
  const [showTagPanel, setShowTagPanel] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);

  // Refs
  const searchRef = useRef(null);
  const tagPanelRef = useRef(null);

  // ── Fetch from CF API ──────────────────────────────────────────────────────
  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // If tags selected, pass them as filter
      const tagParam = selectedTags.length
        ? `?tags=${encodeURIComponent(selectedTags.join(";"))}`
        : "";
      const res = await fetch(`${CF_API}${tagParam}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status !== "OK") throw new Error(json.comment || "CF API error");

      // Build stats lookup: "contestId/index" → ProblemStatistics
      const sm = {};
      (json.result.problemStatistics || []).forEach((s) => {
        sm[`${s.contestId}/${s.index}`] = s;
      });
      setStatsMap(sm);
      setProblems(json.result.problems || []);
      setPage(1);
    } catch (e) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedTags]);

  // Initial load + reload when tags change
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Reset page to 1 when debounced search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Close tag panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (tagPanelRef.current && !tagPanelRef.current.contains(e.target)) {
        setShowTagPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Filtering + Sorting ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const range = RATING_RANGES[ratingIdx];

    return problems.filter((p) => {
      // Search: name or contest/index
      if (q) {
        const nameMatch = p.name.toLowerCase().includes(q);
        const idMatch = `${p.contestId}/${p.index}`.toLowerCase().includes(q);
        const tagMatch = (p.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!nameMatch && !idMatch && !tagMatch) return false;
      }
      // Rating filter
      if (range.min !== 0 || range.max !== Infinity) {
        if (!p.rating) return false;
        if (p.rating < range.min || p.rating > range.max) return false;
      }
      return true;
    });
  }, [problems, debouncedSearch, ratingIdx]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case "rating-asc":
        return arr.sort((a, b) => (a.rating || 9999) - (b.rating || 9999));
      case "rating-desc":
        return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "solved-desc":
        return arr.sort((a, b) => {
          const sa = statsMap[`${a.contestId}/${a.index}`]?.solvedCount || 0;
          const sb = statsMap[`${b.contestId}/${b.index}`]?.solvedCount || 0;
          return sb - sa;
        });
      case "solved-asc":
        return arr.sort((a, b) => {
          const sa = statsMap[`${a.contestId}/${a.index}`]?.solvedCount || 0;
          const sb = statsMap[`${b.contestId}/${b.index}`]?.solvedCount || 0;
          return sa - sb;
        });
      case "name-asc":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "contest-desc":
        return arr.sort((a, b) => (b.contestId || 0) - (a.contestId || 0));
      default:
        return arr;
    }
  }, [filtered, sortBy, statsMap]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Tag helpers
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  const filteredTagList = ALL_TAGS.filter((t) =>
    t.toLowerCase().includes(tagInput.toLowerCase())
  );

  const clearAll = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setRatingIdx(0);
    setSortBy("rating-asc");
    setPage(1);
  };

  const hasFilters =
    debouncedSearch || selectedTags.length > 0 || ratingIdx !== 0 || sortBy !== "rating-asc";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-black">

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div className="w-full bg-black text-white border-b-[4px] border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 mb-3">
                CodeLens / Practice
              </p>
              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none">
                Practice
                <br />
                <span className="text-gray-400">CP Problems</span>
              </h1>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mt-4 max-w-xl">
                Browse the entire Codeforces problemset. Filter by rating, topic, sort by popularity — click any problem to solve it on Codeforces.
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <div className="text-5xl font-black tracking-tighter tabular-nums">
                {loading ? "—" : problems.length.toLocaleString()}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                Total Problems
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters Bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-[57px] z-40 bg-white border-b-[4px] border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-3">

            {/* Search */}
            <div className="flex-1 flex items-center border-[3px] border-black min-w-0">
              <span className="pl-4 pr-2 text-lg flex-shrink-0 select-none font-black">⌕</span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search by name, ID, or tag…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3 pr-4 bg-transparent font-bold text-sm uppercase tracking-widest outline-none placeholder:text-gray-400 placeholder:normal-case min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                  className="px-3 text-gray-500 hover:text-black font-black text-lg flex-shrink-0"
                >
                  ×
                </button>
              )}
            </div>

            {/* Rating filter */}
            <div className="flex-shrink-0">
              <select
                value={ratingIdx}
                onChange={(e) => { setRatingIdx(Number(e.target.value)); setPage(1); }}
                className="h-full border-[3px] border-black bg-white font-black text-xs uppercase tracking-widest px-4 py-3 outline-none cursor-pointer w-full lg:w-auto"
              >
                {RATING_RANGES.map((r, i) => (
                  <option key={r.label} value={i}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="h-full border-[3px] border-black bg-white font-black text-xs uppercase tracking-widest px-4 py-3 outline-none cursor-pointer w-full lg:w-auto"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags toggle */}
            <div className="relative flex-shrink-0" ref={tagPanelRef}>
              <button
                onClick={() => setShowTagPanel((v) => !v)}
                className={`h-full border-[3px] border-black px-4 py-3 font-black text-xs uppercase tracking-widest transition-colors w-full lg:w-auto ${
                  selectedTags.length > 0 || showTagPanel
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                Tags{selectedTags.length > 0 ? ` (${selectedTags.length})` : ""} {showTagPanel ? "▴" : "▾"}
              </button>

              {/* Tag dropdown panel */}
              {showTagPanel && (
                <div className="absolute top-full right-0 mt-1 w-[360px] bg-white border-[3px] border-black z-50 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                  <div className="p-3 border-b-[2px] border-black">
                    <input
                      type="text"
                      placeholder="Search tags…"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="w-full border-[2px] border-black px-3 py-2 font-bold text-xs uppercase tracking-widest outline-none"
                    />
                  </div>
                  <div className="p-3 flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                    {filteredTagList.map((t) => (
                      <TagPill
                        key={t}
                        tag={t}
                        selected={selectedTags.includes(t)}
                        onToggle={toggleTag}
                      />
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="border-t-[2px] border-black p-3 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-600">
                        {selectedTags.length} selected
                      </span>
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-xs font-black uppercase tracking-widest text-black hover:underline"
                      >
                        Clear Tags
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                Active:
              </span>
              {debouncedSearch && (
                <span className="text-xs font-black uppercase tracking-widest border-[2px] border-black px-2 py-0.5 flex items-center gap-1">
                  "{debouncedSearch}"
                  <button onClick={() => setSearchQuery("")} className="hover:opacity-60">×</button>
                </span>
              )}
              {ratingIdx !== 0 && (
                <span className="text-xs font-black uppercase tracking-widest border-[2px] border-black px-2 py-0.5 flex items-center gap-1">
                  Rating: {RATING_RANGES[ratingIdx].label}
                  <button onClick={() => setRatingIdx(0)} className="hover:opacity-60">×</button>
                </span>
              )}
              {selectedTags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-black uppercase tracking-widest border-[2px] border-black bg-black text-white px-2 py-0.5 flex items-center gap-1"
                >
                  {t}
                  <button onClick={() => toggleTag(t)} className="hover:opacity-60">×</button>
                </span>
              ))}
              <button
                onClick={clearAll}
                className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black underline underline-offset-4 ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats row */}
        {!loading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-black uppercase tracking-widest">
                {sorted.length.toLocaleString()} Problems
              </span>
              {sorted.length !== problems.length && (
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  (filtered from {problems.length.toLocaleString()})
                </span>
              )}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Page {page} of {totalPages || 1}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && <Spinner />}

        {/* Error */}
        {error && !loading && (
          <ErrorBanner message={error} onRetry={fetchProblems} />
        )}

        {/* Problem list */}
        {!loading && !error && (
          <>
            {sorted.length === 0 ? (
              <div className="border-[4px] border-black p-16 text-center">
                <div className="text-8xl font-black tracking-tighter text-gray-100 select-none mb-4">
                  ∅
                </div>
                <p className="font-black uppercase tracking-widest text-lg mb-2">
                  No Problems Found
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={clearAll}
                  className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-sm border-[4px] border-black hover:bg-gray-900 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="border-[4px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                {/* Table header */}
                <div className="hidden sm:flex items-center gap-0 border-b-[4px] border-black px-4 py-3 bg-black text-white">
                  <span className="hidden sm:block w-10 text-xs font-black uppercase tracking-widest text-gray-400 flex-shrink-0">
                    #
                  </span>
                  <span className="w-20 text-xs font-black uppercase tracking-widest text-gray-400 flex-shrink-0">
                    ID
                  </span>
                  <span className="flex-1 text-xs font-black uppercase tracking-widest text-gray-400">
                    Problem Name
                  </span>
                  <span className="w-52 lg:w-64 text-xs font-black uppercase tracking-widest text-gray-400 flex-shrink-0">
                    Tags
                  </span>
                  <span className="w-14 text-center text-xs font-black uppercase tracking-widest text-gray-400 flex-shrink-0">
                    Rating
                  </span>
                  <span className="w-20 hidden lg:block text-center text-xs font-black uppercase tracking-widest text-gray-400 flex-shrink-0">
                    Level
                  </span>
                  <span className="w-20 text-right text-xs font-black uppercase tracking-widest text-gray-400 flex-shrink-0">
                    Solved
                  </span>
                  <span className="w-8 hidden sm:block flex-shrink-0" />
                </div>

                {/* Rows */}
                {paginated.map((p, i) => (
                  <ProblemRow
                    key={`${p.contestId}-${p.index}`}
                    problem={p}
                    stats={statsMap[`${p.contestId}/${p.index}`]}
                    index={(page - 1) * PAGE_SIZE + i}
                  />
                ))}
              </div>
            )}

            {/* ── Pagination ─────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => { setPage(1); window.scrollTo({ top: 0 }); }}
                  disabled={page === 1}
                  className="px-3 py-2 border-[3px] border-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ««
                </button>
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0 }); }}
                  disabled={page === 1}
                  className="px-4 py-2 border-[3px] border-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹ Prev
                </button>

                {/* Page numbers */}
                {(() => {
                  const pages = [];
                  const start = Math.max(1, page - 2);
                  const end = Math.min(totalPages, page + 2);
                  for (let pg = start; pg <= end; pg++) {
                    pages.push(
                      <button
                        key={pg}
                        onClick={() => { setPage(pg); window.scrollTo({ top: 0 }); }}
                        className={`w-10 h-10 border-[3px] border-black font-black text-xs transition-colors ${
                          pg === page
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-gray-100"
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  }
                  return pages;
                })()}

                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0 }); }}
                  disabled={page === totalPages}
                  className="px-4 py-2 border-[3px] border-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next ›
                </button>
                <button
                  onClick={() => { setPage(totalPages); window.scrollTo({ top: 0 }); }}
                  disabled={page === totalPages}
                  className="px-3 py-2 border-[3px] border-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  »»
                </button>

                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">
                  {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length.toLocaleString()}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Footer Info Strip ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-4">
        <div className="border-t-[4px] border-black pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Data sourced live from{" "}
            <a
              href="https://codeforces.com/api/problemset.problems"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black font-black underline underline-offset-4 decoration-2 hover:opacity-60"
            >
              Codeforces Problemset API
            </a>
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            API limit: 1 req / 2s · Click any problem to solve on Codeforces ↗
          </p>
        </div>
      </div>
    </div>
  );
}
