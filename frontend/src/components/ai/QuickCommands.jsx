export default function QuickCommands({
  quickPrompts,
  handleQuickPrompt,
}) {
  return (
    <div className="border-4 border-black bg-white p-5">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] mb-4 border-b-4 border-black pb-3">
        Quick Commands
      </h3>

      <div className="space-y-2.5">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(prompt)}
            className="w-full text-left px-3.5 py-2.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-black text-[11px] uppercase tracking-[0.08em]"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

