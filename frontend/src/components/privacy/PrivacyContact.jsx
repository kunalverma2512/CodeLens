import PrivacySection from "./PrivacySection";

export default function PrivacyContact() {
  return (
    <PrivacySection number="11" title="Contact Us" bg="bg-[#ededed]">
      <p>
        If you have any questions, concerns, or requests regarding this Privacy
        Policy, please contact the repository maintainer via GitHub issues or
        email:
      </p>

      <div className="inline-block border-[3px] border-black px-5 py-3 font-black">
        codelens@gmail.com
      </div>
    </PrivacySection>
  );
}
