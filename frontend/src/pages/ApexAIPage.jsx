import { useState, useRef, useEffect } from "react";

import HeroSection from "../components/ai/HeroSection";
import BottomCTA from "../components/ai/BottomCTA";
import QuickCommands from "../components/ai/QuickCommands";
import SessionStats from "../components/ai/SessionStats";
import ChatWindow from "../components/ai/ChatWindow";
import ChatInput from "../components/ai/ChatInput";

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
              <QuickCommands
                quickPrompts={quickPrompts}
                handleQuickPrompt={handleQuickPrompt}
              />

              <SessionStats
                messages={messages}
                isLoading={isLoading}
              />
            </aside>

            <div className="flex flex-col">
              <ChatWindow
                messages={messages}
                isLoading={isLoading}
                messagesContainerRef={messagesContainerRef}
                messagesEndRef={messagesEndRef}
              />

              <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
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

