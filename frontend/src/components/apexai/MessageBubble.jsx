export default function MessageBubble({ message }) {
  const isUser = message.type === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] sm:max-w-[80%] ${
          isUser
            ? "border-2 border-black bg-black text-white"
            : "border-2 border-black bg-white text-black"
        } p-4 shadow-[3px_3px_0_0_rgba(0,0,0,1)]`}
      >
        <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">
          {isUser ? "You" : "APEX"}
        </div>
        <div className="text-sm font-medium leading-relaxed break-words">
          {message.content}
        </div>
        <div className="text-[10px] font-bold mt-2.5 opacity-40">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
