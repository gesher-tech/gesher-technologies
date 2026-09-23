import { Building2, CalendarDays, MapPin, Target } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { COMPANY } from '@/data/company';

const FACTS = [
  { icon: CalendarDays, label: 'Founded', value: COMPANY.founded },
  { icon: MapPin, label: 'Headquarters', value: 'North Paravur, Ernakulam' },
  { icon: Building2, label: 'Focus', value: 'HealthTech · Marketplaces · Cloud' },
];

/** About Us — introduction, mission and key company facts. */
export function AboutIntro() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title={
          <>
            A bridge from <span className="text-gradient">Kerala</span> to the world
          </>
        }
        description={
          <>
            <em className="not-italic text-slate-200">Gesher</em> means “bridge”. We connect critical business workflows with modern cloud automation
            — and we connect Kerala’s engineering talent with domestic and global enterprises that need dependable software.
          </>
        }
      />

      <section className="container-x pt-12" aria-label="Mission and company facts">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card p-6 sm:p-7">
            <Target className="size-6 text-health-400" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">Our mission</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
              Build Tier-1 software solutions from Kerala for global and domestic enterprises — starting with the problems we see every day in local
              clinics, households and small businesses.
            </p>
          </div>
          <div className="card p-6 sm:p-7">
            <MapPin className="size-6 text-clinical-400" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">Why North Paravur</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
              Great engineers don’t have to leave home to do world-class work. Building here keeps us close to the communities our platforms serve and
              creates skilled jobs in Ernakulam district.
            </p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-3 xs:grid-cols-3">
          {FACTS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-native border border-white/[0.06] bg-ink-800/40 p-4">
              <Icon className="size-5 shrink-0 text-health-400" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">{label}</dt>
                <dd className="text-sm font-medium text-slate-200">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
