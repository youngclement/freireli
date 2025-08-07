"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddShipmentEvent, useUpdateShipmentStatus } from "@/hooks/use-logistics";
import { StatusEnum } from "@/lib/contracts";
import { toast } from "sonner";
import { Loader2, Plus, Edit } from "lucide-react";

const addEventSchema = z.object({
    shipmentCode: z.string().min(1, "Mã vận đơn là bắt buộc"),
    location: z.string().min(1, "Vị trí là bắt buộc"),
    eventType: z.string().min(1, "Loại sự kiện là bắt buộc"),
});

const updateStatusSchema = z.object({
    shipmentCode: z.string().min(1, "Mã vận đơn là bắt buộc"),
    newStatus: z.enum(["0", "1", "2", "3"]),
});

type AddEventFormData = z.infer<typeof addEventSchema>;
type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

export function ManageShipment() {
    const { addEvent, isPending: isAddingEvent, isConfirming: isConfirmingEvent, isConfirmed: isEventConfirmed, error: eventError } = useAddShipmentEvent();
    const { updateStatus, isPending: isUpdatingStatus, isConfirming: isConfirmingStatus, isConfirmed: isStatusConfirmed, error: statusError } = useUpdateShipmentStatus();

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
        },
    });

    const onAddEvent = async (data: AddEventFormData) => {
        try {
            addEvent(data.shipmentCode, data.location, data.eventType);
            toast.success("Đang thêm sự kiện...");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi thêm sự kiện");
        }
    };

    const onUpdateStatus = async (data: UpdateStatusFormData) => {
        try {
            const status = parseInt(data.newStatus) as StatusEnum;
            updateStatus(data.shipmentCode, status);
            toast.success("Đang cập nhật trạng thái...");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        }
    };

    // Sử dụng useEffect thay vì side effects trong render
    useEffect(() => {
        if (isEventConfirmed) {
            eventForm.reset();
            toast.success("Thêm sự kiện thành công!");
        }
    }, [isEventConfirmed, eventForm]);

    useEffect(() => {
        if (isStatusConfirmed) {
            statusForm.reset();
            toast.success("Cập nhật trạng thái thành công!");
        }
    }, [isStatusConfirmed, statusForm]);

    useEffect(() => {
        if (eventError) {
            toast.error("Lỗi thêm sự kiện: " + eventError.message);
        }
    }, [eventError]);

    useEffect(() => {
        if (statusError) {
            toast.error("Lỗi cập nhật trạng thái: " + statusError.message);
        }
    }, [statusError]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Quản Lý Vận Đơn</CardTitle>
                    <CardDescription>
                        Thêm sự kiện và cập nhật trạng thái vận đơn
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="add-event" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="add-event" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Thêm Sự Kiện
                            </TabsTrigger>
                            <TabsTrigger value="update-status" className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Cập Nhật Trạng Thái
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="add-event" className="mt-6">
                            <Form {...eventForm}>
                                <form onSubmit={eventForm.handleSubmit(onAddEvent)} className="space-y-4">
                                    <FormField
                                        control={eventForm.control}
                                        name="shipmentCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mã Vận Đơn</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập mã vận đơn" {...field} />
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
                                                <FormLabel>Vị Trí</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập vị trí hiện tại" {...field} />
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
                                                <FormLabel>Loại Sự Kiện</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn loại sự kiện" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Picked up">Đã lấy hàng</SelectItem>
                                                            <SelectItem value="In transit">Đang vận chuyển</SelectItem>
                                                            <SelectItem value="Arrived at warehouse">Đã đến kho</SelectItem>
                                                            <SelectItem value="Out for delivery">Đang giao hàng</SelectItem>
                                                            <SelectItem value="Delivered">Đã giao</SelectItem>
                                                            <SelectItem value="Failed delivery">Giao hàng thất bại</SelectItem>
                                                            <SelectItem value="Returned">Đã trả lại</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isAddingEvent || isConfirmingEvent}
                                    >
                                        {isAddingEvent || isConfirmingEvent ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {isAddingEvent ? "Đang gửi..." : "Đang xác nhận..."}
                                            </>
                                        ) : (
                                            "Thêm Sự Kiện"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>

                        <TabsContent value="update-status" className="mt-6">
                            <Form {...statusForm}>
                                <form onSubmit={statusForm.handleSubmit(onUpdateStatus)} className="space-y-4">
                                    <FormField
                                        control={statusForm.control}
                                        name="shipmentCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mã Vận Đơn</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập mã vận đơn" {...field} />
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
                                                <FormLabel>Trạng Thái Mới</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="0">Đã tạo</SelectItem>
                                                            <SelectItem value="1">Đang vận chuyển</SelectItem>
                                                            <SelectItem value="2">Đã giao</SelectItem>
                                                            <SelectItem value="3">Đã hủy</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isUpdatingStatus || isConfirmingStatus}
                                    >
                                        {isUpdatingStatus || isConfirmingStatus ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {isUpdatingStatus ? "Đang gửi..." : "Đang xác nhận..."}
                                            </>
                                        ) : (
                                            "Cập Nhật Trạng Thái"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
