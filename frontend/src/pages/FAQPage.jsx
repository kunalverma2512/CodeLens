import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faqs } from "../data/faqs";

const supportTopics = [...new Set(faqs.map((item) => item.category))];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null);
  const itemRefs = useRef([]);
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/explore");
  };

  const toggleFaq = (index, shouldScroll = false) => {
    setOpenIdx((currentIndex) => (currentIndex === index ? null : index));

    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          itemRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      });
    }
  };

  return (
    <main className="w-full overflow-x-hidden bg-white text-black">
      <title>FAQ - CodeLens</title>
      <meta
        name="description"
        content="Frequently asked questions about CodeLens – platform tracking, data privacy, open source contributions, and more."
      />
      <section className="border-b-4 border-black px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-black">
              Help Center / FAQ
            </p>
            <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl">
              Answers Without The Noise.
            </h1>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:p-8 sm:shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
            <p className="text-base font-bold leading-relaxed text-black sm:text-lg">
              Quick answers for developers connecting coding platforms, reading analytics,
              protecting profile data, and contributing to CodeLens.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {supportTopics.map((topic) => (
                <span
                  key={topic}
                  className="border-2 border-black px-3 py-3 text-center text-[11px] font-black uppercase tracking-widest"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit border-4 border-black bg-black p-6 text-white lg:sticky lg:top-24">
            <h2 className="text-3xl font-black uppercase leading-none tracking-tight">
              FAQ Index
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              {faqs.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleFaq(index, true)}
                  className={`break-words border-2 px-4 py-3 text-left text-xs font-black uppercase tracking-widest transition-colors ${openIdx === index
                      ? "border-white bg-white text-black"
                      : "border-white text-white hover:bg-white hover:text-black"
                    }`}
                >
                  {String(index + 1).padStart(2, "0")} / {item.q}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex flex-col gap-6">
            {faqs.map((item, index) => {
              const isOpen = openIdx === index;
              const buttonId = `faq-button-${item.id}`;
              const panelId = `faq-panel-${item.id}`;

              return (
                <article
                  key={item.id}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  className="border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-6 p-6 text-left sm:p-8"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    id={buttonId}
                  >
                    <span className="text-2xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
                      {item.q}
                    </span>
                    <span className="text-4xl font-black leading-none" aria-hidden="true">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!isOpen}
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] border-t-4 border-black" : "grid-rows-[0fr]"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-3xl px-6 py-6 text-base font-bold leading-relaxed text-black sm:px-8 sm:text-lg">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t-4 border-black bg-black px-6 py-14 text-white sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em]">
              All Caught Up?
            </p>
            <h2 className="text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              Head Back To The Platform.
            </h2>
          </div>
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex border-4 border-white px-8 py-5 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            Go Back
          </button>
        </div>
      </section>
    </main>
  );
}
