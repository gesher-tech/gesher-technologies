import { useRef, type KeyboardEvent } from 'react';
import { SERVICES } from '@/data/company';
import { useNavigation } from '@/context/NavigationContext';
import { cn } from '@/lib/utils';
import type { ServiceId } from '@/types';

export const SERVICE_PANEL_ID = 'service-panel';

/** Services — sticky segmented control that swaps the visible product panel. */
export function ServiceSwitcher() {
  const { service, selectService } = useNavigation();
  const listRef = useRef<HTMLDivElement>(null);

  const choose = (id: ServiceId) => {
    // If the reader had scrolled deep into the previous panel, bring the new one's start into view
    // (offset = fixed header + sticky switcher).
    const panel = document.getElementById(SERVICE_PANEL_ID);
    if (panel) {
      const top = panel.getBoundingClientRect().top + window.scrollY - 170;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }
    selectService(id);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = SERVICES[(index + (e.key === 'ArrowRight' ? 1 : SERVICES.length - 1)) % SERVICES.length]!;
    choose(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-service="${next.id}"]`)?.focus();
  };

  return (
    <div className="sticky top-[4.75rem] z-30 -mx-4 bg-ink-900/85 px-4 py-3 backdrop-blur-xl xs:-mx-5 xs:px-5 sm:-mx-6 sm:px-6 md:top-20 lg:-mx-8 lg:px-8 xxl:-mx-10 xxl:px-10">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Products and services"
        className="no-scrollbar flex gap-2 overflow-x-auto lg:grid lg:grid-cols-4 lg:overflow-visible"
      >
        {SERVICES.map((s, i) => {
          const active = s.id === service;
          return (
            <button
              key={s.id}
              data-service={s.id}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={active}
              aria-controls={SERVICE_PANEL_ID}
              tabIndex={active ? 0 : -1}
              onClick={() => choose(s.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'tap flex min-h-touch shrink-0 items-center gap-2.5 rounded-2xl border px-3.5 py-2 text-left transition-colors lg:px-4 lg:py-3',
                active
                  ? 'border-health-500/50 bg-health-500/10 text-white'
                  : 'border-white/[0.08] bg-ink-800/60 text-slate-400 hover:border-white/20 hover:text-white',
              )}
            >
              <span className={cn('grid size-8 shrink-0 place-items-center rounded-xl ring-1', active ? s.accent : 'bg-white/5 ring-white/10')}>
                <s.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-sm font-semibold lg:whitespace-normal">{s.name}</span>
                <span className="hidden text-[11px] text-slate-500 lg:block">{s.kind}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
