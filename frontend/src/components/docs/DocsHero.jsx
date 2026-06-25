import { docsConfig } from "../../docs/docs.config";

export default function DocsHero() {
  const { docsTitle, docsSubtitle } = docsConfig.meta;

  return (
    <section className="bg-black text-white border-b-4 border-black px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-zinc-400 text-xs sm:text-sm mb-4">
          CodeLens Manuals / Documentation
        </p>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
          {docsTitle}
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base font-bold uppercase tracking-widest max-w-3xl leading-relaxed border-l-4 border-white pl-4">
          {docsSubtitle}
        </p>
      </div>
    </section>
  );
}
