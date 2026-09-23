import { ArrowRight, HeartPulse, MapPinned, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useNavigation } from '@/context/NavigationContext';

const REASONS = [
  {
    icon: HeartPulse,
    title: 'Domain-first engineering',
    body: 'We build for clinics, workers and small businesses we know personally — so our software fits real workflows, not slide decks.',
  },
  {
    icon: ShieldCheck,
    title: 'Production-grade by default',
    body: 'CI/CD, observability, encryption and backups are part of every delivery, not an upsell after launch.',
  },
  {
    icon: MapPinned,
    title: 'Local team, global standards',
    body: 'An engineering team in North Paravur, working in your time zone and your language, to the standards of global enterprises.',
  },
];

/** Home — three reasons to work with Gesher, with a link to About Us. */
export function WhyGesher() {
  const { navigate } = useNavigation();

  return (
    <section className="section pt-0 xs:pt-0 md:pt-0 lg:pt-0 xxl:pt-0" aria-labelledby="why-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Why Gesher"
            title={<span id="why-title">Built in Kerala, built to last</span>}
            description="Founded in February 2026, we are a young company with a clear standard: clean code, reliable infrastructure and technology that creates local livelihoods."
          />
          <button type="button" onClick={() => navigate('about')} className="btn-ghost mt-8">
            More about us
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="grid grid-cols-1 gap-4">
          {REASONS.map((r) => (
            <li key={r.title} className="card flex gap-4 p-5 sm:p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-health-500/10 text-health-400 ring-1 ring-health-500/20">
                <r.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
