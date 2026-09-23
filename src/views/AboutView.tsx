import { AboutIntro } from '@/components/sections/about/AboutIntro';
import { Principles } from '@/components/sections/about/Principles';
import { Timeline } from '@/components/sections/about/Timeline';
import { CtaBanner } from '@/components/sections/shared/CtaBanner';

export default function AboutView() {
  return (
    <>
      <AboutIntro />
      <div className="container-x grid grid-cols-1 gap-14 py-16 md:py-20 lg:grid-cols-2 lg:gap-16 xxl:gap-24">
        <Principles />
        <Timeline />
      </div>
      <CtaBanner />
    </>
  );
}
