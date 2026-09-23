import { lazy, Suspense, useEffect, useRef, type ComponentType, type LazyExoticComponent } from 'react';
import { Loader2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { Navbar } from '@/components/layout/Navbar';
import { NavigationProvider, useNavigation } from '@/context/NavigationContext';
import HomeView from '@/views/HomeView';
import type { ViewId } from '@/types';

// Home ships in the main bundle; every other view is fetched the first time it is opened.
const VIEWS: Record<ViewId, ComponentType | LazyExoticComponent<ComponentType>> = {
  home: HomeView,
  about: lazy(() => import('@/views/AboutView')),
  services: lazy(() => import('@/views/ServicesView')),
  contact: lazy(() => import('@/views/ContactView')),
  terms: lazy(() => import('@/views/TermsView')),
  privacy: lazy(() => import('@/views/PrivacyView')),
};

function ViewLoading() {
  return (
    <div className="grid min-h-[70vh] place-items-center" role="status">
      <Loader2 className="size-6 animate-spin text-health-400" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

function CurrentView() {
  const { view } = useNavigation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const View = VIEWS[view];

  // Move focus to the new view so keyboard and screen-reader users land at its start.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [view]);

  return (
    <main id="main" ref={mainRef} tabIndex={-1} className="min-h-screen overflow-x-clip outline-none">
      <Suspense fallback={<ViewLoading />}>
        <div key={view} className="animate-[fade-up_0.35s_ease-out_both]">
          <View />
        </div>
      </Suspense>
    </main>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink-900"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <Navbar />
      <CurrentView />
      <Footer />
      <MobileTabBar />
    </NavigationProvider>
  );
}
