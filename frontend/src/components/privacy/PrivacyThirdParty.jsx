import PrivacySection from "./PrivacySection";

export default function PrivacyThirdParty() {
  return (
    <PrivacySection
      number="05"
      title="Disclosure of Data to Third Parties"
      bg="bg-[#f3f3f3]"
    >
      <p>
        We do not sell, rent, or trade your personal information to third
        parties.
      </p>

      <p>
        However, to operate the Service, we share necessary data with trusted
        service providers under strict data processing agreements:
      </p>

      <ul className="list-disc ml-6 space-y-4">
        <li>
          Google Gemini API: To provide AI coaching, your chat inputs and a
          compiled summary of your coding metrics are processed by Google's
          Gemini models.
        </li>

        <li>
          MongoDB Atlas: Your user data, integration data, and chat history are
          securely hosted on MongoDB's cloud database infrastructure.
        </li>

        <li>
          Render &amp; Vercel: Our backend application and frontend interfaces
          are hosted on these platforms, which process web traffic routing.
        </li>

        <li>
          Nodemailer &amp; Gmail SMTP: Used exclusively for routing
          transactional authentication emails to your inbox.
        </li>
      </ul>
    </PrivacySection>
  );
}
