import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { VIEW_TITLES } from '@/data/company';
import type { InquiryType, ServiceId, ViewId } from '@/types';

interface NavState {
  view: ViewId;
  service: ServiceId;
}

interface NavigateOptions {
  service?: ServiceId;
  inquiry?: InquiryType;
}

interface NavigationContextValue extends NavState {
  inquiry: InquiryType;
  navigate: (view: ViewId, options?: NavigateOptions) => void;
  selectService: (service: ServiceId) => void;
  setInquiry: (type: InquiryType) => void;
  /** Opens Contact Us with the given inquiry type preselected. */
  startInquiry: (type: InquiryType) => void;
}

const VIEWS: readonly ViewId[] = ['home', 'about', 'services', 'contact', 'terms', 'privacy'];
const SERVICES: readonly ServiceId[] = ['health-track', 'one-touch', 'trade', 'devops'];
const DEFAULT_STATE: NavState = { view: 'home', service: 'health-track' };

function isNavState(value: unknown): value is NavState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return VIEWS.includes(v.view as ViewId) && SERVICES.includes(v.service as ServiceId);
}

/** The URL never changes; history entries share the same URL and carry the view in `history.state`. */
function sameUrl(): string {
  return window.location.pathname + window.location.search;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  // history.state survives a reload of the same tab, so refreshing keeps the current view.
  const [nav, setNav] = useState<NavState>(() => (isNavState(window.history.state) ? window.history.state : DEFAULT_STATE));
  const [inquiry, setInquiry] = useState<InquiryType>('lab-demo');
  // Source of truth for history writes, kept outside state updaters (which must stay pure).
  const navRef = useRef(nav);

  const commit = useCallback((next: NavState) => {
    navRef.current = next;
    setNav(next);
  }, []);

  useEffect(() => {
    window.history.replaceState(navRef.current, '', sameUrl());
    const onPop = (e: PopStateEvent) => {
      commit(isNavState(e.state) ? e.state : DEFAULT_STATE);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [commit]);

  useEffect(() => {
    document.title = VIEW_TITLES[nav.view];
  }, [nav.view]);

  const navigate = useCallback(
    (view: ViewId, options: NavigateOptions = {}) => {
      if (options.inquiry) setInquiry(options.inquiry);
      const prev = navRef.current;
      const next: NavState = { view, service: options.service ?? prev.service };
      if (next.view !== prev.view || next.service !== prev.service) {
        window.history.pushState(next, '', sameUrl());
        commit(next);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [commit],
  );

  const selectService = useCallback(
    (service: ServiceId) => {
      const prev = navRef.current;
      if (prev.service === service) return;
      const next: NavState = { ...prev, service };
      window.history.replaceState(next, '', sameUrl());
      commit(next);
    },
    [commit],
  );

  const startInquiry = useCallback((type: InquiryType) => navigate('contact', { inquiry: type }), [navigate]);

  const value = useMemo(
    () => ({ ...nav, inquiry, navigate, selectService, setInquiry, startInquiry }),
    [nav, inquiry, navigate, selectService, startInquiry],
  );

  return <NavigationContext value={value}>{children}</NavigationContext>;
}

export function useNavigation(): NavigationContextValue {
  const ctx = use(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used inside <NavigationProvider>');
  return ctx;
}
