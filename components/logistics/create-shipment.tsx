"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateShipment } from "@/hooks/use-logistics";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, Hash, Loader2, MapPin, Package, Truck, Wallet, Zap } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const createShipmentSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    productName: z.string().min(1, "Product name is required"),
    origin: z.string().min(1, "Origin is required"),
    destination: z.string().min(1, "Destination is required"),
    carrier: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
    deadline: z.string().min(1, "Deadline is required").refine(
        (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date > new Date();
        },
        "Deadline must be a valid future date"
    ),
    depositAmount: z.string().min(1, "Deposit amount is required").refine(
        (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
        "Invalid deposit amount"
    ),
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
            deadline: "",
            depositAmount: "",
        },
    });

    // Quick fill examples
    const quickFillExample = () => {
        // Set deadline to 7 days from now
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);

        // Generate a random shipment code to avoid conflicts
        const randomCode = "SHIP" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        form.setValue("shipmentCode", randomCode);
        form.setValue("productName", "Electronics");
        form.setValue("origin", "Ho Chi Minh City");
        form.setValue("destination", "Tokyo");
        form.setValue("carrier", "0x2a2cB2F081b651D05B8302f599B102710E8355F5"); // Updated carrier address
        form.setValue("deadline", futureDate.toISOString().split('T')[0]);
        form.setValue("depositAmount", "0.2");
        toast.success("Example data filled in with unique code: " + randomCode);
    };

    const onSubmit = async (data: CreateShipmentFormData) => {
        try {
            // Convert deadline string to timestamp (seconds)
            const deadlineDate = new Date(data.deadline);
            const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);

            // Log the data being sent
            console.log("Submitting shipment with data:", {
                code: data.shipmentCode,
                product: data.productName,
                origin: data.origin,
                destination: data.destination,
                carrier: data.carrier,
                deadline: deadlineTimestamp,
                deposit: data.depositAmount
            });

            createShipment(
                data.shipmentCode,
                data.productName,
                data.origin,
                data.destination,
                data.carrier,
                deadlineTimestamp,
                data.depositAmount
            );
            toast.success(`Creating shipment ${data.shipmentCode} with escrow deposit...`);
        } catch (err) {
            console.error("Error in onSubmit:", err);
            toast.error(`Error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Create New Shipment</CardTitle>
                                <CardDescription className="text-sm mt-1">
                                    Create a blockchain shipment with escrow protection
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={quickFillExample}
                            className="flex items-center gap-2"
                        >
                            <Zap className="w-3 h-3" />
                            Quick Fill
                        </Button>
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
                                            Authorized carrier&apos;s Ethereum wallet address
                                        </p>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="deadline"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Delivery Deadline
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    placeholder="Select a deadline"
                                                    {...field}
                                                    className="h-12"
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Expected delivery date. Escrow can be disputed after this date.
                                            </p>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="depositAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Wallet className="w-4 h-4" />
                                                Escrow Deposit (KAIA)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.001"
                                                    placeholder="0.2"
                                                    {...field}
                                                    className="h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Amount in KAIA to hold in escrow. Released to carrier on delivery, refunded on cancellation.
                                            </p>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Information Panel */}
                            <div className="bg-muted/50 rounded-lg p-4 border">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Escrow System Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div>
                                        <strong>• Escrow Protection:</strong> Funds held safely until delivery
                                    </div>
                                    <div>
                                        <strong>• Auto Release:</strong> Released to carrier on &ldquo;Delivered&rdquo; status
                                    </div>
                                    <div>
                                        <strong>• Auto Refund:</strong> Refunded to you on &ldquo;Canceled&rdquo; status
                                    </div>
                                    <div>
                                        <strong>• Transaction Fee:</strong> About 0.001 - 0.005 KAIA
                                    </div>
                                    <div className="md:col-span-2">
                                        <strong>• Security:</strong> Smart contract ensures transparent and secure transactions
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
