"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
    useUpdateShipment, 
    useGetShipment, 
    useStartTransit, 
    useConfirm, 
    useConfirmDelivery, 
    useSetActors 
} from "@/hooks/use-logistics";
import { StatusEnum } from "@/lib/contracts";
import { toast } from "sonner";
import { Plus, Edit, Settings, CheckCircle2, MapPin, Loader2, MessageSquare, Activity, Users, Truck } from "lucide-react";

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

const confirmSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    isWarehouse: z.boolean(),
});

const simpleActionSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
});

type UpdateShipmentFormData = z.infer<typeof updateShipmentSchema>;
type SetActorsFormData = z.infer<typeof setActorsSchema>;
type ConfirmFormData = z.infer<typeof confirmSchema>;
type SimpleActionFormData = z.infer<typeof simpleActionSchema>;

export function ManageShipment() {
    const { updateShipment, isPending: isUpdatingShipment, isConfirming: isConfirmingUpdate, isConfirmed: isUpdateConfirmed, error: updateError } = useUpdateShipment();
    const { startTransit, isPending: isStartingTransit, isConfirming: isConfirmingTransit, isConfirmed: isTransitConfirmed, error: transitError } = useStartTransit();
    const { confirm, isPending: isConfirming, isConfirming: isConfirmingConfirm, isConfirmed: isConfirmConfirmed, error: confirmError } = useConfirm();
    const { confirmDelivery, isPending: isConfirmingDelivery, isConfirming: isConfirmingDeliveryTx, isConfirmed: isDeliveryConfirmed, error: deliveryError } = useConfirmDelivery();
    const { setActors, isPending: isSettingActors, isConfirming: isConfirmingActors, isConfirmed: isActorsConfirmed, error: actorsError } = useSetActors();

    // State để lưu shipment code hiện tại
    const [currentShipmentCode, setCurrentShipmentCode] = useState("");
    // Lấy thông tin shipment
    const { shipment, isError: shipmentError, isLoading: shipmentLoading, refetch: refetchShipment } = useGetShipment(currentShipmentCode);

    const updateForm = useForm<UpdateShipmentFormData>({
        resolver: zodResolver(updateShipmentSchema),
        defaultValues: {
            shipmentCode: "",
            location: "",
            newStatus: "0",
        },
    });

    const actorsForm = useForm<SetActorsFormData>({
        resolver: zodResolver(setActorsSchema),
        defaultValues: {
            shipmentCode: "",
            manager: "",
            inspector: "",
        },
    });

    const confirmForm = useForm<ConfirmFormData>({
        resolver: zodResolver(confirmSchema),
        defaultValues: {
            shipmentCode: "",
            isWarehouse: false,
        },
    });

    const transitForm = useForm<SimpleActionFormData>({
        resolver: zodResolver(simpleActionSchema),
        defaultValues: {
            shipmentCode: "",
        },
    });

    const deliveryForm = useForm<SimpleActionFormData>({
        resolver: zodResolver(simpleActionSchema),
        defaultValues: {
            shipmentCode: "",
        },
    });

    const onUpdateShipment = async (data: UpdateShipmentFormData) => {
        try {
            console.log(`Updating shipment: ${data.shipmentCode}, ${data.location}, ${data.newStatus}`);

            updateShipment(data.shipmentCode, data.location, parseInt(data.newStatus));
            toast.success(`Updating shipment ${data.shipmentCode}...`);
        } catch (error) {
            console.error("Error updating shipment:", error);
            toast.error(`Error occurred while updating shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onSetActors = async (data: SetActorsFormData) => {
        try {
            console.log(`Setting actors for shipment: ${data.shipmentCode}`);
            setActors(data.shipmentCode, data.manager, data.inspector);
            toast.success(`Setting actors for shipment ${data.shipmentCode}...`);
        } catch (error) {
            console.error("Error setting actors:", error);
            toast.error(`Error occurred while setting actors: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onConfirm = async (data: ConfirmFormData) => {
        try {
            console.log(`Confirming shipment: ${data.shipmentCode}, isWarehouse: ${data.isWarehouse}`);
            confirm(data.shipmentCode, data.isWarehouse);
            toast.success(`Confirming shipment ${data.shipmentCode}...`);
        } catch (error) {
            console.error("Error confirming shipment:", error);
            toast.error(`Error occurred while confirming: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onStartTransit = async (data: SimpleActionFormData) => {
        try {
            console.log(`Starting transit for shipment: ${data.shipmentCode}`);
            startTransit(data.shipmentCode);
            toast.success(`Starting transit for shipment ${data.shipmentCode}...`);
        } catch (error) {
            console.error("Error starting transit:", error);
            toast.error(`Error occurred while starting transit: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onConfirmDelivery = async (data: SimpleActionFormData) => {
        try {
            console.log(`Confirming delivery for shipment: ${data.shipmentCode}`);
            confirmDelivery(data.shipmentCode);
            toast.success(`Confirming delivery for shipment ${data.shipmentCode}...`);
        } catch (error) {
            console.error("Error confirming delivery:", error);
            toast.error(`Error occurred while confirming delivery: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Handle form resets and success messages
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
        if (isConfirmConfirmed) {
            confirmForm.reset();
            toast.success("Shipment confirmed successfully!");
        }
    }, [isConfirmConfirmed, confirmForm]);

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

    // Handle errors
    useEffect(() => {
        if (updateError) {
            toast.error("Update shipment error: " + updateError.message);
        }
    }, [updateError]);

    useEffect(() => {
        if (actorsError) {
            toast.error("Set actors error: " + actorsError.message);
        }
    }, [actorsError]);

    useEffect(() => {
        if (confirmError) {
            toast.error("Confirm error: " + confirmError.message);
        }
    }, [confirmError]);

    useEffect(() => {
        if (transitError) {
            toast.error("Transit error: " + transitError.message);
        }
    }, [transitError]);

    useEffect(() => {
        if (deliveryError) {
            toast.error("Delivery error: " + deliveryError.message);
        }
    }, [deliveryError]);

    const statusOptions = [
        { value: "0", label: "Created" },
        { value: "1", label: "In Transit" },
        { value: "2", label: "At Warehouse" },
        { value: "3", label: "Quality Checked" },
        { value: "4", label: "Delivered" },
        { value: "5", label: "Completed" },
        { value: "6", label: "Disputed" },
        { value: "7", label: "Canceled" },
    ];

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Manage Shipments
                    </CardTitle>
                    <CardDescription>
                        Update shipment status, set actors, and manage the logistics workflow
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs defaultValue="update" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="update">Update Status</TabsTrigger>
                            <TabsTrigger value="actors">Set Actors</TabsTrigger>
                            <TabsTrigger value="confirm">Confirm</TabsTrigger>
                            <TabsTrigger value="transit">Transit</TabsTrigger>
                            <TabsTrigger value="delivery">Delivery</TabsTrigger>
                        </TabsList>

                        <TabsContent value="update" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Update Shipment Status
                                    </CardTitle>
                                    <CardDescription>
                                        Update shipment location and status
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...updateForm}>
                                        <form onSubmit={updateForm.handleSubmit(onUpdateShipment)} className="space-y-4">
                                            <FormField
                                                control={updateForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. SHIP0001" {...field} />
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
                                                        <FormLabel className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            Location
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. New York Warehouse" {...field} />
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
                                                        <FormLabel>New Status</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select new status" />
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

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={isUpdatingShipment || isConfirmingUpdate}
                                            >
                                                {isUpdatingShipment || isConfirmingUpdate ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        {isUpdatingShipment ? "Updating..." : "Confirming..."}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Update Shipment
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="actors" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Set Warehouse Manager & Quality Inspector
                                    </CardTitle>
                                    <CardDescription>
                                        Assign warehouse manager and quality inspector to a shipment
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...actorsForm}>
                                        <form onSubmit={actorsForm.handleSubmit(onSetActors)} className="space-y-4">
                                            <FormField
                                                control={actorsForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. SHIP0001" {...field} />
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
                                                        <FormLabel>Warehouse Manager Address</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="0x..." {...field} />
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
                                                        <FormLabel>Quality Inspector Address</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="0x..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={isSettingActors || isConfirmingActors}
                                            >
                                                {isSettingActors || isConfirmingActors ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        {isSettingActors ? "Setting..." : "Confirming..."}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Users className="mr-2 h-4 w-4" />
                                                        Set Actors
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="confirm" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Confirm Shipment
                                    </CardTitle>
                                    <CardDescription>
                                        Warehouse or inspector confirmation
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...confirmForm}>
                                        <form onSubmit={confirmForm.handleSubmit(onConfirm)} className="space-y-4">
                                            <FormField
                                                control={confirmForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. SHIP0001" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={confirmForm.control}
                                                name="isWarehouse"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">
                                                                Confirmation Type
                                                            </FormLabel>
                                                            <div className="text-sm text-muted-foreground">
                                                                {field.value ? "Warehouse confirmation" : "Quality inspector confirmation"}
                                                            </div>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={isConfirming || isConfirmingConfirm}
                                            >
                                                {isConfirming || isConfirmingConfirm ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        {isConfirming ? "Confirming..." : "Confirming..."}
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Confirm
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="transit" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="w-4 h-4" />
                                        Start Transit
                                    </CardTitle>
                                    <CardDescription>
                                        Start the transit phase for a shipment
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...transitForm}>
                                        <form onSubmit={transitForm.handleSubmit(onStartTransit)} className="space-y-4">
                                            <FormField
                                                control={transitForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. SHIP0001" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={isStartingTransit || isConfirmingTransit}
                                            >
                                                {isStartingTransit || isConfirmingTransit ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        {isStartingTransit ? "Starting..." : "Confirming..."}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Truck className="mr-2 h-4 w-4" />
                                                        Start Transit
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="delivery" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Confirm Delivery
                                    </CardTitle>
                                    <CardDescription>
                                        Confirm that the shipment has been delivered
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...deliveryForm}>
                                        <form onSubmit={deliveryForm.handleSubmit(onConfirmDelivery)} className="space-y-4">
                                            <FormField
                                                control={deliveryForm.control}
                                                name="shipmentCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Shipment Code</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. SHIP0001" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={isConfirmingDelivery || isConfirmingDeliveryTx}
                                            >
                                                {isConfirmingDelivery || isConfirmingDeliveryTx ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        {isConfirmingDelivery ? "Confirming..." : "Confirming..."}
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Confirm Delivery
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
