import PrivacySection from "./PrivacySection";

export default function PrivacyCookies() {
  return (
    <PrivacySection
      number="04"
      title="Cookies and Session Management"
      bg="bg-[#f5f5f5]"
      reverse
    >
      <ul className="list-disc ml-6 space-y-4">
        <li>
          We use strict, privacy-first cookie practices. We do not use tracking,
          advertising, or third-party marketing cookies.
        </li>

        <li>
          Authentication Cookies: We use HttpOnly, Secure, and SameSite
          configured cookies exclusively for maintaining your login session.
          Because these are HttpOnly, they cannot be accessed by malicious
          client-side scripts, protecting you from Cross-Site Scripting (XSS)
          attacks.
        </li>

        <li>
          Necessity: Because these cookies are strictly necessary for the
          authentication and security of the Service, they cannot be declined if
          you wish to use a registered account.
        </li>
      </ul>
    </PrivacySection>
  );
}
