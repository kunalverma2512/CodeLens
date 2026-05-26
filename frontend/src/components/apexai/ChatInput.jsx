export default function ChatInput({ inputValue, onChange, onSubmit, isLoading }) {
  return (
    <div className="border-t-4 border-black bg-white p-3 sm:p-4 flex-shrink-0">
      <form onSubmit={onSubmit} className="flex gap-2.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask APEX anything..."
          disabled={isLoading}
          className="flex-1 border-2 border-black px-4 py-2.5 font-bold text-sm tracking-wide placeholder:text-black placeholder:opacity-35 focus:outline-none focus:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-shadow disabled:opacity-50 bg-white"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="px-5 sm:px-7 py-2.5 border-2 border-black bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black opacity-40">
        Powered by Advanced AI · Multi-source performance synthesis
      </p>
    </div>
  );
}
