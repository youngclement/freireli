"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
    useUpdateShipment, 
    useGetShipment, 
    useStartTransit, 
    useWarehouseConfirm,
    useQualityApprove,
    useConfirmDelivery, 
    useSetActors,
    useSetWarehouseManager,
    useSetQualityInspector,
    useCancelShipment,
    useAddShipmentEvent,
    useAddTransitEvent,
    useAddWarehouseEvent,
    useAddQualityEvent,
    useUpdateLocation,
    useRateOrDispute,
    useResolveDispute
} from "@/hooks/use-logistics";
import { StatusEnum } from "@/lib/contracts";
import { toast } from "sonner";
import { 
    Settings, 
    Edit, 
    CheckCircle2, 
    MapPin, 
    Loader2, 
    Users, 
    Truck, 
    Building2, 
    ShieldCheck, 
    Plus,
    Activity,
    AlertTriangle,
    Star,
    Gavel
} from "lucide-react";

// Schemas
const updateShipmentSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    location: z.string().min(1, "Location is required"),
    newStatus: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
});

const setActorsSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    manager: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid warehouse manager address"),
    inspector: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid quality inspector address"),
});

const simpleActionSchema = z.object({
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

const cancelShipmentSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    reason: z.string().min(1, "Reason is required"),
});

const rateDisputeSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    rating: z.number().min(1).max(5),
    feedback: z.string().min(1, "Feedback is required"),
    isDispute: z.boolean(),
});

const resolveDisputeSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    favorCreator: z.boolean(),
});

const singleActorSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
});

// Types
type UpdateShipmentFormData = z.infer<typeof updateShipmentSchema>;
type SetActorsFormData = z.infer<typeof setActorsSchema>;
type SimpleActionFormData = z.infer<typeof simpleActionSchema>;
type EventFormData = z.infer<typeof eventSchema>;
type TransitEventFormData = z.infer<typeof transitEventSchema>;
type SimpleEventFormData = z.infer<typeof simpleEventSchema>;
type LocationUpdateFormData = z.infer<typeof locationUpdateSchema>;
type CancelShipmentFormData = z.infer<typeof cancelShipmentSchema>;
type RateDisputeFormData = z.infer<typeof rateDisputeSchema>;
type ResolveDisputeFormData = z.infer<typeof resolveDisputeSchema>;
type SingleActorFormData = z.infer<typeof singleActorSchema>;

export function LogisticsManagement() {
    // All hooks
    const { updateShipment, isPending: isUpdatingShipment, isConfirming: isConfirmingUpdate, isConfirmed: isUpdateConfirmed, error: updateError } = useUpdateShipment();
    const { startTransit, isPending: isStartingTransit, isConfirming: isConfirmingTransit, isConfirmed: isTransitConfirmed, error: transitError } = useStartTransit();
    const { warehouseConfirm, isPending: isWarehouseConfirming, isConfirming: isConfirmingWarehouse, isConfirmed: isWarehouseConfirmed, error: warehouseError } = useWarehouseConfirm();
    const { qualityApprove, isPending: isQualityApproving, isConfirming: isConfirmingQuality, isConfirmed: isQualityApproved, error: qualityError } = useQualityApprove();
    const { confirmDelivery, isPending: isConfirmingDelivery, isConfirming: isConfirmingDeliveryTx, isConfirmed: isDeliveryConfirmed, error: deliveryError } = useConfirmDelivery();
    const { setActors, isPending: isSettingActors, isConfirming: isConfirmingActors, isConfirmed: isActorsConfirmed, error: actorsError } = useSetActors();
    const { setWarehouseManager, isPending: isSettingWarehouseManager } = useSetWarehouseManager();
    const { setQualityInspector, isPending: isSettingQualityInspector } = useSetQualityInspector();
    const { cancelShipment, isPending: isCancelingShipment } = useCancelShipment();
    const { addShipmentEvent, isPending: isAddingEvent } = useAddShipmentEvent();
    const { addTransitEvent, isPending: isAddingTransitEvent } = useAddTransitEvent();
    const { addWarehouseEvent, isPending: isAddingWarehouseEvent } = useAddWarehouseEvent();
    const { addQualityEvent, isPending: isAddingQualityEvent } = useAddQualityEvent();
    const { updateLocation, isPending: isUpdatingLocation } = useUpdateLocation();
    const { rateOrDispute, isPending: isRatingOrDisputing } = useRateOrDispute();
    const { resolveDispute, isPending: isResolvingDispute } = useResolveDispute();

    // State
    const [currentShipmentCode, setCurrentShipmentCode] = useState("");
    const { shipment, isError: shipmentError, isLoading: shipmentLoading, refetch: refetchShipment } = useGetShipment(currentShipmentCode);

    // All forms
    const updateForm = useForm<UpdateShipmentFormData>({
        resolver: zodResolver(updateShipmentSchema),
        defaultValues: { shipmentCode: "", location: "", newStatus: "0" },
    });

    const actorsForm = useForm<SetActorsFormData>({
        resolver: zodResolver(setActorsSchema),
        defaultValues: { shipmentCode: "", manager: "", inspector: "" },
    });

    const warehouseForm = useForm<SimpleActionFormData>({
        resolver: zodResolver(simpleActionSchema),
        defaultValues: { shipmentCode: "" },
    });

    const qualityForm = useForm<SimpleActionFormData>({
        resolver: zodResolver(simpleActionSchema),
        defaultValues: { shipmentCode: "" },
    });

    const transitForm = useForm<SimpleActionFormData>({
        resolver: zodResolver(simpleActionSchema),
        defaultValues: { shipmentCode: "" },
    });

    const deliveryForm = useForm<SimpleActionFormData>({
        resolver: zodResolver(simpleActionSchema),
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

    const cancelForm = useForm<CancelShipmentFormData>({
        resolver: zodResolver(cancelShipmentSchema),
        defaultValues: { shipmentCode: "", reason: "" },
    });

    const rateForm = useForm<RateDisputeFormData>({
        resolver: zodResolver(rateDisputeSchema),
        defaultValues: { shipmentCode: "", rating: 5, feedback: "", isDispute: false },
    });

    const resolveForm = useForm<ResolveDisputeFormData>({
        resolver: zodResolver(resolveDisputeSchema),
        defaultValues: { shipmentCode: "", favorCreator: false },
    });

    const warehouseManagerForm = useForm<SingleActorFormData>({
        resolver: zodResolver(singleActorSchema),
        defaultValues: { shipmentCode: "", address: "" },
    });

    const qualityInspectorForm = useForm<SingleActorFormData>({
        resolver: zodResolver(singleActorSchema),
        defaultValues: { shipmentCode: "", address: "" },
    });

    // Action handlers
    const onUpdateShipment = async (data: UpdateShipmentFormData) => {
        try {
            updateShipment(data.shipmentCode, data.location, parseInt(data.newStatus));
            toast.success(`Updating shipment ${data.shipmentCode}...`);
        } catch (error) {
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onSetActors = async (data: SetActorsFormData) => {
        try {
            setActors(data.shipmentCode, data.manager, data.inspector);
            toast.success(`Setting actors for shipment ${data.shipmentCode}...`);
        } catch (error) {
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onWarehouseConfirm = async (data: SimpleActionFormData) => {
        try {
            warehouseConfirm(data.shipmentCode);
            toast.success(`Warehouse confirming shipment ${data.shipmentCode}...`);
        } catch (error) {
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onQualityApprove = async (data: SimpleActionFormData) => {
        try {
            qualityApprove(data.shipmentCode);
            toast.success(`Quality approving shipment ${data.shipmentCode}...`);
        } catch (error) {
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onStartTransit = async (data: SimpleActionFormData) => {
        try {
            startTransit(data.shipmentCode);
            toast.success(`Starting transit for shipment ${data.shipmentCode}...`);
        } catch (error) {
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onConfirmDelivery = async (data: SimpleActionFormData) => {
        try {
            confirmDelivery(data.shipmentCode);
            toast.success(`Confirming delivery for shipment ${data.shipmentCode}...`);
        } catch (error) {
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onAddEvent = async (data: EventFormData) => {
        try {
            await addShipmentEvent(data.shipmentCode, data.location, data.eventType);
            toast.success("Event added successfully!");
            eventForm.reset();
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

    const onRateOrDispute = async (data: RateDisputeFormData) => {
        try {
            await rateOrDispute(data.shipmentCode, data.rating, data.feedback, data.isDispute);
            toast.success(data.isDispute ? "Dispute raised successfully!" : "Rating submitted successfully!");
            rateForm.reset();
        } catch (error) {
            toast.error("Failed to submit rating/dispute");
        }
    };

    const onResolveDispute = async (data: ResolveDisputeFormData) => {
        try {
            await resolveDispute(data.shipmentCode, data.favorCreator);
            toast.success("Dispute resolved successfully!");
            resolveForm.reset();
        } catch (error) {
            toast.error("Failed to resolve dispute");
        }
    };

    const onSetWarehouseManager = async (data: SingleActorFormData) => {
        try {
            await setWarehouseManager(data.shipmentCode, data.address);
            toast.success("Warehouse manager set successfully!");
            warehouseManagerForm.reset();
        } catch (error) {
            toast.error("Failed to set warehouse manager");
        }
    };

    const onSetQualityInspector = async (data: SingleActorFormData) => {
        try {
            await setQualityInspector(data.shipmentCode, data.address);
            toast.success("Quality inspector set successfully!");
            qualityInspectorForm.reset();
        } catch (error) {
            toast.error("Failed to set quality inspector");
        }
    };

    // Success handlers
    useEffect(() => {
        if (isUpdateConfirmed) {
            updateForm.reset();
            toast.success("Shipment updated successfully!");
        }
    }, [isUpdateConfirmed, updateForm]);

    useEffect(() => {
        if (isActorsConfirmed) {
            actorsForm.reset();
            toast.success("Actors set successfully!");
        }
    }, [isActorsConfirmed, actorsForm]);

    useEffect(() => {
        if (isWarehouseConfirmed) {
            warehouseForm.reset();
            toast.success("Warehouse confirmed successfully!");
        }
    }, [isWarehouseConfirmed, warehouseForm]);

    useEffect(() => {
        if (isQualityApproved) {
            qualityForm.reset();
            toast.success("Quality approved successfully!");
        }
    }, [isQualityApproved, qualityForm]);

    useEffect(() => {
        if (isTransitConfirmed) {
            transitForm.reset();
            toast.success("Transit started successfully!");
        }
    }, [isTransitConfirmed, transitForm]);

    useEffect(() => {
        if (isDeliveryConfirmed) {
            deliveryForm.reset();
            toast.success("Delivery confirmed successfully!");
        }
    }, [isDeliveryConfirmed, deliveryForm]);

    // Error handlers
    useEffect(() => {
        if (updateError) toast.error("Update error: " + updateError.message);
    }, [updateError]);
    useEffect(() => {
        if (actorsError) toast.error("Actors error: " + actorsError.message);
    }, [actorsError]);
    useEffect(() => {
        if (warehouseError) toast.error("Warehouse error: " + warehouseError.message);
    }, [warehouseError]);
    useEffect(() => {
        if (qualityError) toast.error("Quality error: " + qualityError.message);
    }, [qualityError]);
    useEffect(() => {
        if (transitError) toast.error("Transit error: " + transitError.message);
    }, [transitError]);
    useEffect(() => {
        if (deliveryError) toast.error("Delivery error: " + deliveryError.message);
    }, [deliveryError]);

    const statusOptions = [
        { value: "0", label: "Pending" },
        { value: "1", label: "Warehouse Confirmed" },
        { value: "2", label: "Quality Approved" },
        { value: "3", label: "In Transit" },
        { value: "4", label: "Delivered" },
        { value: "5", label: "Completed" },
        { value: "6", label: "Disputed" },
        { value: "7", label: "Canceled" },
    ];

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Logistics Management Center
                    </CardTitle>
                    <CardDescription>
                        Quản lý toàn bộ shipment, actors, events và workflow logistics
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <Tabs defaultValue="workflow" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="workflow">Workflow</TabsTrigger>
                            <TabsTrigger value="actors">Actors</TabsTrigger>
                            <TabsTrigger value="events">Events</TabsTrigger>
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                        </TabsList>

                        {/* WORKFLOW TAB */}
                        <TabsContent value="workflow" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                
                                {/* Update Shipment */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Edit className="w-4 h-4" />
                                            Update Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...updateForm}>
                                            <form onSubmit={updateForm.handleSubmit(onUpdateShipment)} className="space-y-3">
                                                <FormField
                                                    control={updateForm.control}
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
                                                    control={updateForm.control}
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
                                                    control={updateForm.control}
                                                    name="newStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Status</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {statusOptions.map((option) => (
                                                                        <SelectItem key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" size="sm" disabled={isUpdatingShipment || isConfirmingUpdate}>
                                                    {isUpdatingShipment || isConfirmingUpdate ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Warehouse Confirm */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Building2 className="w-4 h-4 text-orange-600" />
                                            Warehouse Confirm
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...warehouseForm}>
                                            <form onSubmit={warehouseForm.handleSubmit(onWarehouseConfirm)} className="space-y-3">
                                                <FormField
                                                    control={warehouseForm.control}
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
                                                <Button type="submit" className="w-full" size="sm" disabled={isWarehouseConfirming || isConfirmingWarehouse}>
                                                    {isWarehouseConfirming || isConfirmingWarehouse ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Quality Approve */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                                            Quality Approve
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...qualityForm}>
                                            <form onSubmit={qualityForm.handleSubmit(onQualityApprove)} className="space-y-3">
                                                <FormField
                                                    control={qualityForm.control}
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
                                                <Button type="submit" className="w-full" size="sm" disabled={isQualityApproving || isConfirmingQuality}>
                                                    {isQualityApproving || isConfirmingQuality ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Start Transit */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Truck className="w-4 h-4 text-yellow-600" />
                                            Start Transit
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...transitForm}>
                                            <form onSubmit={transitForm.handleSubmit(onStartTransit)} className="space-y-3">
                                                <FormField
                                                    control={transitForm.control}
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
                                                <Button type="submit" className="w-full" size="sm" disabled={isStartingTransit || isConfirmingTransit}>
                                                    {isStartingTransit || isConfirmingTransit ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Confirm Delivery */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            Confirm Delivery
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...deliveryForm}>
                                            <form onSubmit={deliveryForm.handleSubmit(onConfirmDelivery)} className="space-y-3">
                                                <FormField
                                                    control={deliveryForm.control}
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
                                                <Button type="submit" className="w-full" size="sm" disabled={isConfirmingDelivery || isConfirmingDeliveryTx}>
                                                    {isConfirmingDelivery || isConfirmingDeliveryTx ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Rate or Dispute */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Star className="w-4 h-4 text-blue-600" />
                                            Rate/Dispute
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...rateForm}>
                                            <form onSubmit={rateForm.handleSubmit(onRateOrDispute)} className="space-y-3">
                                                <FormField
                                                    control={rateForm.control}
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
                                                    control={rateForm.control}
                                                    name="rating"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Rating (1-5)</FormLabel>
                                                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {[1,2,3,4,5].map((rating) => (
                                                                        <SelectItem key={rating} value={rating.toString()}>
                                                                            {rating} Star{rating > 1 ? 's' : ''}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={rateForm.control}
                                                    name="feedback"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Feedback</FormLabel>
                                                            <FormControl>
                                                                <Textarea {...field} placeholder="Your feedback..." rows={2} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="flex gap-2">
                                                    <Button type="submit" className="flex-1" size="sm" disabled={isRatingOrDisputing}>
                                                        {isRatingOrDisputing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rate"}
                                                    </Button>
                                                    <Button 
                                                        type="button" 
                                                        variant="destructive" 
                                                        className="flex-1" 
                                                        size="sm"
                                                        disabled={isRatingOrDisputing}
                                                        onClick={() => {
                                                            rateForm.setValue('isDispute', true);
                                                            rateForm.handleSubmit(onRateOrDispute)();
                                                        }}
                                                    >
                                                        Dispute
                                                    </Button>
                                                </div>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* ACTORS TAB */}
                        <TabsContent value="actors" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                
                                {/* Set Both Actors */}
                                <Card className="md:col-span-2 lg:col-span-3">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Set Warehouse Manager & Quality Inspector
                                        </CardTitle>
                                        <CardDescription>Assign both actors at once</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...actorsForm}>
                                            <form onSubmit={actorsForm.handleSubmit(onSetActors)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <FormField
                                                    control={actorsForm.control}
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
                                                    control={actorsForm.control}
                                                    name="manager"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Warehouse Manager</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="0x..." />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={actorsForm.control}
                                                    name="inspector"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Quality Inspector</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="0x..." />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="md:col-span-3 flex justify-center">
                                                    <Button type="submit" disabled={isSettingActors || isConfirmingActors}>
                                                        {isSettingActors || isConfirmingActors ? (
                                                            <>
                                                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                                Setting Actors...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Users className="mr-2 w-4 h-4" />
                                                                Set Both Actors
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Set Warehouse Manager Only */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Building2 className="w-4 h-4 text-orange-600" />
                                            Warehouse Manager
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...warehouseManagerForm}>
                                            <form onSubmit={warehouseManagerForm.handleSubmit(onSetWarehouseManager)} className="space-y-3">
                                                <FormField
                                                    control={warehouseManagerForm.control}
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
                                                    control={warehouseManagerForm.control}
                                                    name="address"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Manager Address</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="0x..." />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" size="sm" disabled={isSettingWarehouseManager}>
                                                    {isSettingWarehouseManager ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set Manager"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Set Quality Inspector Only */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                                            Quality Inspector
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...qualityInspectorForm}>
                                            <form onSubmit={qualityInspectorForm.handleSubmit(onSetQualityInspector)} className="space-y-3">
                                                <FormField
                                                    control={qualityInspectorForm.control}
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
                                                    control={qualityInspectorForm.control}
                                                    name="address"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Inspector Address</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="0x..." />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" size="sm" disabled={isSettingQualityInspector}>
                                                    {isSettingQualityInspector ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set Inspector"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* EVENTS TAB */}
                        <TabsContent value="events" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                
                                {/* General Event */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Plus className="w-4 h-4" />
                                            General Event
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...eventForm}>
                                            <form onSubmit={eventForm.handleSubmit(onAddEvent)} className="space-y-3">
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
                                                                <Input {...field} placeholder="Location" />
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
                                                            <FormLabel>Event</FormLabel>
                                                            <FormControl>
                                                                <Textarea {...field} placeholder="Event description..." rows={2} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" size="sm" disabled={isAddingEvent}>
                                                    {isAddingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Event"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Transit Event */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Truck className="w-4 h-4 text-yellow-600" />
                                            Transit Event
                                        </CardTitle>
                                        <Badge variant="outline" className="w-fit">Carrier Only</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...transitEventForm}>
                                            <form onSubmit={transitEventForm.handleSubmit(onAddTransitEvent)} className="space-y-3">
                                                <FormField
                                                    control={transitEventForm.control}
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
                                                    control={transitEventForm.control}
                                                    name="location"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Location</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Highway A1, Mile 45" />
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
                                                            <FormLabel>Note</FormLabel>
                                                            <FormControl>
                                                                <Textarea {...field} placeholder="Transit note..." rows={2} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" size="sm" disabled={isAddingTransitEvent}>
                                                    {isAddingTransitEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Transit"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Warehouse Event */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Building2 className="w-4 h-4 text-orange-600" />
                                            Warehouse Event
                                        </CardTitle>
                                        <Badge variant="outline" className="w-fit">Manager Only</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...warehouseEventForm}>
                                            <form onSubmit={warehouseEventForm.handleSubmit(onAddWarehouseEvent)} className="space-y-3">
                                                <FormField
                                                    control={warehouseEventForm.control}
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
                                                    control={warehouseEventForm.control}
                                                    name="eventType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Warehouse Event</FormLabel>
                                                            <FormControl>
                                                                <Textarea {...field} placeholder="Package received and stored..." rows={3} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" size="sm" disabled={isAddingWarehouseEvent}>
                                                    {isAddingWarehouseEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Warehouse"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Quality Event */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                                            Quality Event
                                        </CardTitle>
                                        <Badge variant="outline" className="w-fit">Inspector Only</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...qualityEventForm}>
                                            <form onSubmit={qualityEventForm.handleSubmit(onAddQualityEvent)} className="space-y-3">
                                                <FormField
                                                    control={qualityEventForm.control}
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
                                                    control={qualityEventForm.control}
                                                    name="eventType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Quality Event</FormLabel>
                                                            <FormControl>
                                                                <Textarea {...field} placeholder="Quality inspection completed..." rows={3} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" size="sm" disabled={isAddingQualityEvent}>
                                                    {isAddingQualityEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Quality"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Update Location */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            Update Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...locationForm}>
                                            <form onSubmit={locationForm.handleSubmit(onUpdateLocation)} className="space-y-3">
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
                                                <Button type="submit" className="w-full" size="sm" disabled={isUpdatingLocation}>
                                                    {isUpdatingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Location"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* ADMIN TAB */}
                        <TabsContent value="admin" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Cancel Shipment */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                            Cancel Shipment
                                        </CardTitle>
                                        <Badge variant="destructive" className="w-fit">Admin Only</Badge>
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
                                                                <Input {...field} placeholder="SHIP0001" />
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
                                                                <Textarea {...field} placeholder="Reason for canceling..." />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" variant="destructive" className="w-full" disabled={isCancelingShipment}>
                                                    {isCancelingShipment ? (
                                                        <>
                                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                            Canceling...
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

                                {/* Resolve Dispute */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gavel className="w-5 h-5 text-blue-600" />
                                            Resolve Dispute
                                        </CardTitle>
                                        <Badge variant="destructive" className="w-fit">Admin Only</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...resolveForm}>
                                            <form onSubmit={resolveForm.handleSubmit(onResolveDispute)} className="space-y-4">
                                                <FormField
                                                    control={resolveForm.control}
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
                                                    control={resolveForm.control}
                                                    name="favorCreator"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Resolution</FormLabel>
                                                            <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={field.value?.toString()}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select resolution" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="true">Favor Creator (Refund)</SelectItem>
                                                                    <SelectItem value="false">Favor Carrier (Release Escrow)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" disabled={isResolvingDispute}>
                                                    {isResolvingDispute ? (
                                                        <>
                                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                            Resolving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Gavel className="mr-2 w-4 h-4" />
                                                            Resolve Dispute
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
