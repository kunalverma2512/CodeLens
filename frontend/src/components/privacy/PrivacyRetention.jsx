import PrivacySection from "./PrivacySection";

export default function PrivacyRetention() {
  return (
    <PrivacySection number="07" title="Data Retention" bg="bg-[#f1f1f1]">
      <p>
        We will retain your Personal Data only for as long as is necessary for
        the purposes set out in this Privacy Policy.
      </p>

      <ul className="list-disc ml-6 space-y-4">
        <li>
          Active Accounts: Your profile data, synced statistics, and chat logs
          are retained as long as your account remains active.
        </li>

        <li>
          OTPs: Security codes are automatically purged from our database after
          10 minutes.
        </li>

        <li>
          Server Logs: Standard access and error logs collected by our hosting
          infrastructure (Vercel/Render) are strictly retained for a short
          period (typically 30 days) solely for debugging, monitoring, and
          security purposes before being automatically deleted.
        </li>
      </ul>
    </PrivacySection>
  );
}
