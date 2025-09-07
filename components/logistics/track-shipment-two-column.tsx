"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    useGetShipment, 
    useGetShipmentEvents, 
    useGetFullTrackingInfo
} from "@/hooks/use-logistics";
import { StatusEnum, ShipmentEvent } from "@/lib/contracts";
import { 
    Search, 
    MapPin, 
    Calendar, 
    Clock, 
    Package, 
    Truck, 
    Building2, 
    ShieldCheck, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Activity,
    Globe,
    Navigation
} from "lucide-react";
import { formatEther } from "viem";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const trackingSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
});

type TrackingFormData = z.infer<typeof trackingSchema>;

const getStatusLabel = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Pending:
            return "Pending";
        case StatusEnum.WarehouseConfirmed:
            return "Warehouse Confirmed";
        case StatusEnum.QualityApproved:
            return "Quality Approved";
        case StatusEnum.InTransit:
            return "In Transit";
        case StatusEnum.Delivered:
            return "Delivered";
        case StatusEnum.Completed:
            return "Completed";
        case StatusEnum.Disputed:
            return "Disputed";
        case StatusEnum.Canceled:
            return "Canceled";
        default:
            return "Unknown";
    }
};

const getStatusIcon = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Pending:
            return <Clock className="w-5 h-5" />;
        case StatusEnum.WarehouseConfirmed:
            return <Building2 className="w-5 h-5" />;
        case StatusEnum.QualityApproved:
            return <ShieldCheck className="w-5 h-5" />;
        case StatusEnum.InTransit:
            return <Truck className="w-5 h-5" />;
        case StatusEnum.Delivered:
            return <CheckCircle className="w-5 h-5" />;
        case StatusEnum.Completed:
            return <CheckCircle className="w-5 h-5" />;
        case StatusEnum.Disputed:
            return <AlertCircle className="w-5 h-5" />;
        case StatusEnum.Canceled:
            return <XCircle className="w-5 h-5" />;
        default:
            return <Package className="w-5 h-5" />;
    }
};

const getStatusColor = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Pending:
            return "bg-blue-500 text-white";
        case StatusEnum.WarehouseConfirmed:
            return "bg-orange-500 text-white";
        case StatusEnum.QualityApproved:
            return "bg-purple-500 text-white";
        case StatusEnum.InTransit:
            return "bg-yellow-500 text-black";
        case StatusEnum.Delivered:
            return "bg-green-500 text-white";
        case StatusEnum.Completed:
            return "bg-green-600 text-white";
        case StatusEnum.Disputed:
            return "bg-red-500 text-white";
        case StatusEnum.Canceled:
            return "bg-gray-500 text-white";
        default:
            return "bg-gray-400 text-white";
    }
};

const getProgressValue = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Pending:
            return 10;
        case StatusEnum.WarehouseConfirmed:
            return 25;
        case StatusEnum.QualityApproved:
            return 50;
        case StatusEnum.InTransit:
            return 75;
        case StatusEnum.Delivered:
            return 90;
        case StatusEnum.Completed:
            return 100;
        default:
            return 0;
    }
};

const getEventIcon = (eventType: string) => {
    if (eventType.includes("Transit") || eventType.includes("transit")) {
        return <Truck className="w-4 h-4" />;
    }
    if (eventType.includes("Warehouse") || eventType.includes("warehouse")) {
        return <Building2 className="w-4 h-4" />;
    }
    if (eventType.includes("Quality") || eventType.includes("quality")) {
        return <ShieldCheck className="w-4 h-4" />;
    }
    if (eventType.includes("Delivered") || eventType.includes("delivered")) {
        return <CheckCircle className="w-4 h-4" />;
    }
    return <Activity className="w-4 h-4" />;
};

export function TrackShipmentTwoColumn() {
    const [shipmentCode, setShipmentCode] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const { shipment, isLoading: isLoadingShipment, refetch: refetchShipment } = useGetShipment(shipmentCode);
    const { events = [], isLoading: isLoadingEvents, refetch: refetchEvents } = useGetShipmentEvents(shipmentCode);

    const form = useForm<TrackingFormData>({
        resolver: zodResolver(trackingSchema),
        defaultValues: { shipmentCode: "" },
    });

    // GSAP Animations
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Initial setup - hide elements
            gsap.set(".shipment-info", { opacity: 0, x: -50 });
            gsap.set(".events-timeline", { opacity: 0, x: 50 });
            gsap.set(".map-container", { opacity: 0, scale: 0.9 });
            gsap.set(".progress-bar", { scaleX: 0 });
            gsap.set(".event-item", { opacity: 0, y: 30 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Animate when shipment data loads
    useEffect(() => {
        if (shipment && events.length > 0 && containerRef.current) {
            const tl = gsap.timeline();

            // Animate shipment info from left
            tl.to(".shipment-info", {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            })
            // Animate map
            .to(".map-container", {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.4")
            // Animate progress bar
            .to(".progress-bar", {
                scaleX: 1,
                duration: 1,
                ease: "power2.inOut"
            }, "-=0.3")
            // Animate events timeline from right
            .to(".events-timeline", {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5")
            // Stagger animate event items
            .to(".event-item", {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.3");

            // Animate map dots
            gsap.to(".map-dot", {
                scale: 1.2,
                duration: 1,
                yoyo: true,
                repeat: -1,
                ease: "power2.inOut",
                stagger: 0.2
            });

            // Pulse effect for active location
            gsap.to(".active-location", {
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
                duration: 1.5,
                yoyo: true,
                repeat: -1,
                ease: "power2.inOut"
            });
        }
    }, [shipment, events]);

    const onSearch = (data: TrackingFormData) => {
        setShipmentCode(data.shipmentCode);
        refetchShipment();
        refetchEvents();
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Search Section */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
                <div className="container mx-auto p-6">
                    <Card className="shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Search className="w-6 h-6 text-primary" />
                                </div>
                                Track Your Shipment
                            </CardTitle>
                            <CardDescription className="text-base">
                                Enter your shipment code to view real-time tracking information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSearch)} className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="shipmentCode"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter shipment code (e.g., SHIP0001)"
                                                        className="h-12 text-lg"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button 
                                        type="submit" 
                                        className="h-12 px-8 text-lg"
                                        disabled={isLoadingShipment}
                                    >
                                        {isLoadingShipment ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Search className="w-5 h-5 mr-2" />
                                                Track
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {shipment && (
                <div className="container mx-auto p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
                        {/* Left Column - Shipment Information */}
                        <div className="space-y-6">
                            {/* Shipment Details */}
                            <Card className="shipment-info shadow-xl">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Package className="w-6 h-6 text-primary" />
                                            </div>
                                            Shipment Details
                                        </CardTitle>
                                        <Badge className={`px-3 py-1 ${getStatusColor(shipment.currentStatus)}`}>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(shipment.currentStatus)}
                                                {getStatusLabel(shipment.currentStatus)}
                                            </div>
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Progress Bar */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>Shipment Progress</span>
                                            <span>{getProgressValue(shipment.currentStatus)}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="progress-bar h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transform origin-left"
                                                style={{ width: `${getProgressValue(shipment.currentStatus)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Shipment Information Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Package className="w-5 h-5 text-blue-600 mt-1" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Product</p>
                                                    <p className="text-gray-600">{shipment.productName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-green-600 mt-1" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Origin</p>
                                                    <p className="text-gray-600">{shipment.origin}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Navigation className="w-5 h-5 text-red-600 mt-1" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Destination</p>
                                                    <p className="text-gray-600">{shipment.destination}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Truck className="w-5 h-5 text-orange-600 mt-1" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Carrier</p>
                                                    <p className="text-gray-600 font-mono text-sm">{shipment.carrier}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Created</p>
                                                    <p className="text-gray-600">{new Date(Number(shipment.createdAt) * 1000).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 bg-yellow-500 rounded-full mt-1" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Deposit</p>
                                                    <p className="text-gray-600">{formatEther(shipment.depositAmount)} ETH</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Interactive Map */}
                            <Card className="map-container shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Globe className="w-6 h-6 text-primary" />
                                        </div>
                                        Shipment Route
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div ref={mapRef} className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
                                        {/* Animated route line */}
                                        <div className="absolute inset-4 flex items-center">
                                            <div className="w-full h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-red-500 relative">
                                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                                                    <div className="map-dot w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                                                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-700">
                                                        {shipment.origin}
                                                    </div>
                                                </div>
                                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                                    <div className="map-dot w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                                                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-red-700">
                                                        {shipment.destination}
                                                    </div>
                                                </div>
                                                {/* Current position */}
                                                <div 
                                                    className="active-location absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                                                    style={{ left: `${getProgressValue(shipment.currentStatus)}%` }}
                                                >
                                                    <div className="w-6 h-6 bg-blue-500 rounded-full shadow-lg flex items-center justify-center">
                                                        <Truck className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-700">
                                                        Current
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Events Timeline */}
                        <div className="space-y-6">
                            <Card className="events-timeline shadow-xl h-full">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Activity className="w-6 h-6 text-primary" />
                                        </div>
                                        Shipment Events
                                    </CardTitle>
                                    <CardDescription>
                                        Real-time tracking events and updates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div ref={timelineRef} className="space-y-4 max-h-[600px] overflow-y-auto">
                                        {events.length > 0 ? (
                                            events.map((event: ShipmentEvent, index: number) => (
                                                <div
                                                    key={index}
                                                    className="event-item relative flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
                                                >
                                                    {/* Timeline line */}
                                                    {index < events.length - 1 && (
                                                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
                                                    )}
                                                    
                                                    {/* Event icon */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                            {getEventIcon(event.eventType)}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Event content */}
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {event.eventType}
                                                            </h4>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(Number(event.timestamp) * 1000).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        
                                                        {event.location && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <MapPin className="w-4 h-4" />
                                                                {event.location}
                                                            </div>
                                                        )}
                                                        
                                                        <div className="text-sm text-gray-500 font-mono">
                                                            Updated by: {event.updatedBy}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Event number */}
                                                    <div className="text-xs font-bold text-gray-400">
                                                        #{events.length - index}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No events found for this shipment.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {(isLoadingShipment || isLoadingEvents) && shipmentCode && (
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-lg font-medium text-gray-600">Loading shipment information...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* No Results State */}
            {!isLoadingShipment && !shipment && shipmentCode && (
                <div className="container mx-auto p-6">
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Shipment Not Found</h3>
                        <p className="text-gray-600 mb-6">
                            We couldn&apos;t find a shipment with code &quot;{shipmentCode}&quot;. 
                            Please check the code and try again.
                        </p>
                        <Button onClick={() => {
                            setShipmentCode("");
                            form.reset();
                        }}>
                            Try Again
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
