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
import { useAddShipmentEvent, useGetShipment, useUpdateShipmentStatus } from "@/hooks/use-logistics";
import { StatusEnum } from "@/lib/contracts";
import { toast } from "sonner";
import { Plus, Edit, Settings, CheckCircle2, MapPin, Loader2, MessageSquare, Activity } from "lucide-react";

const addEventSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    location: z.string().min(1, "Location is required"),
    eventType: z.string().min(1, "Event type is required"),
});

const updateStatusSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    newStatus: z.enum(["0", "1", "2", "3"]),
    note: z.string().optional(),
});

type AddEventFormData = z.infer<typeof addEventSchema>;
type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

export function ManageShipment() {
    const { addEvent, isPending: isAddingEvent, isConfirming: isConfirmingEvent, isConfirmed: isEventConfirmed, error: eventError } = useAddShipmentEvent();
    const { updateStatus, isPending: isUpdatingStatus, isConfirming: isConfirmingStatus, isConfirmed: isStatusConfirmed, error: statusError } = useUpdateShipmentStatus();

    // State để lưu shipment code hiện tại
    const [currentShipmentCode, setCurrentShipmentCode] = useState("");
    // Lấy thông tin shipment
    const { shipment, isError: shipmentError, isLoading: shipmentLoading, refetch: refetchShipment } = useGetShipment(currentShipmentCode);

    const eventForm = useForm<AddEventFormData>({
        resolver: zodResolver(addEventSchema),
        defaultValues: {
            shipmentCode: "",
            location: "",
            eventType: "",
        },
    });

    const statusForm = useForm<UpdateStatusFormData>({
        resolver: zodResolver(updateStatusSchema),
        defaultValues: {
            shipmentCode: "",
            newStatus: "0",
            note: "",
        },
    });

    const onAddEvent = async (data: AddEventFormData) => {
        try {
            console.log(`Adding shipment event: ${data.shipmentCode}, ${data.location}, ${data.eventType}`);
            addEvent(data.shipmentCode, data.location, data.eventType);
            toast.success("Adding event...");
        } catch (error) {
            console.error("Error adding event:", error);
            toast.error(`Error occurred while adding event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onUpdateStatus = async (data: UpdateStatusFormData) => {
        try {
            // Cập nhật shipment code hiện tại để kích hoạt useGetShipment
            setCurrentShipmentCode(data.shipmentCode);

            // Đảm bảo lấy dữ liệu mới nhất
            await refetchShipment();

            // Nếu đang tải, hiển thị thông báo
            if (shipmentLoading) {
                toast.info("Checking shipment...");
                return;
            }

            // Nếu có lỗi hoặc không tìm thấy shipment
            if (shipmentError || !shipment) {
                toast.error(`Shipment with code ${data.shipmentCode} not found or not accessible`);
                return;
            }

            // Kiểm tra trạng thái hiện tại và trạng thái mới
            const currentStatus = shipment.currentStatus;
            const newStatus = parseInt(data.newStatus) as StatusEnum;

            console.log(`Updating shipment ${data.shipmentCode} from status ${currentStatus} to ${newStatus}`);

            // Thực hiện cập nhật
            await updateStatus(data.shipmentCode, newStatus, data.note);
            toast.success("Updating status...");
        } catch (error) {
            console.error("Error in onUpdateStatus:", error);
            toast.error("Error occurred while updating status");
        }
    };

    // Sử dụng useEffect thay vì side effects trong render
    useEffect(() => {
        if (isEventConfirmed) {
            eventForm.reset();
            toast.success("Event added successfully!");
        }
    }, [isEventConfirmed, eventForm]);

    useEffect(() => {
        if (isStatusConfirmed) {
            statusForm.reset();
            toast.success("Status updated successfully!");
        }
    }, [isStatusConfirmed, statusForm]);

    useEffect(() => {
        if (eventError) {
            toast.error("Add event error: " + eventError.message);
        }
    }, [eventError]);

    useEffect(() => {
        if (statusError) {
            toast.error("Update status error: " + statusError.message);
        }
    }, [statusError]);

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-3xl mx-auto border-2 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Manage Shipments</CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Add events and update shipment status
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="add-event" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-12">
                            <TabsTrigger value="add-event" className="flex items-center gap-2 text-sm">
                                <Plus className="h-3 w-3" />
                                Add Event
                            </TabsTrigger>
                            <TabsTrigger value="update-status" className="flex items-center gap-2 text-sm">
                                <Edit className="h-3 w-3" />
                                Update Status
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="add-event" className="mt-4">
                            <Form {...eventForm}>
                                <form onSubmit={eventForm.handleSubmit(onAddEvent)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={eventForm.control}
                                            name="shipmentCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm">Shipment Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. SH-2025-001" {...field} className="h-10" />
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
                                                    <FormLabel className="flex items-center gap-2 text-sm">
                                                        <MapPin className="w-3 h-3" />
                                                        Location
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Tan Son Nhat Warehouse" {...field} className="h-10" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={eventForm.control}
                                        name="eventType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-sm">
                                                    <Activity className="w-3 h-3" />
                                                    Event Type
                                                </FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="h-10">
                                                            <SelectValue placeholder="Select event type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pickup">📦 Picked up</SelectItem>
                                                            <SelectItem value="in_transit">🚛 In transit</SelectItem>
                                                            <SelectItem value="warehouse_arrival">🏭 Arrived at warehouse</SelectItem>
                                                            <SelectItem value="out_for_delivery">🚚 Out for delivery</SelectItem>
                                                            <SelectItem value="delivery_complete">✅ Delivery complete</SelectItem>
                                                            <SelectItem value="delivery_failed">❌ Failed delivery</SelectItem>
                                                            <SelectItem value="returned">↩️ Returned</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-12 font-semibold"
                                        disabled={isAddingEvent || isConfirmingEvent}
                                    >
                                        {isAddingEvent || isConfirmingEvent ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {isAddingEvent ? "Sending..." : "Confirming..."}
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Event
                                            </>
                                        )}
                                    </Button>

                                    {isConfirmingEvent && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                <span className="font-medium">Confirming event on blockchain...</span>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </Form>
                        </TabsContent>

                        <TabsContent value="update-status" className="mt-4">
                            <Form {...statusForm}>
                                <form onSubmit={statusForm.handleSubmit(onUpdateStatus)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={statusForm.control}
                                            name="shipmentCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm">Shipment Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. SH-2025-001" {...field} className="h-10" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={statusForm.control}
                                            name="newStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-sm">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        New Status
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="h-10">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="0">⏳ Pending</SelectItem>
                                                                <SelectItem value="1">🚛 In Transit</SelectItem>
                                                                <SelectItem value="2">✅ Delivered</SelectItem>
                                                                <SelectItem value="3">❌ Canceled</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={statusForm.control}
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-sm">
                                                    <MessageSquare className="w-3 h-3" />
                                                    Update Note (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Add a note about this status update..."
                                                        className="min-h-[80px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                <p className="text-xs text-muted-foreground">
                                                    Provide additional context for the status change
                                                </p>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-12 font-semibold"
                                        disabled={isUpdatingStatus || isConfirmingStatus}
                                    >
                                        {isUpdatingStatus || isConfirmingStatus ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {isUpdatingStatus ? "Sending..." : "Confirming..."}
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Update Status
                                            </>
                                        )}
                                    </Button>

                                    {isConfirmingStatus && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                <span className="font-medium">Confirming status on blockchain...</span>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Success Messages */}
            {isEventConfirmed && (
                <Card className="w-full max-w-3xl mx-auto border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="pt-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                                Event Successfully Added!
                            </h3>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                New event has been recorded on the blockchain.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isStatusConfirmed && (
                <Card className="w-full max-w-3xl mx-auto border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="pt-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Edit className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                                Status Updated Successfully!
                            </h3>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Shipment status has been updated on the blockchain.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Info */}
            <div className="bg-muted/20 rounded-lg p-4 max-w-3xl mx-auto">
                <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    Admin Information:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                    <div>
                        <strong>Access:</strong> Admin/Carrier
                    </div>
                    <div>
                        <strong>Gas Fee:</strong> ~0.002 ETH
                    </div>
                    <div>
                        <strong>Confirmation:</strong> 1-3 minutes
                    </div>
                    <div>
                        <strong>Security:</strong> Multi-sig
                    </div>
                </div>
            </div>
        </div>
    );
}
