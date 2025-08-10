import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Search, Settings, Shield, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function LogisticsPage() {
    const features = [
        {
            icon: Shield,
            title: "Blockchain Security",
            description: "Data secured and immutable on Kairos blockchain"
        },
        {
            icon: Clock,
            title: "Real-time Tracking",
            description: "Real-time shipment status updates"
        },
        {
            icon: Users,
            title: "Multi-user Support",
            description: "Support for multiple carriers and shippers"
        }
    ];

    const quickActions = [
        {
            title: "Create Shipment",
            description: "Create new shipment in the system",
            icon: Package,
            href: "/create",
            color: "bg-blue-500"
        },
        {
            title: "Track Shipment",
            description: "Track delivery status",
            icon: Search,
            href: "/track",
            color: "bg-green-500"
        },
        {
            title: "Manage Shipments",
            description: "Update status and events",
            icon: Settings,
            href: "/manage",
            color: "bg-orange-500"
        }
    ];

    return (
        <div className="w-full">
            <div className="space-y-12 px-4 py-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-normal tracking-tight text-foreground sm:text-6xl font-brand">
                        FREIRELI LOGISTICS
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Blockchain-powered logistics tracking system ensuring transparency and security for global supply chain management
                    </p>
                    <div className="flex justify-center gap-4 mt-8">
                        <Link href="/create">
                            <Button size="lg" className="gap-2">
                                <Package className="h-5 w-5" />
                                Create Shipment
                            </Button>
                        </Link>
                        <Link href="/track">
                            <Button variant="outline" size="lg" className="gap-2">
                                <Search className="h-5 w-5" />
                                Track Shipment
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link key={index} href={action.href}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader>
                                        <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle>{action.title}</CardTitle>
                                        <CardDescription>{action.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Features */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold">Key Features</h2>
                        <p className="text-muted-foreground mt-2">
                            Outstanding advantages of the blockchain logistics system
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index}>
                                    <CardHeader className="text-center">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Contract Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông Tin Mạng</CardTitle>
                        <CardDescription>
                            Ứng dụng được triển khai trên mạng Kairos Testnet
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium">Mạng:</p>
                                <p className="text-muted-foreground">Kairos Testnet</p>
                            </div>
                            <div>
                                <p className="font-medium">RPC URL:</p>
                                <p className="text-muted-foreground text-sm">https://rpc.ankr.com/klaytn_testnet</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
