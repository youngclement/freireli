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
import { Loader2, Package, MapPin, Truck, Wallet, Hash } from "lucide-react";

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
            toast.success("Creating shipment...");
        } catch (error) {
            toast.error("Error occurred while creating shipment");
        }
    };

    // Use useEffect instead of side effects in render
    useEffect(() => {
        if (isConfirmed) {
            form.reset();
            toast.success("Shipment created successfully!");
        }
    }, [isConfirmed, form]);

    useEffect(() => {
        if (error) {
            toast.error("An error occurred: " + error.message);
        }
    }, [error]);

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-3xl mx-auto border-2 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Create New Shipment</CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Create a blockchain shipment with detailed information
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="shipmentCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Hash className="w-4 h-4" />
                                                Shipment Code
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. SH-2025-001"
                                                    {...field}
                                                    className="h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Unique identifier for the shipment
                                            </p>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="productName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Package className="w-4 h-4" />
                                                Product Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Consumer Electronics"
                                                    {...field}
                                                    className="h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Detailed description of the shipped product
                                            </p>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="origin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Origin Point
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Ho Chi Minh City, Vietnam"
                                                    {...field}
                                                    className="h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Starting point of the shipping journey
                                            </p>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Destination
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Tokyo, Japan"
                                                    {...field}
                                                    className="h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Final delivery location
                                            </p>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="carrier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Wallet className="w-4 h-4" />
                                            Carrier Wallet Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="0x742d35Cc6635C0532925a3b8D39Cd9F5B1e4F9D1"
                                                {...field}
                                                className="h-12 font-mono"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <p className="text-xs text-muted-foreground">
                                            Authorized carrier's Ethereum wallet address
                                        </p>
                                    </FormItem>
                                )}
                            />

                            {/* Information Panel */}
                            <div className="bg-muted/50 rounded-lg p-4 border">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Important Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div>
                                        <strong>• Transaction Fee:</strong> About 0.001 - 0.005 ETH
                                    </div>
                                    <div>
                                        <strong>• Confirmation Time:</strong> 1-3 minutes
                                    </div>
                                    <div>
                                        <strong>• Security:</strong> AES-256 encryption
                                    </div>
                                    <div>
                                        <strong>• Tracking:</strong> Real-time updates 24/7
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-lg font-semibold"
                                disabled={isPending || isConfirming}
                            >
                                {isPending || isConfirming ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {isPending ? "Sending transaction..." : "Confirming on blockchain..."}
                                    </>
                                ) : (
                                    <>
                                        <Package className="mr-2 h-5 w-5" />
                                        Create Blockchain Shipment
                                    </>
                                )}
                            </Button>

                            {isConfirming && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="font-medium">Confirming on blockchain...</span>
                                    </div>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                        Transaction is being confirmed by miners. Please wait a moment.
                                    </p>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Success Message */}
            {isConfirmed && (
                <Card className="w-full max-w-4xl mx-auto border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                                Shipment created successfully!
                            </h3>
                            <p className="text-green-700 dark:text-green-300 mb-4">
                                Your shipment has been recorded on the blockchain and is ready for tracking.
                            </p>
                            <Button className="bg-green-600 hover:bg-green-700">
                                Track Shipment
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
