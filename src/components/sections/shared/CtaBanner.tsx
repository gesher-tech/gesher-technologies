import { CalendarCheck, MessageSquare } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

/** Closing call-to-action, reused at the bottom of Home and Services. */
export function CtaBanner() {
  const { navigate, startInquiry } = useNavigation();

  return (
    <section className="container-x pb-16 md:pb-24" aria-labelledby="cta-title">
      <div className="relative isolate overflow-hidden rounded-native-lg border border-white/10 bg-gradient-to-br from-health-600/30 via-ink-800 to-clinical-600/20 p-6 xs:p-8 md:p-12">
        <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="cta-title" className="text-2xl font-bold tracking-tight xs:text-3xl md:text-4xl">
              Ready to bridge your workflows to the cloud?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 xs:text-base">
              Book a 30-minute lab demo or talk to our engineers about your platform. No sales scripts — just a practical plan.
            </p>
          </div>
          <div className="flex flex-col gap-3 xs:flex-row lg:shrink-0">
            <button type="button" onClick={() => startInquiry('lab-demo')} className="btn-primary h-12 px-6">
              <CalendarCheck className="size-4" aria-hidden="true" />
              Book Lab Demo
            </button>
            <button type="button" onClick={() => navigate('contact')} className="btn-ghost h-12 px-6">
              <MessageSquare className="size-4" aria-hidden="true" />
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
