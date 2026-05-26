const features = [
  {
    id: "01",
    title: "Unified Analytics",
    description:
      "Complete metric synthesis from CP platforms, DSA progress, and development projects",
    dark: false,
  },
  {
    id: "02",
    title: "Strategic Roadmaps",
    description:
      "AI-architected learning paths targeting your specific performance gaps",
    dark: true,
  },
  {
    id: "03",
    title: "Real-Time Guidance",
    description:
      "Instant insights on code patterns, algorithmic choices, and architecture decisions",
    dark: true,
  },
  {
    id: "04",
    title: "Elite Benchmarks",
    description:
      "Performance comparison against top-tier developers and industry standards",
    dark: false,
  },
];

export default function FeatureGrid() {
  return (
    <section className="w-full border-b-4 border-black px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black">
            Capabilities
          </h2>
          <p className="text-sm font-bold uppercase tracking-wide text-black mt-2 opacity-60">
            What APEX does for your developer journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map(({ id, title, description, dark }) => (
            <div
              key={id}
              className={`border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform ${
                dark ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <div className="text-3xl font-black mb-4 opacity-80">{id}</div>
              <h3 className="text-base font-black uppercase tracking-tight mb-2">
                {title}
              </h3>
              <p className="text-sm font-bold leading-relaxed opacity-75">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
