import { useEffect, useState } from "react";

export default function DocsSidebar({ sections = [] }) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Monitor viewport scrolling to update active link highlighting
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sections.forEach((section) => {
      if (section.visible) {
        const el = document.getElementById(section.id);
        if (el) observer.observe(el);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.visible) {
          const el = document.getElementById(section.id);
          if (el) observer.unobserve(el);
        }
      });
    };
  }, [sections]);

  const handleLinkClick = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const visibleSections = sections.filter((s) => s.visible);

  return (
    <div className="w-full lg:w-64 lg:shrink-0">
      {/* Desktop Sticky Navigation */}
      <nav className="hidden lg:block sticky top-24 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto pr-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 pb-2 border-b border-zinc-100">
          Navigation Index
        </p>
        <ul className="space-y-1">
          {visibleSections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <li key={sec.id}>
                <button
                  onClick={() => handleLinkClick(sec.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors border-l-4 ${
                    isActive
                      ? "border-black text-black bg-zinc-50"
                      : "border-transparent text-zinc-500 hover:text-black hover:border-zinc-300"
                  }`}
                >
                  {sec.title}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Collapsible Navigation */}
      <div className="lg:hidden w-full sticky top-[57px] z-30 bg-white border-b-4 border-black px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between border-4 border-black px-4 py-3 bg-white hover:bg-zinc-50 font-black text-xs uppercase tracking-widest text-black transition-colors"
        >
          <span>
            Index: {visibleSections.find((s) => s.id === activeId)?.title || "Select Section"}
          </span>
          <span className="text-sm font-black transition-transform duration-200">
            {isOpen ? "▴" : "▾"}
          </span>
        </button>

        {isOpen && (
          <ul className="mt-2 border-4 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] divide-y-2 divide-black">
            {visibleSections.map((sec) => (
              <li key={sec.id}>
                <button
                  onClick={() => handleLinkClick(sec.id)}
                  className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors"
                >
                  {sec.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
