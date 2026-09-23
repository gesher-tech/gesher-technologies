import { Hero } from '@/components/sections/home/Hero';
import { ServicesOverview } from '@/components/sections/home/ServicesOverview';
import { WhyGesher } from '@/components/sections/home/WhyGesher';
import { CtaBanner } from '@/components/sections/shared/CtaBanner';

export default function HomeView() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <WhyGesher />
      <CtaBanner />
    </>
  );
}
