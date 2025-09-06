"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
    useAddShipmentEvent,
    useAddTransitEvent,
    useAddWarehouseEvent,
    useAddQualityEvent,
    useUpdateLocation,
    useCancelShipment
} from "@/hooks/use-logistics";
import { toast } from "sonner";
import { 
    Building2, 
    ShieldCheck, 
    Truck, 
    MapPin, 
    Plus,
    Loader2,
    AlertTriangle,
    Activity
} from "lucide-react";

const generalEventSchema = z.object({
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

const cancelShipmentSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    reason: z.string().min(1, "Reason is required"),
});

type GeneralEventFormData = z.infer<typeof generalEventSchema>;
type TransitEventFormData = z.infer<typeof transitEventSchema>;
type SimpleEventFormData = z.infer<typeof simpleEventSchema>;
type LocationUpdateFormData = z.infer<typeof locationUpdateSchema>;
type CancelShipmentFormData = z.infer<typeof cancelShipmentSchema>;

export function EventManagement() {
    const { addShipmentEvent, isPending: isAddingEvent } = useAddShipmentEvent();
    const { addTransitEvent, isPending: isAddingTransitEvent } = useAddTransitEvent();
    const { addWarehouseEvent, isPending: isAddingWarehouseEvent } = useAddWarehouseEvent();
    const { addQualityEvent, isPending: isAddingQualityEvent } = useAddQualityEvent();
    const { updateLocation, isPending: isUpdatingLocation } = useUpdateLocation();
    const { cancelShipment, isPending: isCancelingShipment } = useCancelShipment();

    const generalEventForm = useForm<GeneralEventFormData>({
        resolver: zodResolver(generalEventSchema),
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

    const cancelForm = useForm<CancelShipmentFormData>({
        resolver: zodResolver(cancelShipmentSchema),
        defaultValues: { shipmentCode: "", reason: "" },
    });

    const onAddGeneralEvent = async (data: GeneralEventFormData) => {
        try {
            await addShipmentEvent(data.shipmentCode, data.location, data.eventType);
            toast.success("Event added successfully!");
            generalEventForm.reset();
        } catch (error) {
            toast.error("Failed to add event");
        }
    };

    const onAddTransitEvent = async (data: TransitEventFormData) => {
        try {
            await addTransitEvent(data.shipmentCode, data.location, data.note);
            toast.success("Transit event added successfully!");
            transitEventForm.reset();
        } catch (error) {
            toast.error("Failed to add transit event");
        }
    };

    const onAddWarehouseEvent = async (data: SimpleEventFormData) => {
        try {
            await addWarehouseEvent(data.shipmentCode, data.eventType);
            toast.success("Warehouse event added successfully!");
            warehouseEventForm.reset();
        } catch (error) {
            toast.error("Failed to add warehouse event");
        }
    };

    const onAddQualityEvent = async (data: SimpleEventFormData) => {
        try {
            await addQualityEvent(data.shipmentCode, data.eventType);
            toast.success("Quality event added successfully!");
            qualityEventForm.reset();
        } catch (error) {
            toast.error("Failed to add quality event");
        }
    };

    const onUpdateLocation = async (data: LocationUpdateFormData) => {
        try {
            await updateLocation(data.shipmentCode, data.location);
            toast.success("Location updated successfully!");
            locationForm.reset();
        } catch (error) {
            toast.error("Failed to update location");
        }
    };

    const onCancelShipment = async (data: CancelShipmentFormData) => {
        try {
            await cancelShipment(data.shipmentCode, data.reason);
            toast.success("Shipment canceled successfully!");
            cancelForm.reset();
        } catch (error) {
            toast.error("Failed to cancel shipment");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Event Management
                    </CardTitle>
                    <CardDescription>
                        Add events and updates to shipments based on your role
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="transit">Transit</TabsTrigger>
                            <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
                            <TabsTrigger value="quality">Quality</TabsTrigger>
                            <TabsTrigger value="location">Location</TabsTrigger>
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                        </TabsList>

                        {/* General Event */}
                        <TabsContent value="general" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add General Event
                                    </CardTitle>
                                    <CardDescription>
                                        Add a general tracking event with location and description
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...generalEventForm}>
                                        <form onSubmit={generalEventForm.handleSubmit(onAddGeneralEvent)} className="space-y-4">
                                            <FormField
                                                control={generalEventForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g. SHIP0001" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={generalEventForm.control}
                                                name="location"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            Location
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Current location" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={generalEventForm.control}
                                                name="eventType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Event Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="Describe what happened..." />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full" disabled={isAddingEvent}>
                                                {isAddingEvent ? (
                                                    <>
                                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                        Adding Event...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="mr-2 w-4 h-4" />
                                                        Add Event
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Transit Event */}
                        <TabsContent value="transit" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-yellow-600" />
                                        Add Transit Event
                                    </CardTitle>
                                    <CardDescription>
                                        <Badge variant="outline" className="mr-2">Carrier Only</Badge>
                                        Record movement and updates during transportation
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...transitEventForm}>
                                        <form onSubmit={transitEventForm.handleSubmit(onAddTransitEvent)} className="space-y-4">
                                            <FormField
                                                control={transitEventForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g. SHIP0001" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={transitEventForm.control}
                                                name="location"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            Current Location
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g. Highway A1, Mile 45" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={transitEventForm.control}
                                                name="note"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Transit Note</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="Transit update details..." />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full" disabled={isAddingTransitEvent}>
                                                {isAddingTransitEvent ? (
                                                    <>
                                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                        Adding Transit Event...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Truck className="mr-2 w-4 h-4" />
                                                        Add Transit Event
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Warehouse Event */}
                        <TabsContent value="warehouse" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-orange-600" />
                                        Add Warehouse Event
                                    </CardTitle>
                                    <CardDescription>
                                        <Badge variant="outline" className="mr-2">Warehouse Manager Only</Badge>
                                        Record warehouse activities and status updates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...warehouseEventForm}>
                                        <form onSubmit={warehouseEventForm.handleSubmit(onAddWarehouseEvent)} className="space-y-4">
                                            <FormField
                                                control={warehouseEventForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g. SHIP0001" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={warehouseEventForm.control}
                                                name="eventType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Warehouse Event</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="e.g. Package received and stored in section A3" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full" disabled={isAddingWarehouseEvent}>
                                                {isAddingWarehouseEvent ? (
                                                    <>
                                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                        Adding Warehouse Event...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Building2 className="mr-2 w-4 h-4" />
                                                        Add Warehouse Event
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Quality Event */}
                        <TabsContent value="quality" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                                        Add Quality Event
                                    </CardTitle>
                                    <CardDescription>
                                        <Badge variant="outline" className="mr-2">Quality Inspector Only</Badge>
                                        Record quality control activities and inspections
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...qualityEventForm}>
                                        <form onSubmit={qualityEventForm.handleSubmit(onAddQualityEvent)} className="space-y-4">
                                            <FormField
                                                control={qualityEventForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g. SHIP0001" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={qualityEventForm.control}
                                                name="eventType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Quality Event</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="e.g. Quality inspection completed - all items in good condition" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full" disabled={isAddingQualityEvent}>
                                                {isAddingQualityEvent ? (
                                                    <>
                                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                        Adding Quality Event...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldCheck className="mr-2 w-4 h-4" />
                                                        Add Quality Event
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Location Update */}
                        <TabsContent value="location" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        Update Location
                                    </CardTitle>
                                    <CardDescription>
                                        Update the current location of a shipment (available to all actors)
                                    </CardDescription>
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
                                                            <Input {...field} placeholder="e.g. SHIP0001" />
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
                                                            <Input {...field} placeholder="e.g. Los Angeles Distribution Center" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full" disabled={isUpdatingLocation}>
                                                {isUpdatingLocation ? (
                                                    <>
                                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                        Updating Location...
                                                    </>
                                                ) : (
                                                    <>
                                                        <MapPin className="mr-2 w-4 h-4" />
                                                        Update Location
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Admin Actions */}
                        <TabsContent value="admin" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                        Cancel Shipment
                                    </CardTitle>
                                    <CardDescription>
                                        <Badge variant="destructive" className="mr-2">Admin Only</Badge>
                                        Cancel a shipment and refund the deposit to the creator
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...cancelForm}>
                                        <form onSubmit={cancelForm.handleSubmit(onCancelShipment)} className="space-y-4">
                                            <FormField
                                                control={cancelForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g. SHIP0001" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={cancelForm.control}
                                                name="reason"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Cancellation Reason</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="Reason for canceling this shipment..." />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" variant="destructive" className="w-full" disabled={isCancelingShipment}>
                                                {isCancelingShipment ? (
                                                    <>
                                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                        Canceling Shipment...
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertTriangle className="mr-2 w-4 h-4" />
                                                        Cancel Shipment
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
