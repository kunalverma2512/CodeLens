import { useState } from "react";

const faqs = [
  {
    q: "What role does the AI play in CodeLens?",
    a: "The platfrom uses Google's Gemini LLM as a seasoned Staff Engineer, analyzing the developer's combined data to identify bottlenecks and recommend a precise, personalized learning path.",
  },
  {
    q: "What are the platforms CodeLens integrates?",
    a: "CodeLens integrates three major developer platforms to build a complete picture of a developer's skills. GitHub is used to track code velocity, architectural complexity, and open source collaboration, while LeetCode evaluates algorithmic problem-solving and data structure fluency. Codeforces rounds out the trio by measuring competitive programming speed and advanced mathematical optimization.",
  },
  {
    q: "Is my repository data private?",
    a: "The platform is built to be an open API engine. Configuration determines visibility and update frequency. Privacy is guaranteed.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (index) => setOpenIdx(openIdx === index ? null : index);

  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-white">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-12 sm:mb-20 text-center leading-none">
          Frequently Asked
        </h2>
        <div className="space-y-6 sm:space-y-8 w-full">
          {faqs.map((item, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[12px_12px_0_0_rgba(0,0,0,1)] bg-white w-full transition-transform md:hover:-translate-y-1"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 p-6 sm:p-8 text-left"
                >
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black leading-tight">
                    Q: {item.q}
                  </h3>
                  <span
                    className="text-2xl font-black flex-shrink-0 transition-transform duration-200"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? "200px" : "0px" }}
                >
                  <p className="font-bold uppercase tracking-widest text-xs sm:text-sm text-black leading-relaxed px-6 sm:px-8 pb-6 sm:pb-8">
                    A: {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
