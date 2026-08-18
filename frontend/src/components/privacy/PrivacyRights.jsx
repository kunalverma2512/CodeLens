import PrivacySection from "./PrivacySection";

export default function PrivacyRights() {
  return (
    <PrivacySection
      number="08"
      title="Your Data Protection Rights"
      bg="bg-[#f0f0f0]"
      reverse
    >
      <p>
        Depending on your region, you may have certain data protection rights.
        We aim to take reasonable steps to allow you to correct, amend, delete,
        or limit the use of your Personal Data.
      </p>

      <ul className="list-disc ml-6 space-y-4">
        <li>
          Access and Update: You can review and update your profile information
          directly within the Account Center.
        </li>

        <li>
          Revoke Access: You can disconnect your GitHub or Codeforces
          integrations at any time from your dashboard, which will stop future
          data syncing.
        </li>

        <li>
          Account Deletion: If you wish to be completely removed from our
          systems, please contact us. Upon request, we will permanently delete
          your account, including all synced metrics and chat history. All
          requested account and data deletions will be completed within 30 days
          of the request.
        </li>
      </ul>
    </PrivacySection>
  );
}
