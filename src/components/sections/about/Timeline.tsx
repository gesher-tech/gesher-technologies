import { cn } from '@/lib/utils';

const MILESTONES = [
  {
    when: 'February 2026',
    title: 'Founded in North Paravur',
    body: 'Gesher Technologies starts in North Paravur, Ernakulam, with a simple conviction: Tier-1 software can be built from small-town Kerala.',
  },
  {
    when: 'Spring 2026',
    title: 'Health-Care-Tracking Engine',
    body: 'Our first product brings automated patient recall to diagnostic labs, turning one-time test visits into ongoing care relationships.',
  },
  {
    when: 'Mid 2026',
    title: 'One-Touch-Service & Gesher Trade',
    body: 'We extend our verified-identity and messaging platform to local workers and P2P commerce across Paravur, Aluva and Kochi.',
  },
  {
    when: 'Today',
    title: 'Enterprise DevOps practice',
    body: 'The platform team behind our products partners with domestic and global enterprises on cloud, Kubernetes and CI/CD modernisation.',
  },
];

/** About Us — company story as a vertical timeline. */
export function Timeline() {
  return (
    <section aria-labelledby="timeline-title">
      <h2 id="timeline-title" className="text-xl font-semibold sm:text-2xl">
        Our story so far
      </h2>
      <ol className="relative mt-6 space-y-8 border-l border-white/10 pl-8">
        {MILESTONES.map((m, i) => (
          <li key={m.title} className="relative">
            <span
              className={cn(
                'absolute -left-[41px] top-0.5 grid size-5 place-items-center rounded-full ring-4 ring-ink-900',
                i === MILESTONES.length - 1 ? 'bg-clinical-500' : 'bg-health-500',
              )}
              aria-hidden="true"
            >
              <span className="size-1.5 rounded-full bg-white" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-health-400">{m.when}</p>
            <h3 className="mt-1 text-base font-semibold">{m.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{m.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
