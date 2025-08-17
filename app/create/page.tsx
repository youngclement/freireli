import { CreateShipment } from "@/components/logistics/create-shipment";
import Image from "next/image";
import { Package, Truck, MapPin, Zap, Shield } from "lucide-react";

export default function CreatePage() {
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
                            Create <span className="text-primary">Shipments</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Create new blockchain shipments with complete transparency and security.
                            Start your logistics journey with next-generation technology.
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">3 Min</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Setup Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Instant</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Blockchain</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Secure</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Global</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Reach</div>
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
                                    <Shield className="w-5 h-5 text-primary" />
                                    Blockchain Benefits
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Immutable Records:</strong>
                                            <span className="text-muted-foreground">All shipment data permanently recorded</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Real-time Tracking:</strong>
                                            <span className="text-muted-foreground">Instant status updates and transparency</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Global Access:</strong>
                                            <span className="text-muted-foreground">Track shipments worldwide instantly</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <strong className="block">Smart Contracts:</strong>
                                            <span className="text-muted-foreground">Automated and secure logistics</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Process Steps */}
                            <div className="bg-card rounded-xl p-6 border shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary" />
                                    Quick Process
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">1</div>
                                        <span className="text-sm">Fill shipment details</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">2</div>
                                        <span className="text-sm">Connect your wallet</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">3</div>
                                        <span className="text-sm">Submit to blockchain</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">4</div>
                                        <span className="text-sm">Start tracking instantly</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Form */}
                        <div className="lg:col-span-8">
                            <CreateShipment />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}