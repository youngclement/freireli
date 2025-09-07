"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRateOrDispute } from "@/hooks/use-logistics";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Send, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const rateCarrierSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
    feedback: z.string().min(10, "Feedback must be at least 10 characters"),
    isDispute: z.boolean(),
});

type RateCarrierFormData = z.infer<typeof rateCarrierSchema>;

export function RateCarrier() {
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [isDisputeMode, setIsDisputeMode] = useState<boolean>(false);
    const { rateOrDispute, isPending, isConfirming, isConfirmed, error } = useRateOrDispute();

    const form = useForm<RateCarrierFormData>({
        resolver: zodResolver(rateCarrierSchema),
        defaultValues: {
            shipmentCode: "",
            rating: 0,
            feedback: "",
            isDispute: false,
        },
    });

    const onSubmit = async (data: RateCarrierFormData) => {
        try {
            rateOrDispute(data.shipmentCode, data.rating, data.feedback, data.isDispute);
            toast.success(data.isDispute ? "Submitting dispute..." : "Submitting carrier rating...");
        } catch {
            toast.error("Error submitting rating");
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            form.reset();
            setSelectedRating(0);
            setIsDisputeMode(false);
            toast.success(isDisputeMode ? "Dispute submitted successfully!" : "Rating submitted successfully!");
        }
    }, [isConfirmed, form, isDisputeMode]);

    useEffect(() => {
        if (error) {
            toast.error("An error occurred: " + error.message);
        }
    }, [error]);

    if (isConfirmed) {
        return (
            <Card className="w-full max-w-2xl mx-auto border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                            {isDisputeMode ? (
                                <AlertTriangle className="w-8 h-8 text-green-600 dark:text-green-400" />
                            ) : (
                                <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
                            )}
                        </div>
                        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                            {isDisputeMode ? "Dispute Submitted Successfully!" : "Rating Submitted Successfully!"}
                        </h3>
                        <p className="text-green-700 dark:text-green-300 mb-4">
                            {isDisputeMode 
                                ? "Your dispute has been recorded and will be reviewed by an admin."
                                : "Your carrier rating has been recorded on the blockchain and will help other users."
                            }
                        </p>
                        <Button
                            onClick={() => {
                                form.reset();
                                setSelectedRating(0);
                                setIsDisputeMode(false);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isDisputeMode ? "Submit Another Review" : "Rate Another Carrier"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {isDisputeMode ? (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                            <Star className="w-5 h-5 text-yellow-500" />
                        )}
                        {isDisputeMode ? "File a Dispute" : "Rate Carrier Performance"}
                    </CardTitle>
                    <CardDescription>
                        {isDisputeMode 
                            ? "Report issues with carrier performance"
                            : "Help other users by rating your carrier experience"
                        }
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
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

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <FormLabel>Review Type</FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                        Switch to dispute mode if you have issues
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm">Rating</span>
                                    <Switch
                                        checked={isDisputeMode}
                                        onCheckedChange={(checked) => {
                                            setIsDisputeMode(checked);
                                            form.setValue("isDispute", checked);
                                            if (checked) {
                                                setSelectedRating(1);
                                                form.setValue("rating", 1);
                                            }
                                        }}
                                    />
                                    <span className="text-sm">Dispute</span>
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating (1-5 stars)</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedRating(star);
                                                            field.onChange(star);
                                                        }}
                                                        className={`text-2xl transition-colors ${
                                                            star <= (selectedRating || field.value)
                                                                ? isDisputeMode ? "text-red-500" : "text-yellow-500"
                                                                : "text-gray-300"
                                                        } hover:${isDisputeMode ? "text-red-400" : "text-yellow-400"}`}
                                                        disabled={isDisputeMode}
                                                    >
                                                        {isDisputeMode ? "⚠️" : "⭐"}
                                                    </button>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        {isDisputeMode && (
                                            <p className="text-sm text-red-600">
                                                Dispute mode: Rating is automatically set to 1
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="feedback"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {isDisputeMode ? "Dispute Reason" : "Feedback"}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    isDisputeMode
                                                        ? "Describe the issue with the carrier service..."
                                                        : "Share your experience with this carrier..."
                                                }
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isDisputeMode && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-red-800 dark:text-red-200">
                                                Filing a Dispute
                                            </h4>
                                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                                This will flag the shipment for admin review. The dispute will be 
                                                investigated and resolved accordingly. Ensure your reason is clear and detailed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className={`w-full ${
                                    isDisputeMode 
                                        ? "bg-red-600 hover:bg-red-700" 
                                        : "bg-primary hover:bg-primary/90"
                                }`}
                                disabled={isPending || isConfirming}
                            >
                                {isPending || isConfirming ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isPending ? "Submitting..." : "Confirming..."}
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        {isDisputeMode ? "File Dispute" : "Submit Rating"}
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
