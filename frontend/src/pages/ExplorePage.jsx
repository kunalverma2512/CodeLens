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
    </div>
  );
}
