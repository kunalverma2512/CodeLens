import ContactHero from "../components/contact/ContactHero";
import ContactChannelCards from "../components/contact/ContactChannelCards";
import ContactForm from "../components/contact/ContactForm";
import ContactSidebar from "../components/contact/ContactSidebar";
import ContactFAQ from "../components/contact/ContactFAQ";

export default function Contact() {
  return (
    <main>
      <title>Contact — CodeLens</title>
      <meta
        name="description"
        content="Get in touch with the CodeLens team. Send feedback, report bugs, request features, or explore partnership opportunities."
      />

      <ContactHero />

      <ContactChannelCards />

      <section className="w-full px-6 sm:px-10 lg:px-16 pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16">
            <div className="min-w-0">
              <ContactForm />
            </div>
            <div className="min-w-0">
              <ContactSidebar />
            </div>
          </div>
        </div>
      </section>

      <hr className="mx-auto max-w-7xl border-neutral-100" />

      <ContactFAQ />
    </main>
  );
}
