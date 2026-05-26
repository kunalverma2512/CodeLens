import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  messages,
  isLoading,
  inputValue,
  onInputChange,
  onSendMessage,
  messagesContainerRef,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Session header */}
      <div className="border-b-4 border-black px-5 py-3 bg-gray-50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2 h-2 rounded-full ${
              isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
            }`}
          />
          <span className="text-xs font-black uppercase tracking-[0.14em]">
            APEX Live Session
          </span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.14em] opacity-60">
          {isLoading ? "Analyzing..." : "Ready"}
        </span>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4 apex-scrollbar"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <LoadingIndicator />}
      </div>

      {/* Input area */}
      <ChatInput
        inputValue={inputValue}
        onChange={onInputChange}
        onSubmit={onSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
