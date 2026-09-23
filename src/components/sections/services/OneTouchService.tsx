import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { BadgeCheck, Briefcase, Clock, HardHat, MapPin, Phone, Search, Send, ShieldCheck, Star } from 'lucide-react';
import { ServiceHeader } from '@/components/sections/services/ServiceHeader';
import { Modal } from '@/components/ui/Modal';
import { COMPANY } from '@/data/company';
import { serviceWorkers } from '@/data/mockData';
import { cn, firstName, formatINR } from '@/lib/utils';
import type { ServiceArea, ServiceWorker, WorkerCategory } from '@/types';

/** One-Touch-Service — hyperlocal labour marketplace with an interactive worker directory. */
export function OneTouchService() {
  return (
    <section aria-labelledby="one-touch-title">
      <ServiceHeader
        id="one-touch-title"
        service="one-touch"
        title="Find verified workers near you"
        description="Electricians, HVAC and IT technicians alongside daily-wage helpers — every profile ID-checked, rated by real customers and paid directly, with zero commission."
      />
      <WorkerDirectory />
    </section>
  );
}

const CATEGORY_FILTERS: { id: WorkerCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'skilled', label: 'Skilled' },
  { id: 'unskilled', label: 'Unskilled' },
];

const AREAS: (ServiceArea | 'All areas')[] = ['All areas', 'North Paravur', 'Aluva', 'Kochi', 'Kodungallur', 'Angamaly'];

function WorkerDirectory() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<WorkerCategory | 'all'>('all');
  const [area, setArea] = useState<ServiceArea | 'All areas'>('All areas');
  const [contact, setContact] = useState<ServiceWorker | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return serviceWorkers.filter(
      (w) =>
        (category === 'all' || w.category === category) &&
        (area === 'All areas' || w.location === area) &&
        (!q || w.name.toLowerCase().includes(q) || w.skillType.toLowerCase().includes(q) || w.location.toLowerCase().includes(q)),
    );
  }, [query, category, area]);

  return (
    <div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <BadgeCheck className="size-4 text-health-400" aria-hidden="true" /> Aadhaar-verified
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="size-4 text-clinical-400" aria-hidden="true" /> Zero commission
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search workers by name, skill or area</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search electrician, plumber, Aluva…"
            className="input rounded-full pl-11"
          />
        </label>
        <div
          role="radiogroup"
          aria-label="Worker category"
          className="grid grid-cols-3 gap-1 rounded-full bg-ink-800/80 p-1 ring-1 ring-white/[0.06]"
        >
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={category === c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                'tap flex min-h-touch items-center justify-center gap-1.5 rounded-full px-4 text-xs font-semibold transition-colors',
                category === c.id
                  ? c.id === 'unskilled'
                    ? 'bg-amber-500/20 text-amber-300'
                    : c.id === 'skilled'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white',
              )}
            >
              {c.id === 'skilled' && <Briefcase className="size-3.5" aria-hidden="true" />}
              {c.id === 'unskilled' && <HardHat className="size-3.5" aria-hidden="true" />}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by area">
        {AREAS.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={area === a}
            onClick={() => setArea(a)}
            className={cn(
              'tap flex min-h-touch shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium ring-1 transition-colors',
              area === a ? 'bg-health-500/15 text-health-400 ring-health-500/40' : 'text-slate-400 ring-white/10 hover:text-white',
            )}
          >
            <MapPin className="size-3.5" aria-hidden="true" />
            {a}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs text-slate-500" aria-live="polite">
        Showing {results.length} of {serviceWorkers.length} workers
      </p>

      {results.length === 0 ? (
        <div className="mt-4 rounded-native border border-dashed border-white/10 p-10 text-center">
          <p className="text-sm text-slate-300">No workers match those filters yet.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
              setArea('All areas');
            }}
            className="btn-ghost mt-4"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4">
          {results.map((w) => (
            <li key={w.id}>
              <WorkerCard worker={w} onContact={() => setContact(w)} />
            </li>
          ))}
        </ul>
      )}

      <ServiceRequestModal worker={contact} onClose={() => setContact(null)} />
    </div>
  );
}

function WorkerCard({ worker: w, onContact }: { worker: ServiceWorker; onContact: () => void }) {
  const initials = w.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
  return (
    <article className="card group flex h-full flex-col p-5 transition-colors hover:border-white/15">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'relative grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-bold',
            w.category === 'skilled' ? 'bg-indigo-500/15 text-indigo-300' : 'bg-amber-500/15 text-amber-300',
          )}
        >
          {initials}
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-ink-800',
              w.available ? 'bg-clinical-400' : 'bg-slate-500',
            )}
            aria-label={w.available ? 'Available now' : 'Busy'}
            role="img"
          />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="flex items-center gap-1.5 text-[15px] font-semibold">
            <span className="truncate">{w.name}</span>
            {w.verified && <BadgeCheck className="size-4 shrink-0 text-health-400" aria-label="Verified" />}
          </h4>
          <p className="truncate text-sm text-slate-400">{w.skillType}</p>
        </div>
        <span
          className={cn(
            'chip shrink-0 capitalize ring-1',
            w.category === 'skilled' ? 'bg-indigo-500/10 text-indigo-300 ring-indigo-500/30' : 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
          )}
        >
          {w.category}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
        <span className="flex items-center gap-1 font-semibold text-white">
          <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
          {w.rating.toFixed(1)}
        </span>
        <span>{w.completedJobs} jobs done</span>
        <span className="chip bg-white/5 text-slate-300 ring-1 ring-white/10">
          <MapPin className="size-3" aria-hidden="true" />
          {w.location}
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-500">Speaks {w.languages.join(', ')}</p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <p>
          <span className="text-lg font-bold text-white">{formatINR(w.hourlyRate)}</span>
          <span className="text-xs text-slate-500"> / hour</span>
        </p>
        <button type="button" onClick={onContact} className="btn-primary px-4" aria-label={`Request service from ${w.name}`}>
          <Phone className="size-4" aria-hidden="true" />
          Contact
        </button>
      </div>
    </article>
  );
}

function ServiceRequestModal({ worker, onClose }: { worker: ServiceWorker | null; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [details, setDetails] = useState('');
  const [slot, setSlot] = useState('Today, afternoon');

  useEffect(() => {
    setSubmitted(false);
    setDetails('');
  }, [worker?.id]);

  if (!worker) return null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Modal open={!!worker} onClose={onClose} title={`Request ${firstName(worker.name)}`} description={`${worker.skillType} · ${worker.location}`}>
      {submitted ? (
        <div className="py-4 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-clinical-500/15 text-clinical-400">
            <BadgeCheck className="size-7" aria-hidden="true" />
          </span>
          <p className="mt-4 font-semibold text-white">Request sent to {firstName(worker.name)}</p>
          <p className="mt-1 text-sm text-slate-400">
            {worker.available
              ? 'Workers usually respond within 15 minutes.'
              : `${firstName(worker.name)} is on a job — we'll notify you as soon as they accept.`}
          </p>
          <button type="button" onClick={onClose} className="btn-ghost mt-6 w-full">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-3 text-sm">
            <span className="flex items-center gap-2 text-slate-300">
              <Clock className="size-4 text-slate-500" aria-hidden="true" />
              {worker.available ? 'Available now' : 'Currently on a job'}
            </span>
            <span className="font-semibold text-white">{formatINR(worker.hourlyRate)}/hr</span>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-300">Preferred time</span>
            <select value={slot} onChange={(e) => setSlot(e.target.value)} className="input">
              <option>Today, afternoon</option>
              <option>Today, evening</option>
              <option>Tomorrow, morning</option>
              <option>Tomorrow, afternoon</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-300">What do you need done?</span>
            <textarea
              required
              minLength={8}
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Kitchen socket sparking, need inspection and replacement"
              className="input resize-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={COMPANY.phoneHref}
              className="btn-ghost"
              aria-label={`Call ${firstName(worker.name)} via the Gesher bridge line (${worker.phone})`}
            >
              <Phone className="size-4" aria-hidden="true" />
              Call
            </a>
            <button type="submit" className="btn-primary">
              <Send className="size-4" aria-hidden="true" />
              Send request
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
