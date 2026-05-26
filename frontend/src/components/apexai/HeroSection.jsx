const stats = [
  { value: "99.2%", label: "Precision" },
  { value: "24/7", label: "Available" },
  { value: "<1.5s", label: "Response" },
];

export default function HeroSection() {
  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      <div className="space-y-5">
        <div className="border-4 border-black bg-black text-white px-4 py-2 inline-block">
          <span className="font-black text-xs uppercase tracking-widest">
            AI-POWERED EXCELLENCE
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-none text-black">
          APEX AI
        </h1>

        <p className="text-sm font-bold uppercase tracking-wide text-black leading-relaxed border-l-4 border-black pl-4">
          Advanced Performance Excellence eXecutive
        </p>

        <p className="text-sm font-bold text-black leading-relaxed opacity-75">
          Your personal AI strategist that cross-references CP rankings, DSA
          proficiency, development velocity, and project architecture to deliver
          precision-targeted growth blueprints.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="border-4 border-black px-4 py-3 bg-white flex-1 min-w-[72px]"
          >
            <div className="text-xl xl:text-2xl font-black text-black">
              {value}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-black mt-0.5 opacity-70">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
