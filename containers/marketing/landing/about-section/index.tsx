'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AboutSection() {
    return (
        <section className="relative py-20 overflow-hidden">
            {/* World Map Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/world-map.png"
                    alt="World Map"
                    fill
                    className="object-cover opacity-10"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/60" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                                With COSCO, <span className="text-muted-foreground">you're not just choosing a carrier</span> — you're choosing{" "}
                                <span className="text-foreground">a logistics partner built for the future.</span>
                            </h2>
                        </div>

                        <Button className="group bg-primary hover:bg-primary/90 text-primary-foreground">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>

                    {/* Right Content - Feature Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Decades of Expertise */}
                        <div className="bg-card border rounded-lg p-6 space-y-4">
                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                                    Decades of Expertise
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    20+ years navigating global logistics challenges.
                                </p>
                            </div>
                        </div>

                        {/* Always-On Support */}
                        <div className="bg-card border rounded-lg p-6 space-y-4">
                            <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🕒</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                                    Always-On Support
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    24/7 tracking and assistance to ensure real-time service.
                                </p>
                            </div>
                        </div>

                        {/* Tailored Logistics Solutions */}
                        <div className="bg-card border rounded-lg p-6 space-y-4">
                            <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                                    Tailored Logistics Solutions
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Flexible solutions for SMEs to global enterprises.
                                </p>
                            </div>
                        </div>

                        {/* Competitive Pricing */}
                        <div className="bg-card border rounded-lg p-6 space-y-4">
                            <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                                    Competitive Pricing
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Optimized cost-efficiency without compromising speed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
