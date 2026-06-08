import PrivacySection from "./PrivacySection";

export default function PrivacyInfoCollect() {
  return (
    <PrivacySection
      number="02"
      title="Information We Collect"
      bg="bg-[#fafafa]"
      reverse
    >
      <p>
        We collect several different types of information for various purposes
        to provide and improve our Service to you.
      </p>

      <div>
        <h3 className="font-black uppercase mb-3">2.1 Personal Data</h3>

        <ul className="list-disc ml-6 space-y-2">
          <li>Account Credentials: Email address and encrypted passwords.</li>

          <li>
            Profile Information: Your chosen display name, avatar, and optional
            biographical information.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-black uppercase mb-3">
          2.2 Third-Party Integrations Data
        </h3>

        <ul className="list-disc ml-6 space-y-2">
          <li>
            Codeforces Data: Your public competitive programming history,
            including submission verdicts, algorithmic tags, contest history,
            and rating changes.
          </li>

          <li>
            GitHub Data: When you authenticate via GitHub OAuth, we receive your
            GitHub User ID, public profile information, and a read-only token.
            We use this to fetch your public repositories, commit history,
            contribution graph, and language usage. We do not request, access,
            or store data from your private repositories.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-black uppercase mb-3">
          2.3 User-Generated Content
        </h3>

        <ul className="list-disc ml-6 space-y-2">
          <li>
            APEX AI Interactions: We collect and store the chat messages,
            prompts, and context data you send to our APEX AI coach, as well as
            the AI-generated responses, to maintain your conversation history.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-black uppercase mb-3">2.4 Usage and Log Data</h3>

        <ul className="list-disc ml-6 space-y-2">
          <li>
            When you access the Service, our hosting providers (Vercel and
            Render) may automatically collect standard log data. This Usage Data
            may include information such as your device's Internet Protocol (IP)
            address, browser type, browser version, the pages of our Service
            that you visit, the time and date of your visit, and other
            diagnostic data.
          </li>
        </ul>
      </div>
    </PrivacySection>
  );
}
