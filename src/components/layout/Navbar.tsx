import { CalendarCheck } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { NAV_ITEMS } from '@/data/company';
import { useNavigation } from '@/context/NavigationContext';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/lib/utils';

/** Desktop glass header (md+). On phones it shows the logo and a compact demo button; the tab bar handles navigation. */
export function Navbar() {
  const scrolled = useScrolled();
  const { view, navigate, startInquiry } = useNavigation();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-safe-top">
      <div
        className={cn(
          'pointer-events-auto mx-auto flex items-center justify-between gap-3 transition-all duration-300',
          scrolled
            ? 'glass mx-3 mt-3 h-16 max-w-6xl rounded-full px-3 pl-4 xs:mx-4 xl:mx-auto xxl:max-w-[84rem]'
            : 'container-x h-20 border border-transparent',
        )}
      >
        <button
          type="button"
          onClick={() => navigate('home')}
          className="tap flex min-h-touch shrink-0 items-center rounded-full"
          aria-label="Gesher Technologies — Home"
        >
          <Logo />
        </button>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-0.5 lg:gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = view === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => navigate(item.id)}
                    className={cn(
                      'tap relative flex min-h-touch items-center whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors lg:px-4',
                      isActive ? 'text-white' : 'text-slate-400 hover:text-white',
                    )}
                  >
                    {isActive && <span className="absolute inset-x-1.5 inset-y-2 -z-10 rounded-full bg-white/[0.08]" aria-hidden="true" />}
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <button type="button" onClick={() => startInquiry('lab-demo')} className="btn-primary hidden whitespace-nowrap px-4 md:inline-flex lg:px-5">
          <CalendarCheck className="size-4" aria-hidden="true" />
          <span className="lg:hidden">Lab Demo</span>
          <span className="hidden lg:inline">Book Lab Demo</span>
        </button>

        <button
          type="button"
          onClick={() => startInquiry('lab-demo')}
          className="tap inline-flex min-h-touch items-center gap-1.5 rounded-full bg-health-500/15 px-4 text-xs font-semibold text-health-400 ring-1 ring-health-500/30 md:hidden"
        >
          <CalendarCheck className="size-4" aria-hidden="true" />
          Demo
        </button>
      </div>
    </header>
  );
}
