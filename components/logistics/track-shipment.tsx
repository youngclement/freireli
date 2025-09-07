"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    useGetShipment,
    useGetShipmentEvents,
    useGetFullTrackingInfo,
    useAddShipmentEvent,
    useAddTransitEvent,
    useAddWarehouseEvent,
    useAddQualityEvent,
    useUpdateLocation
} from "@/hooks/use-logistics";
import { StatusEnum } from "@/lib/contracts";
import { toast } from "sonner";
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
    Plus,
    Loader2
} from "lucide-react";
import { formatEther } from "viem";

const trackingSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
});

const eventSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    location: z.string().min(1, "Location is required"),
    eventType: z.string().min(1, "Event type is required"),
});

const transitEventSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    location: z.string().min(1, "Location is required"),
    note: z.string().min(1, "Note is required"),
});

const simpleEventSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    eventType: z.string().min(1, "Event type is required"),
});

const locationUpdateSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    location: z.string().min(1, "Location is required"),
});

type TrackingFormData = z.infer<typeof trackingSchema>;
type EventFormData = z.infer<typeof eventSchema>;
type TransitEventFormData = z.infer<typeof transitEventSchema>;
type SimpleEventFormData = z.infer<typeof simpleEventSchema>;
type LocationUpdateFormData = z.infer<typeof locationUpdateSchema>;

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
    if (lowerEventType.includes("warehouse")) return "border-orange-200 bg-orange-50";
    if (lowerEventType.includes("quality")) return "border-purple-200 bg-purple-50";
    if (lowerEventType.includes("transit")) return "border-yellow-200 bg-yellow-50";
    if (lowerEventType.includes("delivery")) return "border-green-200 bg-green-50";
    if (lowerEventType.includes("location")) return "border-blue-200 bg-blue-50";
    return "border-gray-200 bg-gray-50";
};

export function TrackShipmentAnimated() {
    const [shipmentCode, setShipmentCode] = useState("");
    const { shipment, isLoading: shipmentLoading, refetch: refetchShipment } = useGetShipment(shipmentCode);
    const { events, refetch: refetchEvents } = useGetShipmentEvents(shipmentCode);

    // Event hooks
    const { addShipmentEvent, isPending: isAddingEvent } = useAddShipmentEvent();
    const { addTransitEvent } = useAddTransitEvent();
    const { addWarehouseEvent } = useAddWarehouseEvent();
    const { addQualityEvent } = useAddQualityEvent();
    const { updateLocation, isPending: isUpdatingLocation } = useUpdateLocation();

    const trackingForm = useForm<TrackingFormData>({
        resolver: zodResolver(trackingSchema),
        defaultValues: { shipmentCode: "" },
    });

    const eventForm = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: { shipmentCode: "", location: "", eventType: "" },
    });

    const transitEventForm = useForm<TransitEventFormData>({
        resolver: zodResolver(transitEventSchema),
        defaultValues: { shipmentCode: "", location: "", note: "" },
    });

    const warehouseEventForm = useForm<SimpleEventFormData>({
        resolver: zodResolver(simpleEventSchema),
        defaultValues: { shipmentCode: "", eventType: "" },
    });

    const qualityEventForm = useForm<SimpleEventFormData>({
        resolver: zodResolver(simpleEventSchema),
        defaultValues: { shipmentCode: "", eventType: "" },
    });

    const locationForm = useForm<LocationUpdateFormData>({
        resolver: zodResolver(locationUpdateSchema),
        defaultValues: { shipmentCode: "", location: "" },
    });

    const onSearch = (data: TrackingFormData) => {
        setShipmentCode(data.shipmentCode);
        refetchShipment();
        refetchEvents();
    };

    const onAddShipmentEvent = async (data: EventFormData) => {
        try {
            await addShipmentEvent(data.shipmentCode, data.location, data.eventType);
            toast.success("Event added successfully!");
            eventForm.reset();
            refetchEvents();
        } catch {
            toast.error("Failed to add event");
        }
    };

    const onAddTransitEvent = async (data: TransitEventFormData) => {
        try {
            await addTransitEvent(data.shipmentCode, data.location, data.note);
            toast.success("Transit event added successfully!");
            transitEventForm.reset();
            refetchEvents();
        } catch {
            toast.error("Failed to add transit event");
        }
    };

    const onAddWarehouseEvent = async (data: SimpleEventFormData) => {
        try {
            await addWarehouseEvent(data.shipmentCode, data.eventType);
            toast.success("Warehouse event added successfully!");
            warehouseEventForm.reset();
            refetchEvents();
        } catch {
            toast.error("Failed to add warehouse event");
        }
    };

    const onAddQualityEvent = async (data: SimpleEventFormData) => {
        try {
            await addQualityEvent(data.shipmentCode, data.eventType);
            toast.success("Quality event added successfully!");
            qualityEventForm.reset();
            refetchEvents();
        } catch {
            toast.error("Failed to add quality event");
        }
    };

    const onUpdateLocation = async (data: LocationUpdateFormData) => {
        try {
            await updateLocation(data.shipmentCode, data.location);
            toast.success("Location updated successfully!");
            locationForm.reset();
            refetchShipment();
        } catch {
            toast.error("Failed to update location");
        }
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

            {/* Shipment Info Section */}
            {shipment && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Main Shipment Info */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Shipment #{shipment.shipmentCode}
                                </CardTitle>
                                <Badge className={`${getStatusColor(shipment.currentStatus)} flex items-center gap-1`}>
                                    {getStatusIcon(shipment.currentStatus)}
                                    {getStatusText(shipment.currentStatus)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Progress</span>
                                    <span>{getProgressValue(shipment.currentStatus)}%</span>
                                </div>
                                <Progress
                                    value={getProgressValue(shipment.currentStatus)}
                                    className="h-2"
                                />
                            </div>

                            {/* Shipment Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Product:</span>
                                        <span>{shipment.productName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Origin:</span>
                                        <span>{shipment.origin}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Destination:</span>
                                        <span>{shipment.destination}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Carrier:</span>
                                        <span className="font-mono text-sm">{shipment.carrier}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Created:</span>
                                        <span>{new Date(Number(shipment.createdAt) * 1000).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Deposit:</span>
                                        <span>{formatEther(shipment.depositAmount)} ETH</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actors Info */}
                            {(shipment.warehouseManager !== "0x0000000000000000000000000000000000000000" ||
                                shipment.qualityInspector !== "0x0000000000000000000000000000000000000000") && (
                                    <div className="border rounded-lg p-4 bg-muted/50">
                                        <h4 className="font-medium mb-3 flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            Assigned Actors
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            {shipment.warehouseManager !== "0x0000000000000000000000000000000000000000" && (
                                                <div>
                                                    <span className="font-medium">Warehouse Manager:</span>
                                                    <div className="font-mono text-xs break-all">{shipment.warehouseManager}</div>
                                                </div>
                                            )}
                                            {shipment.qualityInspector !== "0x0000000000000000000000000000000000000000" && (
                                                <div>
                                                    <span className="font-medium">Quality Inspector:</span>
                                                    <div className="font-mono text-xs break-all">{shipment.qualityInspector}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Events Timeline */}
            {events && events.length > 0 && (
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
                        <div className="space-y-4">
                            {events.map((event, index) => (
                                <div key={index} className={`border rounded-lg p-4 ${getEventColor(event.eventType)}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            {getEventIcon(event.eventType)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">{event.eventType}</h4>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(Number(event.timestamp) * 1000).toLocaleString()}
                                                </span>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    {event.location}
                                                </div>
                                            )}
                                            <div className="text-sm text-muted-foreground font-mono">
                                                By: {event.updatedBy}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Event Management Section (for actors) */}
            {shipment && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Add General Event */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add Event
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...eventForm}>
                                <form onSubmit={eventForm.handleSubmit(onAddShipmentEvent)} className="space-y-4">
                                    <FormField
                                        control={eventForm.control}
                                        name="shipmentCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shipment Code</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="SHIP0001" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={eventForm.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Current location" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={eventForm.control}
                                        name="eventType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Type</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Event description" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isAddingEvent}>
                                        {isAddingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Event"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Update Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Update Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...locationForm}>
                                <form onSubmit={locationForm.handleSubmit(onUpdateLocation)} className="space-y-4">
                                    <FormField
                                        control={locationForm.control}
                                        name="shipmentCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shipment Code</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="SHIP0001" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={locationForm.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Location</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Updated location" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isUpdatingLocation}>
                                        {isUpdatingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Location"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
