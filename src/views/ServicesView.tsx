import type { ComponentType } from 'react';
import { DevOpsCloud } from '@/components/sections/services/DevOpsCloud';
import { GesherTrade } from '@/components/sections/services/GesherTrade';
import { HealthTrack } from '@/components/sections/services/HealthTrack';
import { OneTouchService } from '@/components/sections/services/OneTouchService';
import { SERVICE_PANEL_ID, ServiceSwitcher } from '@/components/sections/services/ServiceSwitcher';
import { CtaBanner } from '@/components/sections/shared/CtaBanner';
import { PageHeader } from '@/components/ui/PageHeader';
import { useNavigation } from '@/context/NavigationContext';
import type { ServiceId } from '@/types';

const PANELS: Record<ServiceId, ComponentType> = {
  'health-track': HealthTrack,
  'one-touch': OneTouchService,
  trade: GesherTrade,
  devops: DevOpsCloud,
};

export default function ServicesView() {
  const { service } = useNavigation();
  const Panel = PANELS[service];

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Our products and <span className="text-gradient">engineering services</span>
          </>
        }
        description="Choose a product to explore it. Each one is interactive — try the lab simulator, search the worker directory, chat with a seller or run a pipeline."
      />

      <div className="container-x pb-16 pt-8 md:pb-20">
        <ServiceSwitcher />
        {/* Only the selected panel is mounted, so each product loads on demand. */}
        <div id={SERVICE_PANEL_ID} role="tabpanel" aria-labelledby={`tab-${service}`} key={service} className="animate-fade-up pt-8">
          <Panel />
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
