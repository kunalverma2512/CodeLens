export default function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="border-2 border-black bg-white p-4 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-black animate-pulse" />
          <div className="w-2 h-2 bg-black animate-pulse [animation-delay:0.15s]" />
          <div className="w-2 h-2 bg-black animate-pulse [animation-delay:0.3s]" />
          <span className="text-[10px] font-black uppercase tracking-widest ml-1.5 opacity-60">
            Analyzing
          </span>
        </div>
      </div>
    </div>
  );
}
