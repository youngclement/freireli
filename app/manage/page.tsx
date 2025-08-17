import { ManageShipment } from "@/components/logistics/manage-shipment";
import Image from "next/image";
import { Settings, Edit, Plus, Shield, Activity } from "lucide-react";

export default function ManagePage() {
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
                            Manage <span className="text-primary">Shipments</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Update status and add shipping events with admin privileges.
                            Manage the entire logistics cycle efficiently.
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Admin</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Access Level</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">2-Click</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Update</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Live</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Real-time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary">Safe</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Secure</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <ManageShipment />
                </div>
            </section>

            {/* Help Section */}
            <section className="py-12 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-3">Management Guide</h2>
                        <p className="text-muted-foreground text-sm">Shipment management process for admin</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">1</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Select Tab</h3>
                            <p className="text-xs text-muted-foreground">
                                Event or status
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">2</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Enter Code</h3>
                            <p className="text-xs text-muted-foreground">
                                Shipment code to update
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">3</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Fill Details</h3>
                            <p className="text-xs text-muted-foreground">
                                Location, event or status
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">4</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Confirm</h3>
                            <p className="text-xs text-muted-foreground">
                                Submit to blockchain
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">5</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Wait Processing</h3>
                            <p className="text-xs text-muted-foreground">
                                Blockchain confirmation
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">6</span>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Complete</h3>
                            <p className="text-xs text-muted-foreground">
                                Update successful
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}