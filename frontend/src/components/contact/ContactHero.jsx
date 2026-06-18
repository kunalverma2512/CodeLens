export default function ContactHero() {
  return (
    <section className="w-full px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl w-full">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Contact
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-neutral-900 leading-none">
            Reach out — we don&apos;t keep you waiting
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-neutral-500 leading-relaxed max-w-xl">
            Questions, bugs, big ideas — don&apos;t sit on them. Drop us a line and we&apos;ll take it from there.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-neutral-500">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
            </span>
            We reply within 24 hours
          </div>
        </div>
      </div>
    </section>
  );
}
