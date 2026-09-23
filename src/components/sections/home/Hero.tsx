import { useEffect, useState } from 'react';
import { Activity, ArrowRight, BellRing, CheckCircle2, CloudCog, GitMerge, MapPin, Sparkles, Users } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

const METRICS = [
  { icon: CloudCog, value: '99.98%', label: 'Pipeline uptime', tone: 'text-health-400' },
  { icon: BellRing, value: '24/7', label: 'Automated patient re-engagement', tone: 'text-clinical-400' },
  { icon: Users, value: '100%', label: 'Local Kerala tech talent', tone: 'text-amber-400' },
  { icon: GitMerge, value: '< 5 min', label: 'Merge-to-production', tone: 'text-indigo-400' },
];

const LIVE_EVENTS = [
  { icon: BellRing, text: 'HbA1c recall sent via WhatsApp', meta: 'North Paravur Diagnostics', tone: 'bg-clinical-500/15 text-clinical-400' },
  { icon: GitMerge, text: 'Deploy #1482 promoted to production', meta: 'ap-south-1 · Argo CD', tone: 'bg-health-500/15 text-health-400' },
  { icon: CheckCircle2, text: 'Lipid Profile booked from reminder', meta: 'Ernakulam Central Labs', tone: 'bg-clinical-500/15 text-clinical-400' },
  { icon: Users, text: 'Verified electrician accepted a job', meta: 'One-Touch-Service · Aluva', tone: 'bg-amber-500/15 text-amber-400' },
];

/** Home — split hero with value proposition, CTAs, live activity card and metric strip. */
export function Hero() {
  const { navigate, startInquiry } = useNavigation();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2800);
    return () => window.clearInterval(id);
  }, []);

  const feed = [0, 1, 2].map((i) => LIVE_EVENTS[(tick + i) % LIVE_EVENTS.length]!);

  return (
    <section className="relative isolate overflow-hidden pt-28 md:pt-36" aria-label="Introduction">
      <div className="grid-bg absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden="true" />
      <div className="absolute -top-40 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-health-500/20 blur-[120px]" aria-hidden="true" />
      <div className="absolute right-0 top-40 -z-10 size-[28rem] rounded-full bg-clinical-500/10 blur-[120px]" aria-hidden="true" />

      <div className="container-x grid grid-cols-1 items-center gap-12 pb-14 xs:pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-24 xxl:gap-20">
        <div className="animate-fade-up">
          <button
            type="button"
            onClick={() => navigate('about')}
            className="tap group inline-flex min-h-touch items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/5 py-1.5 pl-4 pr-4 text-xs sm:pl-1.5 font-medium text-slate-300 hover:border-health-500/40 hover:bg-white/10"
          >
            <span className="hidden items-center gap-1 rounded-full bg-health-500/15 px-2.5 py-1 text-health-400 sm:inline-flex">
              <Sparkles className="size-3.5" aria-hidden="true" />
              New
            </span>
            <span className="xs:hidden">Est. Feb 2026 •</span>
            <span className="hidden xs:inline">Founded Feb 2026 •</span>
            <MapPin className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="xs:hidden">North Paravur</span>
            <span className="hidden xs:inline">North Paravur, Kerala</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>

          <h1 className="mt-7 text-[2rem] font-extrabold leading-[1.08] tracking-tight xs:text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl xxl:text-7xl">
            Where <span className="text-gradient">HealthTech innovation</span> meets enterprise-grade cloud DevOps.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg xxl:max-w-2xl xxl:text-xl">
            Gesher Technologies bridges critical business workflows with modern automation — from a patient recall engine that brings diagnostic
            customers back on time, to Kubernetes platforms that ship software safely every day.
          </p>

          <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <button type="button" onClick={() => navigate('services', { service: 'health-track' })} className="btn-primary h-12 px-6 text-[15px]">
              <Activity className="size-[18px]" aria-hidden="true" />
              Explore Health-Track CRM
            </button>
            <button type="button" onClick={() => startInquiry('devops')} className="btn-ghost h-12 px-6 text-[15px]">
              Consult DevOps Team
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:150ms]">
          <div className="glass relative rounded-native-lg p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-clinical-400" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-clinical-400" />
                </span>
                Gesher Live Operations
              </div>
              <span className="font-mono text-[11px] text-slate-500">ap-south-1</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.06] bg-ink-900/60 p-4">
                <p className="text-xs text-slate-400">Recalls this week</p>
                <p className="mt-1 text-2xl font-bold text-white">1,284</p>
                <p className="mt-1 text-xs font-medium text-clinical-400">+18.6% returning</p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-ink-900/60 p-4">
                <p className="text-xs text-slate-400">Deploys today</p>
                <p className="mt-1 text-2xl font-bold text-white">37</p>
                <p className="mt-1 text-xs font-medium text-health-400">0 rollbacks</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5">
              {feed.map((event, i) => (
                <li
                  key={`${tick}-${i}`}
                  className="flex animate-fade-up items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${event.tone}`}>
                    <event.icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{event.text}</p>
                    <p className="truncate text-xs text-slate-500">{event.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-y border-white/[0.06] bg-ink-800/40">
        <dl className="container-x grid grid-cols-2 gap-x-3 divide-white/[0.06] md:grid-cols-4 md:gap-x-0 md:divide-x">
          {METRICS.map(({ icon: Icon, value, label, tone }) => (
            <div key={label} className="flex min-w-0 items-center gap-3 py-4 xs:py-5 md:justify-center md:px-4">
              <Icon className={`size-5 shrink-0 ${tone}`} aria-hidden="true" />
              <div>
                <dt className="sr-only">{label}</dt>
                <dd className="text-lg font-bold text-white">{value}</dd>
                <dd className="text-xs leading-snug text-slate-400">{label}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
