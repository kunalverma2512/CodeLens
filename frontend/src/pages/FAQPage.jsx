import { useState } from "react";

const FAQ_CATEGORIES = [
  {
    id: "general",
    label: "General",
    icon: "◈",
    questions: [
      {
        q: "What is CodeLens?",
        a: "CodeLens is an engineering telemetry platform that aggregates your performance data from GitHub, LeetCode, and Codeforces into a single unified dashboard. It uses Google's Gemini AI to analyze your metrics and generate a precision-guided roadmap to mastery.",
      },
      {
        q: "Is CodeLens free to use?",
        a: "Yes. CodeLens is fully open source and free to use. You only need your own API keys (GitHub, Gemini) to get started. There are no paywalls or hidden fees.",
      },
      {
        q: "Which platforms does CodeLens support?",
        a: "CodeLens currently supports GitHub, LeetCode, and Codeforces. Trilateral sync pulls real-time data from all three simultaneously and normalizes them into a single view.",
      },
    ],
  },
  {
    id: "setup",
    label: "Setup & Config",
    icon: "◉",
    questions: [
      {
        q: "What do I need to run CodeLens locally?",
        a: "You need Node.js v18 or higher, a MongoDB instance (local or Atlas), and a valid Google Gemini API key. Clone the repo, fill in the .env files for both the frontend and server directories, and run npm run dev in each.",
      },
      {
        q: "How do I get a free MongoDB database?",
        a: "Sign up at mongodb.com/cloud/atlas, create a free M0 cluster, add a database user, whitelist your IP, and copy the connection string. Paste it into your server/.env as MONGO_URI. The README has a step-by-step guide.",
      },
      {
        q: "Where do I put my Gemini API key?",
        a: "Add it to your server/.env file as GEMINI_API_KEY=your_key_here. You can optionally also add VITE_GEMINI_KEY in frontend/.env for any client-side features, but the core AI engine runs server-side.",
      },
      {
        q: "The server won't start — what should I check?",
        a: "Verify your MONGO_URI is correct and your IP is whitelisted in Atlas. Make sure PORT, JWT_SECRET, and GEMINI_API_KEY are all set. Check that you're running Node.js v18+ with node --version.",
      },
    ],
  },
  {
    id: "features",
    label: "Features",
    icon: "◆",
    questions: [
      {
        q: "How does the AI roadmap generation work?",
        a: "CodeLens aggregates your failed submissions, weak topics, and performance patterns across all three platforms, then sends anonymized telemetry to the Gemini API. Gemini analyzes the data and returns a milestone-based curriculum tailored to your specific gaps.",
      },
      {
        q: "What is the Problem of the Day?",
        a: "The Problem of the Day is a curated algorithm challenge selected exclusively based on your identified weaknesses — not a generic daily problem. It changes based on your current roadmap and what you need to work on most.",
      },
      {
        q: "Is my data private?",
        a: "Yes. CodeLens uses ephemeral LLM context, meaning your telemetry is not stored by the AI engine between sessions. Your data stays in your own MongoDB instance. Google does not retain your personal data.",
      },
    ],
  },
  {
    id: "contributing",
    label: "Contributing",
    icon: "◇",
    questions: [
      {
        q: "How do I contribute to CodeLens?",
        a: "Fork the repo, read CONTRIBUTING.md for coding standards and PR workflow, pick an open issue, and submit a PR. The project follows strict ES Modules, a Controller/Service/Repository backend pattern, and Tailwind CSS brutalist design on the frontend.",
      },
      {
        q: "Are there good first issues for beginners?",
        a: "Yes — issues labeled 'good first issue' are specifically scoped for new contributors. They typically involve UI improvements, new pages, or small feature additions that don't require deep knowledge of the full codebase.",
      },
      {
        q: "What is the tech stack I need to know?",
        a: "Frontend: React + Vite + Tailwind CSS v4 + React Router v6. Backend: Node.js + Express (ES Modules) + MongoDB via Mongoose + Google Gemini API. Familiarity with the MERN stack is sufficient to contribute.",
      },
    ],
  },
];

function AccordionItem({ question, answer, index, isOpen, onToggle }) {
  return (
    <div className={`border-b-4 border-black transition-colors duration-150 ${isOpen ? "bg-black" : "bg-white hover:bg-gray-50"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className={`shrink-0 font-mono text-xs mt-1 select-none font-black tracking-widest ${isOpen ? "text-white/40" : "text-black/30"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className={`flex-1 font-black text-sm sm:text-base leading-snug uppercase tracking-tight ${isOpen ? "text-white" : "text-black"}`}>
          {question}
        </span>

        <span
          className={`shrink-0 mt-0.5 text-xl font-black select-none transition-transform duration-300 ${isOpen ? "text-white rotate-45" : "text-black rotate-0"}`}
          style={{ display: "inline-block" }}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        style={{
          maxHeight: isOpen ? "400px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <p className="px-6 pb-6 pt-0 text-sm sm:text-base leading-relaxed text-white/75 font-bold tracking-wide" style={{ paddingLeft: "3.25rem" }}>
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openIndex, setOpenIndex] = useState(null);

  const currentCategory = FAQ_CATEGORIES.find((c) => c.id === activeCategory);

  function handleCategoryChange(id) {
    setActiveCategory(id);
    setOpenIndex(null);
  }

  function handleToggle(index) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <main className="min-h-screen bg-white text-black">

      {/* ── Hero ── */}
      <section className="border-b-4 border-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/40 mb-5">
            Support / FAQ
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tighter uppercase mb-6">
            FREQUENTLY
            <br />
            <span className="inline-block border-b-8 border-black pb-1">ASKED.</span>
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-black/50 font-bold uppercase tracking-wide leading-relaxed">
            Everything you need to know about setting up, using, and contributing to CodeLens.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

          {/* ── Category Sidebar ── */}
          <aside className="lg:w-64 shrink-0 border-4 border-black">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/40 px-6 pt-6 pb-3">
              Categories
            </p>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`shrink-0 lg:shrink text-left px-6 py-4 text-sm font-black uppercase tracking-widest transition-colors duration-150 border-r-4 lg:border-r-0 lg:border-t-4 border-black first:border-t-0 flex items-center gap-3 ${
                    activeCategory === cat.id
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </aside>

          {/* ── Accordion Panel ── */}
          <div className="flex-1 min-w-0 border-4 border-black">
            {/* Panel header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b-4 border-black bg-gray-50">
              <span className="text-xl leading-none">{currentCategory?.icon}</span>
              <h2 className="text-sm font-black uppercase tracking-widest flex-1">
                {currentCategory?.label}
              </h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-black/30">
                {currentCategory?.questions.length} questions
              </span>
            </div>

            {/* Questions */}
            <div key={activeCategory}>
              {currentCategory?.questions.map((item, i) => (
                <AccordionItem
                  key={i}
                  index={i}
                  question={item.q}
                  answer={item.a}
                  isOpen={openIndex === i}
                  onToggle={() => handleToggle(i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Still have questions CTA ── */}
        <div className="mt-8 border-4 border-black flex flex-col sm:flex-row items-stretch">
          <div className="w-2 bg-black shrink-0 hidden sm:block" />
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-8 py-6 sm:py-8">
            <div>
              <h3 className="font-black text-lg uppercase tracking-widest mb-1">
                Still have questions?
              </h3>
              <p className="text-sm font-bold text-black/50 uppercase tracking-wide">
                Open an issue on GitHub or check the contributing guide.
              </p>
            </div>
            <a
              href="https://github.com/kunalverma2512/CodeLens/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 bg-black text-white text-sm font-black uppercase tracking-widest px-6 py-3 border-4 border-black hover:bg-white hover:text-black transition-colors duration-150"
            >
              Open an Issue
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
