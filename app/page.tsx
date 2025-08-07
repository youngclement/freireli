'use client';

import AboutSection from "@/containers/marketing/landing/about_section";
import ContactSection from "@/containers/marketing/landing/contact_section";
import HeroSection from "@/containers/marketing/landing/hero_section";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

export default function Home() {
  const containerRef = useGsapScroll();

  return (
    <div ref={containerRef} className="min-h-screen">
      <main>
        <HeroSection />
        <AboutSection />

        <ContactSection />
      </main>
    </div>
  );
}
