import { CarrierProfile } from "@/components/logistics/carrier-profile";
import { Award, Shield } from "lucide-react";
import Image from "next/image";

export default function CarrierProfilePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-12 px-4 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/world-map.png"
                        alt="World Map"
                        fill
                        className="object-cover opacity-5"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Carrier <span className="text-primary">Profiles</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            View detailed carrier performance statistics and ratings. Make informed decisions
                            based on community feedback and blockchain-verified data.
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Real-time</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Data</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Verified</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Ratings</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Transparent</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">History</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Trusted</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Network</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Information Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-card rounded-xl p-6 border shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    Profile Features
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Average Rating:</strong>
                                            <span className="text-muted-foreground">Community-based star rating</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Total Reviews:</strong>
                                            <span className="text-muted-foreground">Number of completed shipments</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Performance Badge:</strong>
                                            <span className="text-muted-foreground">Quality tier based on ratings</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Blockchain Verified:</strong>
                                            <span className="text-muted-foreground">All data is tamper-proof</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Scale */}
                            <div className="bg-card rounded-xl p-6 border shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-primary" />
                                    Rating Scale
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 dark:bg-emerald-400/10 dark:border-emerald-400/20">
                                        <span className="text-sm font-medium text-foreground">4.5 - 5.0</span>
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Excellent</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 dark:bg-blue-400/10 dark:border-blue-400/20">
                                        <span className="text-sm font-medium text-foreground">4.0 - 4.4</span>
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Good</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 dark:bg-amber-400/10 dark:border-amber-400/20">
                                        <span className="text-sm font-medium text-foreground">3.0 - 3.9</span>
                                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Average</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 dark:bg-red-400/10 dark:border-red-400/20">
                                        <span className="text-sm font-medium text-foreground">&lt; 3.0</span>
                                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">Needs Improvement</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            <CarrierProfile />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
