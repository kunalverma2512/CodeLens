import { useState, useEffect } from "react";
import ExploreHero from "../components/explore/ExploreHero";
import AIExplanation from "../components/explore/AIExplanation";
import FeatureGrid from "../components/explore/FeatureGrid";
import PlatformSync from "../components/explore/PlatformSync";
import ArchitectureDeepDive from "../components/explore/ArchitectureDeepDive";
import RoadmapVisualizer from "../components/explore/RoadmapVisualizer";
import DailyChallenge from "../components/explore/DailyChallenge";
import Leaderboard from "../components/explore/Leaderboard";
import Testimonials from "../components/explore/Testimonials";
import DataPrivacy from "../components/explore/DataPrivacy";
import OpenSourceVision from "../components/explore/OpenSourceVision";
import FAQSection from "../components/explore/FAQSection";
import SubscribeNewsletter from "../components/explore/SubscribeNewsletter";
import FinalCTA from "../components/explore/FinalCTA";
export default function ExplorePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };
  return (
    <div className="w-full bg-white flex flex-col">
      <ExploreHero />
      <AIExplanation />
      <FeatureGrid />
      <PlatformSync />
      <ArchitectureDeepDive />
      <RoadmapVisualizer />
      <DailyChallenge />
      <Leaderboard />
      <Testimonials />
      <DataPrivacy />
      <OpenSourceVision />
      <FAQSection />
      <SubscribeNewsletter />
      <FinalCTA />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-8 w-12 h-12 bg-black text-white flex items-center justify-center cursor-pointer z-50 border-2 border-black hover:bg-white hover:text-black transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          style={{ bottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
