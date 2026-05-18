export default function GlobalLoadingOverlay({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] bg-white/85 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-[4px] border-black border-t-transparent animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.22em] text-black">Loading</p>
      </div>
    </div>
  );
}
