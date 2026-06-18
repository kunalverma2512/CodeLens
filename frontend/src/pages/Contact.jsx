import ContactHero from "../components/contact/ContactHero";
import ContactForm from "../components/contact/ContactForm";
import ContactChannelCards from "../components/contact/ContactChannelCards";
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

      <section className="w-full px-6 sm:px-10 lg:px-16 pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl w-full">
          <ContactForm />
        </div>
      </section>

      <ContactChannelCards />

      <section className="w-full px-6 sm:px-10 lg:px-16 pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl w-full">
          <ContactSidebar />
        </div>
      </section>

      <ContactFAQ />
    </main>
  );
}
