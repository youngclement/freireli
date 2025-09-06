import { EventManagement } from "@/components/logistics/event-management";
import Image from "next/image";

export default function EventsPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-8 px-4 overflow-hidden">
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
                    <div className="text-center max-w-4xl mx-auto mb-8">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Event <span className="text-primary">Management</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            Add tracking events, update locations, and manage shipment activities based on your role.
                            Real-time updates for complete transparency.
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">24/7</div>
                                <div className="text-sm text-muted-foreground">Real-time Updates</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">100%</div>
                                <div className="text-sm text-muted-foreground">Transparent</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">Secure</div>
                                <div className="text-sm text-muted-foreground">Blockchain</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">Multi</div>
                                <div className="text-sm text-muted-foreground">Actor Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8">
                <div className="container mx-auto">
                    <EventManagement />
                </div>
            </section>
        </div>
    );
}
