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
      title: "Introduction",
      content: [
        'Welcome to CodeLens ("we", "our", or "us"). CodeLens is an independent, open-source project maintained by an individual developer. We are committed to protecting your personal information and your right to privacy. This Privacy Policy governs the privacy policies and practices of our official website, application, and all associated services (collectively, the "Service").',
        "By accessing or using CodeLens, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Service.",
        "Self-Hosting Disclaimer: Please note that this Privacy Policy applies exclusively to the official, primary hosted instance of CodeLens (e.g., codelensx.vercel.app). If you choose to fork, deploy, or self-host your own instance of the CodeLens open-source repository, you act as the data controller for your instance and are solely responsible for managing user data, maintaining your own privacy policy, and ensuring legal compliance.",
      ],
    },
    {
      id: 2,
      title: "Information We Collect",
      intro:
        "We collect several different types of information for various purposes to provide and improve our Service to you.",
      subsections: [
        {
          title: "2.1 Personal Data",
          items: [
            "Account Credentials: Email address and encrypted passwords.",
            "Profile Information: Your chosen display name, avatar, and optional biographical information.",
          ],
        },
        {
          title: "2.2 Third-Party Integrations Data",
          items: [
            "Codeforces Data: Your public competitive programming history, including submission verdicts, algorithmic tags, contest history, and rating changes.",
            "GitHub Data: When you authenticate via GitHub OAuth, we receive your GitHub User ID, public profile information, and a read-only token. We use this to fetch your public repositories, commit history, contribution graph, and language usage. We do not request, access, or store data from your private repositories.",
          ],
        },
        {
          title: "2.3 User-Generated Content",
          items: [
            "APEX AI Interactions: We collect and store the chat messages, prompts, and context data you send to our APEX AI coach, as well as the AI-generated responses, to maintain your conversation history.",
          ],
        },
        {
          title: "2.4 Usage and Log Data",
          items: [
            "When you access the Service, our hosting providers (Vercel and Render) may automatically collect standard log data. This Usage Data may include information such as your device's Internet Protocol (IP) address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and other diagnostic data.",
          ],
        },
      ],
    },
    {
      id: 3,
      title: "How We Use Your Information",
      content: [
        "To Provide and Maintain the Service: Ensuring your dashboard loads correctly with your latest statistics.",
        "To Manage Your Account: Verifying your identity and securing your login session.",
        "To Personalize the Experience: Compiling your Codeforces and GitHub data to calculate proprietary metrics like Skill Decay and Consistency Scores.",
        "To Power APEX AI: Supplying your real-time performance metrics to the Google Gemini AI model so it can act as a highly contextualized coding coach.",
        "To Communicate With You: Sending transactional emails, such as One-Time Passwords (OTPs) for registration and password resets. We do not use your email for marketing spam.",
      ],
    },
    {
      id: 4,
      title: "Cookies and Session Management",
      content: [
        "We use strict, privacy-first cookie practices. We do not use tracking, advertising, or third-party marketing cookies.",
        "Authentication Cookies: We use HttpOnly, Secure, and SameSite configured cookies exclusively for maintaining your login session. Because these are HttpOnly, they cannot be accessed by malicious client-side scripts, protecting you from Cross-Site Scripting (XSS) attacks.",
        "Necessity: Because these cookies are strictly necessary for the authentication and security of the Service, they cannot be declined if you wish to use a registered account.",
      ],
    },
    {
      id: 5,
      title: "Disclosure of Data to Third Parties",
      content: [
        "We do not sell, rent, or trade your personal information to third parties.",
        "However, to operate the Service, we share necessary data with trusted service providers under strict data processing agreements:",
        "Google Gemini API: To provide AI coaching, your chat inputs and a compiled summary of your coding metrics are processed by Google's Gemini models.",
        "MongoDB Atlas: Your user data, integration data, and chat history are securely hosted on MongoDB's cloud database infrastructure.",
        "Render & Vercel: Our backend application and frontend interfaces are hosted on these platforms, which process web traffic routing.",
        "Nodemailer & Gmail SMTP: Used exclusively for routing transactional authentication emails to your inbox.",
      ],
    },
    {
      id: 6,
      title: "Data Security",
      content: [
        "The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure.",
        "While we strive to use commercially acceptable means to protect your Personal Data (including bcrypt password hashing, hashed OTPs, and HTTPS encryption in transit), we cannot guarantee its absolute security. You use the Service at your own risk.",
      ],
    },
    {
      id: 7,
      title: "Data Retention",
      content: [
        "We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy.",
        "Active Accounts: Your profile data, synced statistics, and chat logs are retained as long as your account remains active.",
        "OTPs: Security codes are automatically purged from our database after 10 minutes.",
        "Server Logs: Standard access and error logs collected by our hosting infrastructure (Vercel/Render) are strictly retained for a short period (typically 30 days) solely for debugging, monitoring, and security purposes before being automatically deleted.",
      ],
    },
    {
      id: 8,
      title: "Your Data Protection Rights",
      content: [
        "Depending on your region, you may have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.",
        "Access and Update: You can review and update your profile information directly within the Account Center.",
        "Revoke Access: You can disconnect your GitHub or Codeforces integrations at any time from your dashboard, which will stop future data syncing.",
        "Account Deletion: If you wish to be completely removed from our systems, please contact us. Upon request, we will permanently delete your account, including all synced metrics and chat history. All requested account and data deletions will be completed within 30 days of the request.",
      ],
    },
    {
      id: 9,
      title: "Children's Privacy",
      content: [
        "Our Service does not address anyone under the age of 13.",
        "We do not knowingly collect personally identifiable information from anyone under the age of 13.",
        "If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us so we can take steps to remove that information from our servers.",
      ],
    },
    {
      id: 10,
      title: "Changes to This Privacy Policy",
      content: [
        "We may update our Privacy Policy from time to time.",
        'We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.',
        "You are advised to review this Privacy Policy periodically for any changes.",
      ],
    },
    {
      id: 11,
      title: "Contact Us",
      content: [
        "If you have any questions, concerns, or requests regarding this Privacy Policy, please contact the repository maintainer via GitHub issues or email:",
        "[Insert Your Email Address Here]",
      ],
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-black">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black uppercase tracking-widest underline underline-offset-8 decoration-[3px]">
          Privacy Policy
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Version {POLICY_VERSION} • Last updated: {LAST_UPDATED}
        </p>

        <p className="mt-6 text-gray-700">Effective Date: June 2026</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const isOpen = openSection === section.id;

          return (
            <div
              key={section.id}
              className="border-[3px] border-black overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition font-black uppercase tracking-widest text-sm"
              >
                <span className="text-left">
                  {section.id}. {section.title}
                </span>

                <span className="text-xl">{isOpen ? "−" : "+"}</span>
              </button>

              <div
                className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "max-h-screen py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                {section.subsections ? (
                  <div className="space-y-5">
                    <p className="text-gray-700">{section.intro}</p>

                    {section.subsections.map((sub, idx) => (
                      <div key={idx}>
                        <h3 className="font-black uppercase tracking-wide mb-2">
                          {sub.title}
                        </h3>

                        <ul className="list-disc ml-5 space-y-1 text-gray-700">
                          {sub.items.map((item, itemIdx) => (
                            <li key={itemIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc ml-5 text-gray-700 space-y-2">
                    {section.content.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        By using CodeLens, you acknowledge that you have read and understood
        this Privacy Policy.
      </div>
    </section>
  );
}
