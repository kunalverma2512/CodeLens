"use client";

import { useState } from "react";

export default function PrivacyPage() {
  const [openSection, setOpenSection] = useState(null);

  const POLICY_VERSION = "1.0";
  const LAST_UPDATED = "June 2026";

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    {
      id: 1,
      title: "Information We Collect",
      content: [
        "Account details such as name, email, password (encrypted).",
        "Authentication data (login timestamps, session tokens).",
        "Usage data including features accessed, clicks, and activity logs.",
        "Device information like IP address, browser type, OS, and device identifiers.",
        "Optional profile data provided by users (preferences, settings).",
      ],
    },
    {
      id: 2,
      title: "How We Use Your Data",
      content: [
        "To provide core application functionality and maintain user accounts.",
        "To personalize your experience and improve platform performance.",
        "To monitor system usage, detect bugs, and prevent abuse.",
        "To send important service updates and security notifications.",
        "To improve features using aggregated analytics (non-identifiable).",
      ],
    },
    {
      id: 3,
      title: "Data Storage & Retention",
      content: [
        "Data is securely stored using encrypted databases and secure cloud infrastructure.",
        "We retain personal data only as long as necessary for service operation.",
        "Inactive accounts may be deleted after extended inactivity (e.g., 12–24 months).",
        "Backup copies may exist temporarily for disaster recovery purposes.",
        "Users may request full data deletion at any time.",
      ],
    },
    {
      id: 4,
      title: "Third-Party Services",
      content: [
        "We may use trusted third-party providers for hosting, analytics, and authentication.",
        "These providers only access data required for their specific function.",
        "We do not sell or trade user data to advertisers.",
        "Third-party services include security monitoring and performance tracking tools.",
        "Each provider is expected to comply with industry-standard data protection practices.",
      ],
    },
    {
      id: 5,
      title: "User Rights",
      content: [
        "Right to access your stored personal data.",
        "Right to correct inaccurate or outdated information.",
        "Right to request deletion of your data ('right to be forgotten').",
        "Right to withdraw consent for optional data usage.",
        "Right to request a copy of your data in a portable format.",
      ],
    },
    {
      id: 6,
      title: "Data Security",
      content: [
        "We use encryption (in transit and at rest) to protect sensitive data.",
        "Access to production systems is strictly controlled and logged.",
        "Regular security reviews and vulnerability checks are performed.",
        "We implement rate limiting and abuse detection mechanisms.",
        "Despite safeguards, no system is 100% secure over the internet.",
      ],
    },
    {
      id: 7,
      title: "Cookies & Tracking",
      content: [
        "We use cookies to maintain sessions and improve user experience.",
        "Analytics tools may collect anonymized usage patterns.",
        "Users may disable cookies via browser settings, but features may be affected.",
        "We do not use invasive cross-site tracking for advertising.",
      ],
    },
    {
      id: 8,
      title: "Children’s Privacy",
      content: [
        "Our services are not intended for users under the age of 13 (or applicable legal age).",
        "We do not knowingly collect personal data from minors.",
        "If such data is discovered, it will be deleted immediately.",
      ],
    },
    {
      id: 9,
      title: "Policy Updates",
      content: [
        "This Privacy Policy may be updated from time to time.",
        "Major changes will be communicated via the platform or email.",
        "Continued use of the service indicates acceptance of updates.",
        "The latest version will always be publicly accessible.",
      ],
    },
    {
      id: 10,
      title: "Contact Information",
      content: [
        "For privacy-related concerns, data requests, or complaints:",
        "Email: privacy@codelens.com",
        "We aim to respond within 5–10 business days.",
      ],
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-black">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black uppercase tracking-widest underline underline-offset-8 decoration-[3px]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Version {POLICY_VERSION} • Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-6 text-gray-700">
          This policy explains how we collect, use, and protect your data across
          CodeLens services.
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const isOpen = openSection === section.id;

          return (
            <div
              key={section.id}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Header Button */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <span className="font-semibold text-left">{section.title}</span>
                <span className="text-xl">{isOpen ? "−" : "+"}</span>
              </button>

              {/* Animated Content */}
              <div
                className={`px-5 transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen
                    ? "max-h-96 py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  {section.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        By using CodeLens, you agree to this Privacy Policy and its updates.
      </div>
    </section>
  );
}
