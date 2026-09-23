import { Code2, HandHeart, ServerCog } from 'lucide-react';

const PRINCIPLES = [
  {
    icon: Code2,
    title: 'Clean code',
    body: 'Typed, tested and reviewed. We write software the next engineer will thank us for — because that engineer is usually us.',
  },
  {
    icon: ServerCog,
    title: 'Reliable infrastructure',
    body: 'Automated, observable and recoverable by design. Clinics and businesses depend on our systems, so uptime is a promise, not a hope.',
  },
  {
    icon: HandHeart,
    title: 'Community-driven labour empowerment',
    body: 'Technology should create local livelihoods. Our platforms give skilled and unskilled workers dignified, direct access to paying customers.',
  },
];

/** About Us — leadership philosophy. */
export function Principles() {
  return (
    <section aria-labelledby="principles-title">
      <h2 id="principles-title" className="text-xl font-semibold sm:text-2xl">
        Leadership philosophy
      </h2>
      <ul className="mt-6 space-y-4">
        {PRINCIPLES.map((p) => (
          <li key={p.title} className="card flex gap-4 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-health-400 ring-1 ring-white/10">
              <p.icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{p.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
