"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateShipment } from "@/hooks/use-logistics";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const createShipmentSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    productName: z.string().min(1, "Product name is required"),
    origin: z.string().min(1, "Origin is required"),
    destination: z.string().min(1, "Destination is required"),
    carrier: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

type CreateShipmentFormData = z.infer<typeof createShipmentSchema>;

export function CreateShipment() {
    const { createShipment, isPending, isConfirming, isConfirmed, error } = useCreateShipment();

    const form = useForm<CreateShipmentFormData>({
        resolver: zodResolver(createShipmentSchema),
        defaultValues: {
            shipmentCode: "",
            productName: "",
            origin: "",
            destination: "",
            carrier: "",
        },
    });

    const onSubmit = async (data: CreateShipmentFormData) => {
        try {
            createShipment(
                data.shipmentCode,
                data.productName,
                data.origin,
                data.destination,
                data.carrier
            );
            toast.success("Đang tạo vận đơn...");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tạo vận đơn");
        }
    };

    // Sử dụng useEffect thay vì side effects trong render
    useEffect(() => {
        if (isConfirmed) {
            form.reset();
            toast.success("Tạo vận đơn thành công!");
        }
    }, [isConfirmed, form]);

    useEffect(() => {
        if (error) {
            toast.error("Có lỗi xảy ra: " + error.message);
        }
    }, [error]);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Tạo Vận Đơn Mới</CardTitle>
                <CardDescription>
                    Tạo một vận đơn mới trong hệ thống logistics blockchain
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
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
                            control={form.control}
                            name="productName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên Sản Phẩm</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tên sản phẩm" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="origin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Điểm Xuất Phát</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập điểm xuất phát" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="destination"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Điểm Đến</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập điểm đến" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="carrier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa Chỉ Ví Nhà Vận Chuyển</FormLabel>
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
                            disabled={isPending || isConfirming}
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isPending ? "Đang gửi..." : "Đang xác nhận..."}
                                </>
                            ) : (
                                "Tạo Vận Đơn"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
