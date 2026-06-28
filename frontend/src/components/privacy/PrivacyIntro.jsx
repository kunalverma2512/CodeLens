import PrivacySection from "./PrivacySection";

export default function PrivacyIntro() {
  return (
    <PrivacySection number="01" title="Introduction" bg="bg-white">
      <p>
        Welcome to CodeLens ("we", "our", or "us"). CodeLens is an independent,
        open-source project maintained by an individual developer. We are
        committed to protecting your personal information and your right to
        privacy. This Privacy Policy governs the privacy policies and practices
        of our official website, application, and all associated services
        (collectively, the "Service").
      </p>

      <p>
        By accessing or using CodeLens, you agree to the collection and use of
        information in accordance with this Privacy Policy. If you do not agree
        with the terms of this Privacy Policy, please do not access the Service.
      </p>

      <p>
        Self-Hosting Disclaimer: Please note that this Privacy Policy applies
        exclusively to the official, primary hosted instance of CodeLens (e.g.,
        codelensx.vercel.app). If you choose to fork, deploy, or self-host your
        own instance of the CodeLens open-source repository, you act as the data
        controller for your instance and are solely responsible for managing
        user data, maintaining your own privacy policy, and ensuring legal
        compliance.
      </p>
    </PrivacySection>
  );
}
