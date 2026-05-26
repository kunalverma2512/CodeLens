import { useState, useRef, useEffect } from "react";
import HeroSection from "../components/apexai/HeroSection";
import FeatureGrid from "../components/apexai/FeatureGrid";
import ChatWindow from "../components/apexai/ChatWindow";
import BottomCTA from "../components/apexai/BottomCTA";

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

  // TODO: replace the setTimeout mock with an actual async API call once the backend is ready
  const handleSendMessage = (e) => {
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

  return (
    <div className="w-full flex-1 flex flex-col bg-white">
      {/* Above-fold: Hero sidebar + Chat split — fills remaining viewport height */}
      <section className="flex-1 flex flex-col lg:flex-row border-b-4 border-black min-h-[600px]">
        {/* Left: Compact hero sidebar */}
        <div className="lg:w-[360px] xl:w-[400px] flex-shrink-0 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col p-6 sm:p-8">
          <HeroSection />
        </div>

        {/* Right: Chat interface — fills remaining width and height */}
        <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-0">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            messagesContainerRef={messagesContainerRef}
          />
        </div>
      </section>

      {/* Below fold: Capabilities */}
      <FeatureGrid />

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}
