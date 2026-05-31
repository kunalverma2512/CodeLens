import { useState } from "react";
import { Link } from "react-router-dom";
import { faqs } from "../../data/faqs";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (index) => setOpenIdx(openIdx === index ? null : index);

  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-4 border-black bg-white">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-12 sm:mb-20 text-center leading-none">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6 sm:space-y-8 w-full">
          {faqs.map((item, index) => {
            const isOpen = openIdx === index;
            const buttonId = `landing-faq-button-${item.id}`;
            const panelId = `landing-faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className="border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[12px_12px_0_0_rgba(0,0,0,1)] bg-white w-full transition-transform md:hover:-translate-y-1"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 p-6 sm:p-8 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  id={buttonId}
                >
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black leading-tight">
                    Q: {item.q}
                  </h3>

                  <span
                    className="text-2xl font-black shrink-0 transition-transform duration-200"
                    aria-hidden="true"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-bold uppercase tracking-widest text-xs sm:text-sm text-black leading-relaxed px-6 sm:px-8 pb-6 sm:pb-8">
                      A: {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/faq"
            className="border-2 border-black px-5 py-2 text-sm sm:text-base font-black uppercase bg-white tracking-widest shadow-[5px_5px_0_0_rgba(0,0,0,1)] text-black transition-all duration-200 hover:bg-black hover:text-white hover:translate-x-1 hover:translate-y-1"
          >
            View All FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
