import { useEffect, useState } from "react";

const slides = [
  {
    title: "Competitive Programming",
    description:
      "Practice curated problems and strengthen problem-solving skills through structured learning.",
    stat: "500+",
  },
  {
    title: "AlgoVerse",
    description:
      "Visualize algorithms and data structures with interactive learning experiences.",
    stat: "DSA",
  },
  {
    title: "GitHub Intelligence",
    description:
      "Analyze repositories and gain deeper insights into development activity.",
    stat: "GitHub",
  },
  {
    title: "APEX AI",
    description:
      "Leverage AI-powered tools to improve productivity and learning outcomes.",
    stat: "AI",
  },
  {
    title: "Community Driven",
    description:
      "Built with community feedback and contributions to help learners grow together.",
    stat: "Open",
  },
];

export default function AboutCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="max-w-6xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Platform highlights"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          setCurrent((prev) => (prev + 1) % slides.length);
        }

        if (e.key === "ArrowLeft") {
          setCurrent(
            (prev) => (prev - 1 + slides.length) % slides.length
          );
        }
      }}
    >
      <div className="relative bg-black text-white  p-10 md:p-14 overflow-hidden min-h-[320px]">

        <div
          aria-hidden="true"
          className="absolute top-4 right-6 text-[90px] md:text-[140px] font-black text-zinc-800 select-none"
        >
          {slides[current].stat}
        </div>

        <div
          className="relative z-10 max-w-2xl"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="uppercase tracking-[0.25em] text-xs text-zinc-400 mb-4">
            Platform Highlight
          </p>

          <h3 className="text-4xl md:text-5xl font-black mb-6">
            {slides[current].title}
          </h3>

          <p className="text-zinc-300 text-lg leading-8">
            {slides[current].description}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            aria-current={
              current === index ? "true" : undefined
            }
            className={`transition-all duration-300 rounded-full ${
              current === index
                ? "w-10 h-3 bg-black"
                : "w-3 h-3 bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}