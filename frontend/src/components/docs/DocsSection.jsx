export default function DocsSection({ id, title, label, children }) {
  return (
    <section
      id={id}
      className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16 bg-white text-black border-b-4 border-black last:border-b-0"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 sm:mb-12">
          {label && (
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 mb-2">
              {label}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none text-black">
            {title}
          </h2>
        </header>
        <div className="w-full">
          {children}
        </div>
      </div>
    </section>
  );
}
