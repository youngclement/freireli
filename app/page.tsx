'use client';

import HeroSection from "@/containers/marketing/landing/hero_section";
import StatisticsSection from "@/containers/marketing/landing/statistics-section";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

export default function Home() {
  const containerRef = useGsapScroll();

  return (
    <div ref={containerRef} className="w-full">
      <main>
        <HeroSection />
        <StatisticsSection />
      </main>
    </div>
  );
}
