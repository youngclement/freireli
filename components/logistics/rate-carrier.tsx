"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRateCarrier } from "@/hooks/use-logistics";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const rateCarrierSchema = z.object({
    shipmentCode: z.string().min(1, "Shipment code is required"),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
    feedback: z.string().min(10, "Feedback must be at least 10 characters"),
});

type RateCarrierFormData = z.infer<typeof rateCarrierSchema>;

export function RateCarrier() {
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const { rateCarrier, isPending, isConfirming, isConfirmed } = useRateCarrier();

    const form = useForm<RateCarrierFormData>({
        resolver: zodResolver(rateCarrierSchema),
        defaultValues: {
            shipmentCode: "",
            rating: 0,
            feedback: "",
        },
    });

    const onSubmit = async (data: RateCarrierFormData) => {
        try {
            rateCarrier(data.shipmentCode, data.rating, data.feedback);
            toast.success("Submitting carrier rating...");
        } catch {
            toast.error("Error submitting rating");
        }
    };

    if (isConfirmed) {
        return (
            <Card className="w-full max-w-2xl mx-auto border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                            Rating Submitted Successfully!
                        </h3>
                        <p className="text-green-700 dark:text-green-300 mb-4">
                            Your carrier rating has been recorded on the blockchain and will help other users.
                        </p>
                        <Button
                            onClick={() => {
                                form.reset();
                                setSelectedRating(0);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Rate Another Carrier
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
                        <Star className="w-5 h-5 text-yellow-500" />
                        Rate Carrier Performance
                    </CardTitle>
                    <CardDescription>
                        Help other users by rating your carrier experience
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
                                            <Input placeholder="e.g. SH-2025-001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating (1-5 stars)</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedRating(star);
                                                            field.onChange(star);
                                                        }}
                                                        className="transition-colors"
                                                    >
                                                        <Star
                                                            className={`w-8 h-8 ${star <= (selectedRating || field.value)
                                                                ? "text-yellow-500 fill-yellow-500"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="feedback"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Detailed Feedback</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Share your experience with this carrier..."
                                                className="min-h-[100px]"
                                                {...field}
                                            />
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
                                        {isPending ? "Submitting..." : "Confirming..."}
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Submit Rating
                                    </>
                                )}
                            </Button>

                            {isConfirming && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="font-medium">Confirming rating on blockchain...</span>
                                    </div>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
