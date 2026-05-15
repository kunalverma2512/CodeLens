export default function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black animate-pulse"></div>
          <div className="w-3 h-3 bg-black animate-pulse delay-75"></div>
          <div className="w-3 h-3 bg-black animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}

