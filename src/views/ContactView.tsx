import { ContactDetails } from '@/components/sections/contact/ContactDetails';
import { ContactForm } from '@/components/sections/contact/ContactForm';
import { PageHeader } from '@/components/ui/PageHeader';

export default function ContactView() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Book a demo or start a project"
        description="Tell us what you're working on. A Gesher engineer — not a sales script — will reply within one business day."
      />
      <div className="container-x grid grid-cols-1 gap-6 py-12 md:py-16 lg:grid-cols-[1.4fr_1fr] xxl:gap-10">
        <ContactForm />
        <ContactDetails />
      </div>
    </>
  );
}
