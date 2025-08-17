'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function NetworkSection() {
    return (
        <section className="relative py-24 overflow-hidden bg-white">
            {/* World Map Background */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <Image
                    src="/images/world-map.png"
                    alt="World Map"
                    width={1200}
                    height={600}
                    className="object-contain opacity-20 max-w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto space-y-8">
                    {/* Main Heading */}
                    <div className="space-y-4">
                        <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            A Global Logistics Network{" "}
                            <span className="bg-gradient-to-r from-lime-400 to-lime-600 bg-clip-text text-transparent">
                                —
                            </span>
                        </h2>
                        <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            <span className="bg-gradient-to-r from-lime-400 to-lime-600 bg-clip-text text-transparent">
                                You Can Rely On
                            </span>
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Our extensive network spans over 120 countries, ensuring your goods reach
                        their destination — safely, swiftly, and reliably.
                    </p>

                    {/* CTA Button */}
                    <div className="pt-4">
                        <Button
                            size="lg"
                            className="group bg-lime-500 hover:bg-lime-600 text-white px-8 py-6 text-lg font-semibold rounded-full"
                        >
                            More info
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-lime-500">200+</div>
                            <p className="text-gray-600">Global Partners</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-lime-500">120+</div>
                            <p className="text-gray-600">Countries Served</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-lime-500">99.9%</div>
                            <p className="text-gray-600">On-Time Delivery</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
