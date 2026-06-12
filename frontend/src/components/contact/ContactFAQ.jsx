import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is CodeLens free to use?",
    a: "Yes, CodeLens is completely free and open source. You can use it without any restrictions. We believe in making developer tools accessible to everyone.",
  },
  {
    q: "How do I report a security vulnerability?",
    a: "Please report security vulnerabilities privately by emailing security@codelens.dev or opening a GitHub Security Advisory. Do not post security vulnerabilities publicly.",
  },
  {
    q: "Can I contribute?",
    a: "Absolutely! CodeLens is open source and we welcome contributions. Check out our GitHub repository for contributing guidelines, open issues, and the project roadmap.",
  },
  {
    q: "How do I request new integrations?",
    a: "You can request new integrations by opening a feature request on GitHub or reaching out via our Discord community. We prioritize integrations based on community demand.",
  },
  {
    q: "Where is my data stored?",
    a: "Your data is stored securely on our servers. We follow industry best practices for data encryption and privacy. For detailed information, please refer to our privacy policy.",
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
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
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
                className="rounded-xl border border-neutral-200 bg-white overflow-hidden transition-shadow duration-200 hover:shadow-sm"
              >
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
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
