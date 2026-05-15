import { useState, useRef, useEffect } from "react";
import BottomCTA from "../components/ai/BottomCTA";
import HeroSection from "../components/ai/HeroSection";

export default function ApexAIPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "I'm APEX — your Advanced Performance Excellence eXecutive. I synthesize your complete developer profile across GitHub, LeetCode, Codeforces, and development projects to architect personalized growth strategies. I don't just advise—I strategize your path to mastery.",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollChatToBottom = (behavior = "auto") => {
    if (!messagesContainerRef.current) return;

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    scrollChatToBottom(messages.length > 1 ? "smooth" : "auto");
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "assistant",
        content: `Analyzing your query: "${userMessage.content}". Based on your comprehensive metrics analysis, I've identified key optimization areas. Your competitive programming velocity shows strong pattern recognition but needs optimization in dynamic programming approaches. Your project architecture demonstrates solid fundamentals—let's elevate to advanced system design patterns.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const quickPrompts = [
    "Audit my complete profile",
    "Build custom roadmap",
    "Identify skill gaps",
    "Project improvement plan",
  ];

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <HeroSection />

      {/* Chat Interface Section */}
      <section className="flex-1 w-full px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
        <div className="max-w-[1800px] mx-auto h-full">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-3">
              Command Interface
            </h2>

            <p className="text-sm sm:text-base font-bold uppercase tracking-wide text-black">
              Direct connection to your comprehensive performance analytics
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
            <aside className="space-y-4">
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

              <div className="border-4 border-black bg-black text-white p-5">
                <h3 className="text-sm font-black uppercase tracking-[0.12em] mb-4">
                  Session Stats
                </h3>

                <div className="space-y-2.5 text-xs font-bold">
                  <div className="flex justify-between border-b-2 border-white pb-2">
                    <span className="uppercase tracking-wide">Queries</span>

                    <span className="font-black">
                      {messages.filter((m) => m.type === "user").length}
                    </span>
                  </div>

                  <div className="flex justify-between border-b-2 border-white pb-2">
                    <span className="uppercase tracking-wide">Insights</span>

                    <span className="font-black">
                      {messages.filter((m) => m.type === "assistant").length}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="uppercase tracking-wide">Status</span>

                    <span className="font-black text-white">
                      {isLoading ? "ANALYZING" : "READY"}
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            <div className="border-4 border-black bg-white shadow-[16px_16px_0_0_rgba(0,0,0,1)] flex flex-col h-[620px] lg:h-[72vh] lg:max-h-[860px] lg:min-h-[620px] min-h-0">
              <div className="border-b-4 border-black px-4 sm:px-5 py-3 bg-gray-50 flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.14em]">
                  APEX Live Session
                </span>

                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] opacity-70">
                  {isLoading ? "Analyzing" : "Ready"}
                </span>
              </div>

              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4 custom-scrollbar"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
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
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-black animate-pulse"></div>
                        <div className="w-3 h-3 bg-black animate-pulse delay-75"></div>
                        <div className="w-3 h-3 bg-black animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
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
            </div>
          </div>
        </div>
      </section>

      <BottomCTA />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: white;
          border-left: 4px solid black;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: black;
          border: 2px solid white;
        }

        .delay-75 {
          animation-delay: 0.15s;
        }

        .delay-150 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}

