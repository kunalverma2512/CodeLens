import PrivacySection from "./PrivacySection";

export default function PrivacyInfoUse() {
  return (
    <PrivacySection
      number="03"
      title="How We Use Your Information"
      bg="bg-[#f7f7f7]"
    >
      <ul className="list-disc ml-6 space-y-4">
        <li>
          To Provide and Maintain the Service: Ensuring your dashboard loads
          correctly with your latest statistics.
        </li>

        <li>
          To Manage Your Account: Verifying your identity and securing your
          login session.
        </li>

        <li>
          To Personalize the Experience: Compiling your Codeforces and GitHub
          data to calculate proprietary metrics like Skill Decay and Consistency
          Scores.
        </li>

        <li>
          To Power APEX AI: Supplying your real-time performance metrics to the
          Google Gemini AI model so it can act as a highly contextualized coding
          coach.
        </li>

        <li>
          To Communicate With You: Sending transactional emails, such as
          One-Time Passwords (OTPs) for registration and password resets. We do
          not use your email for marketing spam.
        </li>
      </ul>
    </PrivacySection>
  );
}
