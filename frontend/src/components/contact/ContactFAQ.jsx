import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is CodeLens free to use?",
    a: "Yes — 100% free and open source. No hidden fees, no restrictions. Developer tools should be accessible to everyone, period.",
  },
  {
    q: "How do I report a security vulnerability?",
    a: "Found a flaw? Email security@codelens.dev or open a GitHub Security Advisory. Keep vulnerabilities private until we fix them.",
  },
  {
    q: "Can I contribute?",
    a: "Absolutely. CodeLens is open source and we welcome contributors with open arms. Head to our GitHub repo for guidelines, open issues, and the roadmap.",
  },
  {
    q: "How do I request new integrations?",
    a: "Open a feature request on GitHub. We listen to the community and prioritize what matters most to you.",
  },
  {
    q: "Where is my data stored?",
    a: "On secure servers with enterprise-grade encryption. Your data stays yours. Check our privacy policy for the full breakdown.",
  },
];

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = useCallback(
    (index) => {
      setOpenIndex((prev) => (prev === index ? null : index));
    },
    [],
  );

  return (
    <section className="w-full px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl w-full">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
            FAQ
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900">
            Frequently asked questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div
                key={index}
                className="border border-neutral-200 bg-white overflow-hidden transition-shadow duration-200 hover:shadow-sm"
              >
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="text-sm font-medium text-neutral-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
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
                    <p className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
