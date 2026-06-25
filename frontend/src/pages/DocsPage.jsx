import DocsHero from "../components/docs/DocsHero";
import DocsSidebar from "../components/docs/DocsSidebar";
import DocsSection from "../components/docs/DocsSection";
import GettingStarted from "../components/docs/GettingStarted";
import DashboardGuide from "../components/docs/DashboardGuide";
import FeatureOverview from "../components/docs/FeatureOverview";
import FAQSection from "../components/docs/FAQSection";
import SupportSection from "../components/docs/SupportSection";
import { docsConfig } from "../docs/docs.config";

export default function DocsPage() {
  const sections = docsConfig.navigation.sections;

  // Helper to map section IDs to actual components
  const renderSectionContent = (id) => {
    switch (id) {
      case "getting-started":
        return <GettingStarted />;
      case "dashboard-guide":
        return <DashboardGuide />;
      case "features":
        return <FeatureOverview />;
      case "faq":
        return <FAQSection />;
      case "support":
        return <SupportSection />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col">
      {/* Page Hero Header */}
      <div id="hero">
        <DocsHero />
      </div>

      {/* Main Content Layout Wrapper */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Sticky Index Menu Column */}
        <DocsSidebar sections={sections} />

        {/* Content Details Column */}
        <div className="flex-1 min-w-0 border-4 border-black divide-y-4 divide-black shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          {sections
            .filter((sec) => sec.id !== "hero" && sec.visible)
            .map((sec) => (
              <DocsSection
                key={sec.id}
                id={sec.id}
                title={sec.title}
                label={`CODELENS / ${sec.title.toUpperCase()}`}
              >
                {renderSectionContent(sec.id)}
              </DocsSection>
            ))}
        </div>
      </div>
    </div>
  );
}
