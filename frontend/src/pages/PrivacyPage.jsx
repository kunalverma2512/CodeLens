import PrivacyIntro from "../components/privacy/PrivacyIntro";
import PrivacyInfoCollect from "../components/privacy/PrivacyInfoCollect";
import PrivacyInfoUse from "../components/privacy/PrivacyInfoUse";
import PrivacyCookies from "../components/privacy/PrivacyCookies";
import PrivacyThirdParty from "../components/privacy/PrivacyThirdParty";
import PrivacySecurity from "../components/privacy/PrivacySecurity";
import PrivacyRetention from "../components/privacy/PrivacyRetention";
import PrivacyRights from "../components/privacy/PrivacyRights";
import PrivacyChildren from "../components/privacy/PrivacyChildren";
import PrivacyChanges from "../components/privacy/PrivacyChanges";
import PrivacyContact from "../components/privacy/PrivacyContact";

export default function PrivacyPage() {
  const POLICY_VERSION = "1.0";
  const LAST_UPDATED = "June 2026";

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] mb-4">
              Legal
            </p>

            <h1 className="text-5xl lg:text-7xl font-black uppercase leading-none">
              Privacy Policy
            </h1>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Version {POLICY_VERSION}</span>
              <span>•</span>
              <span>Last Updated: {LAST_UPDATED}</span>
              <span>•</span>
              <span>Effective Date: June 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Optional Desktop Section Indicator */}
      <div className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-3">
          {[...Array(11)].map((_, i) => (
            <a
              key={i}
              href={`#section-${String(i + 1).padStart(2, "0")}`}
              className="w-3 h-3 border-2 border-black rounded-full hover:bg-black transition"
            />
          ))}
        </div>
      </div>

      {/* Privacy Sections */}
      <PrivacyIntro />
      <PrivacyInfoCollect />
      <PrivacyInfoUse />
      <PrivacyCookies />
      <PrivacyThirdParty />
      <PrivacySecurity />
      <PrivacyRetention />
      <PrivacyRights />
      <PrivacyChildren />
      <PrivacyChanges />
      <PrivacyContact />

      {/* Footer Notice */}
      <section className="bg-[#ededed] border-t-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-sm text-center text-gray-600">
            By using CodeLens, you acknowledge that you have read and understood
            this Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
