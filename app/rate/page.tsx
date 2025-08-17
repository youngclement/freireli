import { RateCarrier } from "@/components/logistics/rate-carrier";
import { Award, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";

export default function RateCarrierPage() {
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
                            Rate <span className="text-primary">Carriers</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Help the community by rating carrier performance. Your feedback helps build a
                            trusted logistics network on the blockchain.
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Community</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Driven</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">5 Star</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Rating</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Honest</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Reviews</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Quality</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Assurance</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Benefits Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-card rounded-xl p-6 border shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-primary" />
                                    Why Rate Carriers?
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Build Trust:</strong>
                                            <span className="text-muted-foreground">Help others choose reliable carriers</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Improve Quality:</strong>
                                            <span className="text-muted-foreground">Motivate carriers to provide better service</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Permanent Record:</strong>
                                            <span className="text-muted-foreground">Blockchain ensures ratings cannot be changed</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Fair System:</strong>
                                            <span className="text-muted-foreground">Transparent and unbiased rating system</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Guidelines */}
                            <div className="bg-card rounded-xl p-6 border shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <ThumbsUp className="w-5 h-5 text-primary" />
                                    Rating Guidelines
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            ))}
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium">Excellent Service</span>
                                            <p className="text-xs text-muted-foreground">Fast, careful, great communication</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4].map(i => (
                                                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            ))}
                                            <Star className="w-3 h-3 text-gray-300" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium">Good Service</span>
                                            <p className="text-xs text-muted-foreground">Reliable with minor issues</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3].map(i => (
                                                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            ))}
                                            {[4, 5].map(i => (
                                                <Star key={i} className="w-3 h-3 text-gray-300" />
                                            ))}
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium">Average Service</span>
                                            <p className="text-xs text-muted-foreground">Met basic expectations</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Form */}
                        <div className="lg:col-span-8">
                            <RateCarrier />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
