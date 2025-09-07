"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
    useGetShipment, 
    useGetShipmentEvents, 
    useGetFullTrackingInfo,
    useGetCarrierStats
} from "@/hooks/use-logistics";
import { StatusEnum, CarrierStats, ShipmentEvent } from "@/lib/contracts";
import { 
    Search, 
    MapPin, 
    Clock, 
    Package, 
    Truck, 
    Building2, 
    ShieldCheck, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Activity,
    Loader2
} from "lucide-react";
import { formatEther } from "viem";

const trackingSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
});

type TrackingFormData = z.infer<typeof trackingSchema>;

const getStatusText = (status: StatusEnum) => {
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
            return "In Transit";
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
        case StatusEnum.Disputed:
        case StatusEnum.Canceled:
            return 0;
        default:
            return 0;
    }
};

const getEventIcon = (eventType: string) => {
    const lowerEventType = eventType.toLowerCase();
    if (lowerEventType.includes("warehouse")) return <Building2 className="w-4 h-4" />;
    if (lowerEventType.includes("quality")) return <ShieldCheck className="w-4 h-4" />;
    if (lowerEventType.includes("transit")) return <Truck className="w-4 h-4" />;
    if (lowerEventType.includes("delivery")) return <CheckCircle className="w-4 h-4" />;
    if (lowerEventType.includes("location")) return <MapPin className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
};

const getEventColor = (eventType: string) => {
    const lowerEventType = eventType.toLowerCase();
    if (lowerEventType.includes("warehouse")) return "border-orange-300 bg-orange-100 dark:border-orange-700 dark:bg-orange-900/30";
    if (lowerEventType.includes("quality")) return "border-purple-300 bg-purple-100 dark:border-purple-700 dark:bg-purple-900/30";
    if (lowerEventType.includes("transit")) return "border-yellow-300 bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/30";
    if (lowerEventType.includes("delivery")) return "border-green-300 bg-green-100 dark:border-green-700 dark:bg-green-900/30";
    if (lowerEventType.includes("location")) return "border-blue-300 bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30";
    return "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800/30";
};

const formatEventType = (eventType: string) => {
    // Convert snake_case to readable text
    const formatted = eventType
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // Custom mappings for better readability
    const mappings: { [key: string]: string } = {
        'Warehouse Confirmed': 'Warehouse Received',
        'Quality Approved': 'Quality Inspected', 
        'Transit Started': 'Transit Started',
        'Location Updated': 'Location Update',
        'Delivery Confirmed': 'Delivered'
    };
    
    return mappings[formatted] || formatted;
};

const truncateAddress = (address: string, prefixLength = 6, suffixLength = 4) => {
    if (!address || address.length <= prefixLength + suffixLength) return address;
    return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

const getRouteIcon = (type: string) => {
    switch (type) {
        case 'origin':
            return <span className="text-blue-500 text-lg">🏠</span>;
        case 'warehouse':
            return <span className="text-orange-500 text-lg">🏭</span>;
        case 'quality':
            return <span className="text-purple-500 text-lg">🛡️</span>;
        case 'transit':
            return <span className="text-yellow-500 text-lg">🚛</span>;
        case 'destination':
            return <span className="text-green-500 text-lg">🎯</span>;
        default:
            return <span className="text-gray-500 text-lg">📍</span>;
    }
};

const getJourneySteps = (events: ShipmentEvent[], origin: string, destination: string) => {
    const steps: Array<{location: string, type: string, completed: boolean, additionalEvents: string[], address?: string}> = [
        { location: origin, type: 'origin', completed: true, additionalEvents: [] }
    ];
    
    // Find warehouse location and events
    const warehouseEvents = events.filter(e => e.eventType.toLowerCase().includes('warehouse'));
    if (warehouseEvents.length > 0) {
        const warehouseLocation = warehouseEvents[0].location;
        const warehouseAddress = warehouseEvents[0].updatedBy;
        const additionalWarehouseEvents = warehouseEvents.slice(1).map(e => formatEventType(e.eventType));
        steps.push({ 
            location: warehouseLocation, 
            type: 'warehouse', 
            completed: true,
            additionalEvents: additionalWarehouseEvents,
            address: warehouseAddress
        });
    }
    
    // Find quality control location and events
    const qualityEvents = events.filter(e => e.eventType.toLowerCase().includes('quality'));
    if (qualityEvents.length > 0) {
        const qualityLocation = qualityEvents[0].location;
        const qualityAddress = qualityEvents[0].updatedBy;
        
        // Get all events at the same quality control location (not just quality events)
        const allQualityLocationEvents = events.filter(e => e.location === qualityLocation);
        // Get additional events (excluding the standard quality events)
        const additionalQualityEvents = allQualityLocationEvents
            .filter(e => !['quality_approved', 'quality_inspected'].includes(e.eventType.toLowerCase()))
            .map(e => formatEventType(e.eventType));
        
        steps.push({ 
            location: qualityLocation, 
            type: 'quality', 
            completed: true,
            additionalEvents: additionalQualityEvents,
            address: qualityAddress
        });
    }
    
    // Find transit locations from events
    const transitEvents = events.filter(e => 
        e.eventType.toLowerCase().includes('transit') || 
        e.eventType.toLowerCase().includes('location')
    );
    
    transitEvents.forEach(event => {
        if (event.location && event.location !== origin && event.location !== destination) {
            // Check if this location already exists
            const existingStepIndex = steps.findIndex(step => step.location === event.location);
            if (existingStepIndex === -1) {
                steps.push({ 
                    location: event.location, 
                    type: 'transit', 
                    completed: true,
                    additionalEvents: [],
                    address: event.updatedBy
                });
            }
        }
    });
    
    // Add destination
    const deliveryEvent = events.find(e => e.eventType.toLowerCase().includes('delivery'));
    steps.push({ 
        location: destination, 
        type: 'destination', 
        completed: !!deliveryEvent,
        additionalEvents: [],
        address: deliveryEvent?.updatedBy
    });
    
    return steps;
};

export function TrackShipmentAnimated() {
    const [shipmentCode, setShipmentCode] = useState("");
    const { shipment, isLoading: shipmentLoading, refetch: refetchShipment } = useGetShipment(shipmentCode);
    const { events, refetch: refetchEvents } = useGetShipmentEvents(shipmentCode);
    
    // Get carrier stats
    const { data: carrierStats } = useGetCarrierStats(shipment?.carrier);

    const trackingForm = useForm<TrackingFormData>({
        resolver: zodResolver(trackingSchema),
        defaultValues: { shipmentCode: "" },
    });

    const onSearch = (data: TrackingFormData) => {
        setShipmentCode(data.shipmentCode);
        refetchShipment();
        refetchEvents();
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4">
            {/* Search Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Track Your Shipment
                    </CardTitle>
                    <CardDescription>
                        Enter your shipment code to track its progress and view detailed information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...trackingForm}>
                        <form onSubmit={trackingForm.handleSubmit(onSearch)} className="flex gap-4">
                            <FormField
                                control={trackingForm.control}
                                name="shipmentCode"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter shipment code (e.g. SHIP0001)" 
                                                {...field} 
                                                className="text-lg"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" size="lg" disabled={shipmentLoading}>
                                {shipmentLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                                Track
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Top Info Section with Status and Progress */}
            {shipment && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Package className="w-6 h-6" />
                                <div>
                                    <h2 className="text-xl font-bold">Shipment #{shipment.shipmentCode}</h2>
                                    <p className="text-sm text-muted-foreground">{shipment.productName}</p>
                                </div>
                            </div>
                            <Badge className={`${getStatusColor(shipment.currentStatus)} flex items-center gap-1`}>
                                {getStatusIcon(shipment.currentStatus)}
                                {getStatusText(shipment.currentStatus)}
                            </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Progress</span>
                                <span>{getProgressValue(shipment.currentStatus)}%</span>
                            </div>
                            <Progress 
                                value={getProgressValue(shipment.currentStatus)} 
                                className="h-3"
                            />
                        </div>

                        {/* Journey Route */}
                        <div className="mt-6">
                            <h3 className="font-medium mb-3 flex items-center gap-2">
                                <span className="text-lg">🛣️</span>
                                Shipping Route
                            </h3>
                            {events && events.length > 0 ? (
                                <div className="space-y-3">
                                    {getJourneySteps(events, shipment.origin, shipment.destination).map((step, index) => (
                                        <div key={index}>
                                            {step.address ? (
                                                // Layout with address (vertical)
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1">
                                                        {getRouteIcon(step.type)}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {step.location}
                                                            {step.type === 'warehouse' && ` (Warehouse${step.additionalEvents.length > 0 ? `, ${step.additionalEvents.join(', ')}` : ''})`}
                                                            {step.type === 'quality' && ` (Quality Control${step.additionalEvents.length > 0 ? `, ${step.additionalEvents.join(', ')}` : ''})`}
                                                            {step.type === 'origin' && ' (Origin)'}
                                                            {step.type === 'destination' && ' (Destination)'}
                                                            {step.type === 'transit' && ` (Transit${step.additionalEvents.length > 0 ? `, ${step.additionalEvents.join(', ')}` : ''})`}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground font-mono">
                                                            {step.address}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Layout without address (horizontal)
                                                <div className="flex items-center gap-3">
                                                    {getRouteIcon(step.type)}
                                                    <span className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        {step.location}
                                                        {step.type === 'warehouse' && ` (Warehouse${step.additionalEvents.length > 0 ? `, ${step.additionalEvents.join(', ')}` : ''})`}
                                                        {step.type === 'quality' && ` (Quality Control${step.additionalEvents.length > 0 ? `, ${step.additionalEvents.join(', ')}` : ''})`}
                                                        {step.type === 'origin' && ' (Origin)'}
                                                        {step.type === 'destination' && ' (Destination)'}
                                                        {step.type === 'transit' && ` (Transit${step.additionalEvents.length > 0 ? `, ${step.additionalEvents.join(', ')}` : ''})`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-sm">{shipment.origin} (Origin)</span>
                                    <div className="w-px h-4 bg-gray-300" />
                                    <div className="w-3 h-3 rounded-full bg-gray-300 border-2 border-gray-400" />
                                    <span className="text-sm text-muted-foreground">{shipment.destination} (Destination)</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Content - Two Column Layout */}
            {shipment && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Shipment Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Shipment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Product and Basic Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📦</span>
                                    <span className="font-medium">Product:</span>
                                    <span>{shipment.productName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🚛</span>
                                    <span className="font-medium">Carrier:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm">{truncateAddress(shipment.carrier)}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            (<span className="text-yellow-500">⭐</span>
                                            {carrierStats && (carrierStats as CarrierStats).ratingCount > 0 
                                                ? `${(Number((carrierStats as CarrierStats).totalRatingPoints) / Number((carrierStats as CarrierStats).ratingCount)).toFixed(1)}/5` 
                                                : '0/5'} pts)
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📅</span>
                                    <span className="font-medium">Created:</span>
                                    <span>{new Date(Number(shipment.createdAt) * 1000).toLocaleString()}</span>
                                </div>
                            </div>

                            <Separator />

                            {/* Financial Info */}
                            <div className="space-y-3">
                                <h4 className="font-medium">💰 Financial Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Deposit Amount:</span>
                                        <span className="font-mono">{formatEther(shipment.depositAmount)} ETH</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping Fee:</span>
                                        <span className="font-mono">{formatEther(shipment.shippingFee)} ETH</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actors Info */}
                            {(shipment.warehouseManager !== "0x0000000000000000000000000000000000000000" || 
                              shipment.qualityInspector !== "0x0000000000000000000000000000000000000000") && (
                                <>
                                    <Separator />
                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <span className="text-lg">👥</span>
                                            Assigned Actors
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            {shipment.warehouseManager !== "0x0000000000000000000000000000000000000000" && (
                                                <div>
                                                    <span className="font-medium">🏭 Warehouse Manager:</span>
                                                    <div className="font-mono text-xs mt-1 p-2 bg-muted rounded break-all">
                                                        {shipment.warehouseManager}
                                                    </div>
                                                </div>
                                            )}
                                            {shipment.qualityInspector !== "0x0000000000000000000000000000000000000000" && (
                                                <div>
                                                    <span className="font-medium">🛡️ Quality Inspector:</span>
                                                    <div className="font-mono text-xs mt-1 p-2 bg-muted rounded break-all">
                                                        {shipment.qualityInspector}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Rating and Feedback */}
                            {shipment.rating > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <h4 className="font-medium">⭐ Rating & Feedback</h4>
                                        <div className="text-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span>Rating:</span>
                                                <span className="font-bold">{shipment.rating}/5</span>
                                            </div>
                                            {shipment.feedback && (
                                                <div>
                                                    <span className="font-medium">Feedback:</span>
                                                    <p className="text-muted-foreground mt-1">{shipment.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Column - Events Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Shipment Timeline
                            </CardTitle>
                            <CardDescription>
                                Detailed tracking events for this shipment
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {events && events.length > 0 ? (
                                <div className="space-y-4">
                                    {events.map((event, index) => (
                                        <div key={index} className={`border rounded-lg p-4 ${getEventColor(event.eventType)}`}>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    {getEventIcon(event.eventType)}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-sm">{formatEventType(event.eventType)}</h4>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(Number(event.timestamp) * 1000).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {event.location && (
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <MapPin className="w-3 h-3" />
                                                            {event.location}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-muted-foreground font-mono">
                                                        By: {truncateAddress(event.updatedBy)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No tracking events found for this shipment.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
