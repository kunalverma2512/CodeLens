import HeroSection from "../components/GitHubIntegrationSections/HeroSection";
import WhyIntegrationSection from "../components/GitHubIntegrationSections/WhyIntegrationSection";
import BenefitsSection from "../components/GitHubIntegrationSections/BenefitsSection";
import WhatIsGitHubSection from "../components/GitHubIntegrationSections/WhatIsGitHubSection";
import OpenSourceSection from "../components/GitHubIntegrationSections/OpenSourceSection";
import WhyCodeLensSupportsGitHubSection from "../components/GitHubIntegrationSections/WhyCodeLensSupportsGitHubSection";
import IntegrationWorkflowSection from "../components/GitHubIntegrationSections/IntegrationWorkflowSection";
import PrivacySection from "../components/GitHubIntegrationSections/PrivacySection";
import GetStartedSection from "../components/GitHubIntegrationSections/GetStartedSection";

export default function GitHubIntegration() {
  return (
    <main>
      <HeroSection />
      <WhyIntegrationSection />
      <BenefitsSection />
      <WhatIsGitHubSection />
      <OpenSourceSection />
      <WhyCodeLensSupportsGitHubSection />
      <IntegrationWorkflowSection />
      <PrivacySection />
      <GetStartedSection />
    </main>
  );
}