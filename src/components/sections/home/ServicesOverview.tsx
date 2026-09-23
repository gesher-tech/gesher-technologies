import { ArrowUpRight, Check } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SERVICES } from '@/data/company';
import { useNavigation } from '@/context/NavigationContext';
import { cn } from '@/lib/utils';

/** Home — teaser cards for every product/service; each opens its panel on the Services view. */
export function ServicesOverview() {
  const { navigate } = useNavigation();

  return (
    <section className="section" aria-labelledby="overview-title">
      <SectionHeading
        eyebrow="What we build"
        title={<span id="overview-title">Products and services under one roof</span>}
        description="A flagship healthcare platform, two community marketplaces and an enterprise DevOps practice — all running on the same reliable cloud foundation."
      />

      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SERVICES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => navigate('services', { service: s.id })}
              className="tap group flex h-full w-full flex-col rounded-native border border-white/[0.08] bg-ink-800/60 p-5 text-left transition-colors hover:border-white/20 hover:bg-ink-800 sm:p-6"
            >
              <span className="flex w-full items-start justify-between gap-3">
                <span className={cn('grid size-12 place-items-center rounded-2xl ring-1', s.accent)}>
                  <s.icon className="size-6" aria-hidden="true" />
                </span>
                <ArrowUpRight
                  className="size-5 text-slate-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{s.kind}</span>
              <span className="mt-1 text-lg font-semibold text-white">{s.name}</span>
              <span className="mt-2 text-sm leading-relaxed text-slate-400">{s.summary}</span>
              <span className="mt-auto space-y-1.5 pt-5">
                {s.highlights.map((h) => (
                  <span key={h} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="size-3.5 shrink-0 text-clinical-400" aria-hidden="true" />
                    {h}
                  </span>
                ))}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
