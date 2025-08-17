'use client';

import HeroSection from "@/containers/marketing/landing/hero_section";
import StatisticsSection from "@/containers/marketing/landing/statistics-section";
import NetworkSection from "@/containers/marketing/landing/network-section";
import AboutSection from "@/containers/marketing/landing/about-section";
import TrustedBySection from "@/containers/marketing/landing/trusted-by-section";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

export default function Home() {
  const containerRef = useGsapScroll();

  return (
    <div ref={containerRef} className="w-full">
      <main>
        <HeroSection />
        <StatisticsSection />
        <NetworkSection />
        <AboutSection />
        <TrustedBySection />
      </main>
    </div>
  );
}
