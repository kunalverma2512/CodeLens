import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";

export default function ChatWindow({
  messages,
  isLoading,
  messagesContainerRef,
  messagesEndRef,
}) {
  return (
    <div className="border-4 border-black bg-white shadow-[16px_16px_0_0_rgba(0,0,0,1)] flex flex-col h-[620px] lg:h-[72vh] lg:max-h-[860px] lg:min-h-[620px] min-h-0">
      <div className="border-b-4 border-black px-4 sm:px-5 py-3 bg-gray-50 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.14em]">
          APEX Live Session
        </span>

        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] opacity-70">
          {isLoading ? "Analyzing" : "Ready"}
        </span>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4 custom-scrollbar"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

