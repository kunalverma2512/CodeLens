export default function ChatInput({
  inputValue,
  setInputValue,
  handleSendMessage,
  isLoading,
}) {
  return (
    <div className="border-t-4 border-black bg-white p-3 sm:p-4 lg:p-5">
      <form
        onSubmit={handleSendMessage}
        className="flex gap-2.5 sm:gap-3"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask APEX anything..."
          disabled={isLoading}
          className="flex-1 border-2 border-black px-3.5 sm:px-4 py-2.5 sm:py-3 font-bold text-xs sm:text-sm uppercase tracking-[0.08em] placeholder:text-black placeholder:opacity-35 focus:outline-none focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-shadow disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="px-4 sm:px-6 lg:px-7 py-2.5 sm:py-3 border-2 border-black bg-black text-white font-black text-xs uppercase tracking-[0.12em] hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>

      <div className="mt-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-black opacity-60">
        Powered by Advanced AI • Multi-source performance synthesis
      </div>
    </div>
  );
}

