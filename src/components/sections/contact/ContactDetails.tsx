import type { ReactNode } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { COMPANY } from '@/data/company';

/** Contact Us — direct business contact card and office location. */
export function ContactDetails() {
  return (
    <aside className="space-y-4" aria-label="Contact details">
      <div className="card p-5 sm:p-6">
        <h2 className="text-base font-semibold">Gesher Technologies</h2>
        <ul className="mt-5 space-y-1">
          <ContactRow icon={MapPin} label="Head office">
            {COMPANY.address.line1}, {COMPANY.address.line2}, {COMPANY.address.state} {COMPANY.address.pin}
          </ContactRow>
          <ContactRow icon={Mail} label="Business enquiries" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </ContactRow>
          <ContactRow icon={Mail} label="Customer support" href={`mailto:${COMPANY.supportEmail}`}>
            {COMPANY.supportEmail}
          </ContactRow>
          <ContactRow icon={Phone} label="Phone" href={COMPANY.phoneHref}>
            {COMPANY.phone}
          </ContactRow>
          <ContactRow icon={Clock} label="Office hours">
            {COMPANY.hours}
          </ContactRow>
        </ul>
        <a href={COMPANY.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-emerald mt-5 w-full">
          <MessageCircle className="size-4" aria-hidden="true" />
          Chat on WhatsApp
        </a>
      </div>

      <div className="card overflow-hidden">
        <div className="grid-bg relative grid h-40 place-items-center bg-ink-900">
          <span className="relative grid size-12 place-items-center">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-health-500/40" />
            <span className="relative grid size-10 place-items-center rounded-full bg-health-500 text-white shadow-glow">
              <MapPin className="size-5" aria-hidden="true" />
            </span>
          </span>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=North+Paravur+Ernakulam+Kerala"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-touch items-center justify-between px-5 py-3 text-sm text-slate-300 hover:text-white"
        >
          North Paravur, Ernakulam
          <span className="text-xs text-health-400">Open in Maps →</span>
        </a>
      </div>
    </aside>
  );
}

function ContactRow({ icon: Icon, label, href, children }: { icon: typeof Mail; label: string; href?: string; children: ReactNode }) {
  const content = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/5 text-health-400">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] uppercase tracking-wider text-slate-500">{label}</span>
        <span className="block break-words text-sm text-slate-200">{children}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a href={href} className="tap flex min-h-touch items-center gap-3 rounded-xl py-1.5 hover:bg-white/[0.03]">
          {content}
        </a>
      ) : (
        <div className="flex min-h-touch items-center gap-3 py-1.5">{content}</div>
      )}
    </li>
  );
}
