import HeroSection from "../components/CodeforcesIntegrationSections/HeroSection";
import WhyIntegrationSection from "../components/CodeforcesIntegrationSections/WhyIntegrationSection";
import BenefitsSection from "../components/CodeforcesIntegrationSections/BenefitsSection";
import WhatIsCodeforcesSection from "../components/CodeforcesIntegrationSections/WhatIsCodeforcesSection";
import CompetitiveProgrammingSection from "../components/CodeforcesIntegrationSections/CompetitiveProgrammingSection";
import HowCPHelpsSection from "../components/CodeforcesIntegrationSections/HowCPHelpsSection";
import WhyCodeLensSupportsCodeforcesSection from "../components/CodeforcesIntegrationSections/WhyCodeLensSupportsCodeforcesSection";
import DataUsageSection from "../components/CodeforcesIntegrationSections/DataUsageSection";
import PrivacySection from "../components/CodeforcesIntegrationSections/PrivacySection";
import GetStartedSection from "../components/CodeforcesIntegrationSections/GetStartedSection";

export default function CodeforcesIntegration() {
  return (
    <main>
      <HeroSection />
      <WhyIntegrationSection />
      <BenefitsSection />
      <WhatIsCodeforcesSection />
      <CompetitiveProgrammingSection />
      <HowCPHelpsSection />
      <WhyCodeLensSupportsCodeforcesSection />
      <DataUsageSection />
      <PrivacySection />
      <GetStartedSection />
    </main>
  );
}