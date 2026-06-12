export default function ContactHero() {
  return (
    <section className="w-full px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Contact
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-none">
            Reach out — we respond fast
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-neutral-500 leading-relaxed max-w-xl">
            Questions, bug reports, feature ideas, partnership opportunities, or
            just saying hi — all welcome here.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-neutral-500">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Usually replies within 24 hours
          </div>
        </div>
      </div>
    </section>
  );
}
