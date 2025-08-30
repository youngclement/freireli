"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetShipment, useGetShipmentEvents } from "@/hooks/use-logistics";
import { StatusEnum } from "@/lib/contracts";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { AlertCircle, Calendar, CheckCircle2, Clock, Copy, MapPin, Package, RefreshCw, Search, Truck, User, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EscrowStatus } from "./escrow-status";
import { gsap } from "gsap";

const getStatusText = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Pending:
            return "Pending";
        case StatusEnum.InTransit:
            return "In Transit";
        case StatusEnum.Delivered:
            return "Delivered";
        case StatusEnum.Canceled:
            return "Canceled";
        default:
            return "Undefined";
    }
};

const getStatusColor = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Pending:
            return "bg-blue-500 hover:bg-blue-600";
        case StatusEnum.InTransit:
            return "bg-yellow-500 hover:bg-yellow-600";
        case StatusEnum.Delivered:
            return "bg-green-500 hover:bg-green-600";
        case StatusEnum.Canceled:
            return "bg-red-500 hover:bg-red-600";
        default:
            return "bg-gray-500 hover:bg-gray-600";
    }
};

const getStatusIcon = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Pending:
            return <Package className="w-4 h-4" />;
        case StatusEnum.InTransit:
            return <Truck className="w-4 h-4" />;
        case StatusEnum.Delivered:
            return <CheckCircle2 className="w-4 h-4" />;
        case StatusEnum.Canceled:
            return <XCircle className="w-4 h-4" />;
        default:
            return <AlertCircle className="w-4 h-4" />;
    }
};

const getEventIcon = (eventType: string) => {
    const type = eventType.toLowerCase();
    if (type.includes('picked') || type.includes('pickup')) return <Package className="w-4 h-4" />;
    if (type.includes('transit') || type.includes('in')) return <Truck className="w-4 h-4" />;
    if (type.includes('arrived') || type.includes('hub') || type.includes('warehouse')) return <MapPin className="w-4 h-4" />;
    if (type.includes('out') || type.includes('delivery')) return <Truck className="w-4 h-4" />;
    if (type.includes('complete') || type.includes('delivered')) return <CheckCircle2 className="w-4 h-4" />;
    if (type.includes('fail') || type.includes('return')) return <XCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
};

const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
};

export function TrackShipmentAnimated() {
    const [shipmentCode, setShipmentCode] = useState("");
    const [searchCode, setSearchCode] = useState("");
    const timelineRef = useRef<HTMLDivElement>(null);

    const { shipment, isLoading: isLoadingShipment, refetch: refetchShipment } = useGetShipment(searchCode);
    const { events, isLoading: isLoadingEvents, refetch: refetchEvents } = useGetShipmentEvents(searchCode);

    const handleSearch = () => {
        if (shipmentCode.trim()) {
            setSearchCode(shipmentCode.trim());
        }
    };

    const handleRefresh = () => {
        refetchShipment();
        refetchEvents();
    };

    // GSAP animation for the timeline
    useEffect(() => {
        if (!events || events.length === 0 || !timelineRef.current) return;

        // Clear any existing animations
        gsap.killTweensOf(".timeline-dot, .timeline-line, .timeline-event");

        const timeline = gsap.timeline({
            defaults: { duration: 0.5, ease: "power2.out" }
        });

        // Animate dots
        timeline.fromTo(
            ".timeline-dot",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.2 }
        );

        // Animate lines
        timeline.fromTo(
            ".timeline-line",
            { height: 0, opacity: 0 },
            { height: "100%", opacity: 1, stagger: 0.2 },
            "-=0.8"
        );

        // Animate event cards
        timeline.fromTo(
            ".timeline-event",
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.2 },
            "-=1"
        );

    }, [events]);

    return (
        <div className="space-y-8">
            {/* Search Bar at the Top */}
            <Card className="border-2 shadow-lg">
                <CardContent className="pt-6 pb-6">
                    <div className="flex gap-3">
                        <Input
                            placeholder="Enter shipment code (e.g. SH-2025-001)"
                            value={shipmentCode}
                            onChange={(e) => setShipmentCode(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-12 text-base"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={!shipmentCode.trim()}
                            className="h-12 px-8 text-base font-semibold"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                    </div>
                    {searchCode && !shipment && !isLoadingShipment && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-700 dark:text-red-300 text-sm">
                                <AlertCircle className="w-4 h-4 inline mr-1" />
                                Shipment not found with code: <strong>{searchCode}</strong>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Loading State */}
            {searchCode && isLoadingShipment && (
                <Card>
                    <CardContent className="p-8">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-lg font-medium">Loading shipment information...</p>
                            <p className="text-sm text-muted-foreground">Please wait a moment</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Two-column layout for Shipment Info and Timeline */}
            {searchCode && shipment && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Shipment Information */}
                    <div className="space-y-6">
                        {/* Status Overview */}
                        <Card className="border-2 shadow-lg h-full">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <Package className="h-5 w-5 text-primary" />
                                            Shipment: {shipment.shipmentCode}
                                        </CardTitle>
                                        <CardDescription className="text-sm mt-2">
                                            Created at: {format(new Date(Number(shipment.createdAt) * 1000), 'PPpp', { locale: enUS })}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`${getStatusColor(shipment.currentStatus)} text-white px-3 py-1 text-sm font-medium`}>
                                            {getStatusIcon(shipment.currentStatus)}
                                            <span className="ml-2">{getStatusText(shipment.currentStatus)}</span>
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRefresh}
                                            className="h-8"
                                        >
                                            <RefreshCw className="w-3 h-3 mr-2" />
                                            Refresh
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Shipping Progress</span>
                                        <span className="text-sm text-muted-foreground">
                                            {shipment.currentStatus === StatusEnum.Pending && "0%"}
                                            {shipment.currentStatus === StatusEnum.InTransit && "50%"}
                                            {shipment.currentStatus === StatusEnum.Delivered && "100%"}
                                            {shipment.currentStatus === StatusEnum.Canceled && "Canceled"}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${shipment.currentStatus === StatusEnum.Pending ? 'w-1/4 bg-blue-500' :
                                                shipment.currentStatus === StatusEnum.InTransit ? 'w-3/4 bg-yellow-500' :
                                                    shipment.currentStatus === StatusEnum.Delivered ? 'w-full bg-green-500' :
                                                        'w-0 bg-red-500'
                                                }`}>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipment Information */}
                                <div className="space-y-5">
                                    <h3 className="text-md font-semibold border-b pb-2">Product Information</h3>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                            <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Product Name</p>
                                                <p className="text-sm font-medium mt-1">{shipment.productName}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Origin</p>
                                                    <p className="text-sm font-medium mt-1">{shipment.origin}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                                <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Destination</p>
                                                    <p className="text-sm font-medium mt-1">{shipment.destination}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Blockchain Information */}
                                    <h3 className="text-md font-semibold border-b pb-2 pt-2">Blockchain Information</h3>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                            <User className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Creator</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs font-mono bg-background p-1 rounded border flex-1 truncate">
                                                        {shipment.creator}
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => copyToClipboard(shipment.creator, "creator address")}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                            <Truck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Carrier</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs font-mono bg-background p-1 rounded border flex-1 truncate">
                                                        {shipment.carrier}
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => copyToClipboard(shipment.carrier, "carrier address")}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Escrow Status */}
                                    <EscrowStatus shipmentCode={shipment.shipmentCode} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Animated Timeline */}
                    <div>
                        <Card className="border-2 shadow-lg h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Shipping History
                                </CardTitle>
                                <CardDescription>
                                    Timeline of shipment events with real-time tracking
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoadingEvents ? (
                                    <div className="text-center py-12">
                                        <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto mb-4" />
                                        <p className="text-lg font-medium">Loading shipping history...</p>
                                    </div>
                                ) : events && events.length > 0 ? (
                                    <div className="space-y-0" ref={timelineRef}>
                                        {events.map((event, index) => (
                                            <div key={index} className="flex gap-4 relative">
                                                {/* Timeline dot and line */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10 timeline-dot ${getEventIcon(event.eventType) ? 'flex items-center justify-center' : ''}`}>
                                                        {getEventIcon(event.eventType) && (
                                                            <div className="text-white scale-50">{getEventIcon(event.eventType)}</div>
                                                        )}
                                                    </div>
                                                    {index < events.length - 1 && (
                                                        <div className="w-px h-24 bg-primary/50 mt-1 timeline-line"></div>
                                                    )}
                                                </div>

                                                {/* Event content */}
                                                <div className="flex-1 pb-6 timeline-event">
                                                    <div className="bg-muted/30 rounded-lg p-3 border hover:shadow-md transition-shadow">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-semibold text-sm">{event.eventType}</h4>
                                                            <div className="text-right">
                                                                <div className="text-xs font-medium">
                                                                    {format(new Date(Number(event.timestamp) * 1000), 'dd/MM/yyyy', { locale: enUS })}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {format(new Date(Number(event.timestamp) * 1000), 'HH:mm:ss', { locale: enUS })}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                                            <span className="text-xs">{event.location}</span>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <User className="w-3 h-3" />
                                                                <span>Updated by:</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-xs font-mono bg-background px-1 py-0.5 rounded border">
                                                                    {event.updatedBy.slice(0, 6)}...{event.updatedBy.slice(-4)}
                                                                </span>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-5 w-5 p-0"
                                                                    onClick={() => copyToClipboard(event.updatedBy, "updater address")}
                                                                >
                                                                    <Copy className="w-2 h-2" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-lg font-medium mb-2">No Events Yet</p>
                                        <p className="text-muted-foreground">
                                            No events have been recorded for this shipment yet. Please check again later.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Quick Tips */}
            {!searchCode && (
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            Usage Tips
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>Shipment codes usually follow the format: SH-2025-XXX</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>Real-time information updates from blockchain</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>Click &ldquo;Refresh&rdquo; to update the latest information</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>You can copy wallet addresses by clicking the copy icon</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

