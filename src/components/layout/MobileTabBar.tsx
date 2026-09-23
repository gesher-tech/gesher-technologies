import { NAV_ITEMS } from '@/data/company';
import { useNavigation } from '@/context/NavigationContext';
import { cn } from '@/lib/utils';
import type { ViewId } from '@/types';

/** Native-style bottom tab bar, shown below the md breakpoint. */
export function MobileTabBar() {
  const { view, navigate } = useNavigation();

  const handleTap = (id: ViewId) => {
    if ('vibrate' in navigator) navigator.vibrate?.(8);
    navigate(id);
  };

  return (
    <nav aria-label="Mobile" className="glass-strong fixed inset-x-0 bottom-0 z-50 rounded-t-native-lg border-x-0 border-b-0 pb-safe md:hidden">
      <ul className="mx-auto grid h-tabbar max-w-md grid-cols-4 px-1">
        {NAV_ITEMS.map(({ id, shortLabel, label, icon: Icon }) => {
          const isActive = view === id;
          return (
            <li key={id} className="flex">
              <button
                type="button"
                onClick={() => handleTap(id)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className="group flex min-h-touch flex-1 flex-col items-center justify-center gap-1 rounded-2xl transition-transform duration-150 active:scale-90"
              >
                <span
                  className={cn(
                    'relative grid h-8 w-14 place-items-center rounded-full transition-all duration-300',
                    isActive ? 'bg-health-500/20 text-health-400' : 'text-slate-400 group-hover:text-slate-200',
                  )}
                >
                  <Icon className={cn('size-5 transition-transform duration-300', isActive && 'scale-110')} strokeWidth={isActive ? 2.4 : 2} />
                </span>
                <span className={cn('text-[11px] font-medium tracking-wide transition-colors', isActive ? 'text-white' : 'text-slate-500')}>
                  {shortLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
