import { TrackShipment } from "@/components/logistics/track-shipment";
import Image from "next/image";
import { Search, MapPin, Clock, Shield, BarChart3 } from "lucide-react";

export default function TrackPage() {
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
                            Track <span className="text-primary">Shipments</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Check detailed status and shipping history with blockchain technology.
                            Accurate information, real-time updates 24/7.
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Transparent</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">1s</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Updates</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Tracking</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">∞</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Storage</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <TrackShipment />
                </div>
            </section>

            {/* Help Section */}
            <section className="py-12 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-3">User Guide</h2>
                        <p className="text-muted-foreground text-sm">Track shipments easily with simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">1</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Enter Shipment Code</h3>
                            <p className="text-xs text-muted-foreground">
                                Fill shipment code in search box
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">2</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Click Search</h3>
                            <p className="text-xs text-muted-foreground">
                                Click "Search" button to lookup
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">3</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">View Information</h3>
                            <p className="text-xs text-muted-foreground">
                                Check shipment details
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">4</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Track Progress</h3>
                            <p className="text-xs text-muted-foreground">
                                View progress bar and status
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">5</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">View History</h3>
                            <p className="text-xs text-muted-foreground">
                                Complete timeline of events
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}