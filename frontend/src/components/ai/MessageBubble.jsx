export default function MessageBubble({ message }) {
  return (
    <div
      className={`flex ${
        message.type === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[94%] sm:max-w-[88%] lg:max-w-[78%] ${
          message.type === "user"
            ? "border-2 border-black bg-black text-white"
            : "border-2 border-black bg-white text-black"
        } p-3.5 sm:p-4.5 lg:p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]`}
      >
        <div className="text-[10px] font-black uppercase tracking-[0.12em] mb-2 opacity-70">
          {message.type === "user" ? "You" : "APEX"}
        </div>

        <div className="text-xs sm:text-sm font-bold leading-relaxed break-words">
          {message.content}
        </div>

        <div className="text-[10px] font-bold mt-2.5 opacity-50">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
