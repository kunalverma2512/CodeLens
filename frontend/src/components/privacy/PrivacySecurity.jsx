import PrivacySection from "./PrivacySection";

export default function PrivacySecurity() {
  return (
    <PrivacySection number="06" title="Data Security" bg="bg-[#f2f2f2]" reverse>
      <p>
        The security of your data is important to us, but remember that no
        method of transmission over the Internet or method of electronic storage
        is 100% secure.
      </p>

      <p>
        While we strive to use commercially acceptable means to protect your
        Personal Data (including bcrypt password hashing, hashed OTPs, and HTTPS
        encryption in transit), we cannot guarantee its absolute security. You
        use the Service at your own risk.
      </p>
    </PrivacySection>
  );
}
