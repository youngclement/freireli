import { useMultiParallax } from "@/hooks/use-multi-parallax";
import Image from "next/image";
import { MapPoint } from "@/components/hero/map-point";
import { SocialIcon } from "@/components/hero/social-icon";

export default function HeroSection() {
    const { backgroundRef, contentRef } = useMultiParallax();

    return (
        <section className="relative h-[80vh] min-h-[700px] overflow-hidden rounded-bl-2xl rounded-br-2xl">
            {/* Main Background with Parallax */}
            <div ref={backgroundRef} className="absolute inset-0">
                <Image
                    src="/images/hero-img.jpg"
                    alt="Logistics Background"
                    fill
                    className="object-cover rounded-bl-2xl rounded-br-2xl"
                    priority
                />
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Large Background Text */}
            <div
                ref={contentRef}
                className="absolute w-[806.48px] h-96 left-[120.44px] top-[52.34px] opacity-20 flex justify-center items-center text-white text-[120px] md:text-[233.95px] font-normal font-brand leading-[200px] md:leading-[327.52px]"
            >
                FREIRELI
            </div>

            {/* Copyright */}
            <div className="absolute right-4 md:right-[98px] top-[90.17px] text-right text-white text-[10.09px] font-normal leading-none">
                © 2024
            </div>

            {/* Map Points distributed across the hero section */}

            <MapPoint
                className="absolute left-[120px] top-[150px] z-10"
                quote={{
                    title: "Smart Port Solutions",
                    description: "Revolutionary automated loading systems that reduce port time by 40% while maintaining the highest safety standards in the industry.",
                    direction: "right"
                }}
                lineConfig={{
                    path: "M 6 6 L 60 60 L 160 60",
                    width: 180,
                    height: 80,
                    quotePosition: { x: 160, y: 60 }
                }}
            />
            <MapPoint
                className="absolute left-[820px] top-[350px] z-10"
                quote={{
                    title: "Smart Port Solutions",
                    description: "Revolutionary automated loading systems that reduce port time by 40% while maintaining the highest safety standards in the industry.",
                    direction: "right"
                }}
                lineConfig={{
                    path: "M 6 6 L 60 60 L 160 60",
                    width: 180,
                    height: 80,
                    quotePosition: { x: 160, y: 60 }
                }}
            />


            {/* Bottom Left Text */}
            <div className="absolute left-4 md:left-[50px] bottom-[120px] text-left">
                <div className="text-white text-sm font-normal leading-tight mb-1">
                    Global Reach //
                </div>
                <div className="text-white text-sm font-normal leading-tight mb-1">
                    End-to-End Solutions //
                </div>
                <div className="text-white text-sm font-normal leading-tight">
                    Reliable Efficiency //
                </div>
            </div>

            {/* Bottom Right Text */}
            <div className="absolute right-4 md:right-[87px] bottom-[50px] text-right">
                <span className="text-white text-2xl md:text-3xl font-medium leading-7">Optimizing</span>
                <span className="text-white/50 text-2xl md:text-3xl font-medium leading-7"> logistics. <br /></span>
                <span className="text-white text-2xl md:text-3xl font-medium leading-7">Connecting</span>
                <span className="text-white/50 text-2xl md:text-3xl font-medium leading-7"> the world.</span>
            </div>

            {/* Social Icons - Bottom Left */}
            <div className="absolute left-4 md:left-[50px] bottom-[50px] flex gap-3">
                <SocialIcon />
                <SocialIcon />
                <SocialIcon />
            </div>
        </section>
    );
}