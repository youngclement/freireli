import AboutSection from "@/containers/marketing/landing/about_section";
import ContactSection from "@/containers/marketing/landing/contact_section";
import HeroSection from "@/containers/marketing/landing/hero_section";
import ServicesSection from "@/containers/marketing/landing/services_section";



export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
    </main>
  );
}
