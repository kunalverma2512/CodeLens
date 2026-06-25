import { useState } from "react";
import { faqSource } from "../../docs/faqSource";

export default function FAQSection() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-12">
      {faqSource.map((categoryGroup) => (
        <div key={categoryGroup.category} className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-[0.2em] text-zinc-400 border-b-2 border-black pb-2">
            {categoryGroup.category}
          </h3>

          <div className="space-y-4">
            {categoryGroup.faqs.map((item) => {
              const isOpen = openId === item.id;
              const buttonId = `docs-faq-btn-${item.id}`;
              const panelId = `docs-faq-panel-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between text-left"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    id={buttonId}
                  >
                    <span className="text-base sm:text-lg font-black uppercase tracking-tight pr-4">
                      {item.q}
                    </span>
                    <span className="text-2xl font-black shrink-0">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="mt-4 border-t-2 border-black pt-4"
                    >
                      <p className="text-sm font-bold leading-relaxed text-zinc-700 uppercase tracking-wide">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
