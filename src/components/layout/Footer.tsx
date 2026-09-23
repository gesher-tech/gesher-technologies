import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { COMPANY, SOCIAL_LINKS } from '@/data/company';
import { useNavigation } from '@/context/NavigationContext';
import type { ViewId } from '@/types';

const LEGAL_LINKS: { label: string; view: ViewId }[] = [
  { label: 'Terms of Service', view: 'terms' },
  { label: 'Privacy Policy', view: 'privacy' },
  { label: 'Contact Us', view: 'contact' },
];

/** Footer — short description, contact, social links, version and legal links (no menu columns). */
export function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-900 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="container-x py-10 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <button type="button" onClick={() => navigate('home')} className="tap -ml-1 rounded-full p-1" aria-label="Gesher Technologies — Home">
              <Logo />
            </button>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">{COMPANY.description}</p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between lg:gap-12">
            <address className="space-y-1 text-sm not-italic text-slate-300">
              <p className="flex min-h-touch items-center gap-3 md:min-h-0 md:py-1">
                <MapPin className="size-4 shrink-0 text-health-400" aria-hidden="true" />
                {COMPANY.address.line1}, {COMPANY.address.line2}, {COMPANY.address.state}
              </p>
              <a href={`mailto:${COMPANY.email}`} className="flex min-h-touch items-center gap-3 hover:text-white md:min-h-0 md:py-1">
                <Mail className="size-4 shrink-0 text-health-400" aria-hidden="true" />
                {COMPANY.email}
              </a>
              <a href={COMPANY.phoneHref} className="flex min-h-touch items-center gap-3 hover:text-white md:min-h-0 md:py-1">
                <Phone className="size-4 shrink-0 text-health-400" aria-hidden="true" />
                {COMPANY.phone}
              </a>
            </address>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Follow us</p>
              <ul className="mt-3 flex gap-2">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${COMPANY.name} on ${label}`}
                      title={label}
                      className="tap grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:border-health-500/40 hover:text-white"
                    >
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© 2026 {COMPANY.name}. All rights reserved.</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] text-slate-400" title="Website version">
              v{COMPANY.version}
            </span>
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
              {LEGAL_LINKS.map((l, i) => (
                <li key={l.view} className="flex items-center">
                  {i > 0 && (
                    <span className="px-1 text-slate-700" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate(l.view)}
                    className="min-h-touch rounded px-1 text-slate-400 underline-offset-4 hover:text-white hover:underline md:min-h-0 md:py-1"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
