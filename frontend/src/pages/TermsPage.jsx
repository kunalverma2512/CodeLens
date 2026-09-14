export default function TermsPage() {
  const lastUpdated = "June 8, 2026";
  const version = "v1.0";

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <div className="m-10 text-gray-800">
        {/* Title */}
        <h1 className="text-center text-black font-black text-3xl uppercase tracking-widest underline underline-offset-8 decoration-[3px]">
          Terms of Service
        </h1>

        {/* Meta */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Last Updated: {lastUpdated} • Version: {version}
        </p>

        {/* Intro */}
        <div className="mt-10 space-y-8">
          <p>
            By accessing or using this application, you agree to be bound by
            these Terms of Service. If you do not agree, you must stop using the
            service immediately.
          </p>

          {/* 1 */}
          <section>
            <h2 className="font-bold text-xl mb-2">1. Eligibility</h2>
            <p>
              You must be legally capable of entering into a binding agreement
              to use this service. If you are using the service on behalf of an
              organization, you confirm you have authority to do so.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-bold text-xl mb-2">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and all activities under your account. You
              must notify us immediately of any unauthorized access or breach.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-bold text-xl mb-2">3. User Responsibilities</h2>
            <p>
              You agree to provide accurate information and use the service
              responsibly. You are solely responsible for your actions while
              using the platform.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-bold text-xl mb-2">4. Acceptable Use Policy</h2>
            <p>You agree not to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Violate any laws or regulations</li>
              <li>Attempt unauthorized access to systems or accounts</li>
              <li>Distribute malware or harmful code</li>
              <li>Harass, abuse, or harm others</li>
              <li>Scrape or extract data without permission</li>
              <li>Interfere with platform security or performance</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-bold text-xl mb-2">
              5. Data Collection & Privacy
            </h2>
            <p>
              We may collect personal and non-personal data such as usage
              information, device details, and analytics to improve our
              services. We do not sell your personal data. For full details,
              please refer to our Privacy Policy.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-bold text-xl mb-2">6. Cookies & Tracking</h2>
            <p>
              We may use cookies and similar technologies to enhance user
              experience, analyze traffic, and improve functionality. You may
              disable cookies in your browser settings.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-bold text-xl mb-2">7. Intellectual Property</h2>
            <p>
              All content, branding, design, and software are owned by the
              platform or its licensors. You may not copy, modify, distribute,
              or exploit any part of the service without permission.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-bold text-xl mb-2">8. Service Availability</h2>
            <p>
              We do not guarantee uninterrupted or error-free service. We may
              modify, suspend, or discontinue any part of the service at any
              time without notice.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-bold text-xl mb-2">9. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access if you
              violate these terms or engage in harmful behavior.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-bold text-xl mb-2">10. Disclaimer</h2>
            <p>
              The service is provided “as is” without warranties of any kind,
              whether express or implied, including fitness for a particular
              purpose or non-infringement.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="font-bold text-xl mb-2">11. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the
              service after updates means you accept the revised Terms.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="font-bold text-xl mb-2">12. Accessibility</h2>
            <p>
              These Terms are accessible from the footer, settings, or help
              section of the application at all times.
            </p>
          </section>

          {/* Footer */}
          <p className="text-sm text-gray-500 pt-6 border-t border-gray-200">
            If you have questions about these Terms, please contact support.
          </p>
        </div>
      </div>
    </section>
  );
}
