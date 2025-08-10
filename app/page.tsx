'use client';

import HeroSection from "@/containers/marketing/landing/hero_section";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

export default function Home() {
  const containerRef = useGsapScroll();

  return (
    <div ref={containerRef} className="w-full">
      <main>
        <HeroSection />


      </main>
    </div>
  );
}
