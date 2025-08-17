"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User, TrendingUp, Package, Search, Copy, Check } from "lucide-react";
import { useGetCarrierRating, useGetCarrierStats } from "@/hooks/use-logistics";
import { toast } from "sonner";

export function CarrierProfile() {
    const [carrierAddress, setCarrierAddress] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [copied, setCopied] = useState(false);

    const { data: ratingData, isLoading: isLoadingRating } = useGetCarrierRating(carrierAddress);
    const { data: statsData, isLoading: isLoadingStats } = useGetCarrierStats(carrierAddress);

    const handleSearch = () => {
        if (searchAddress.trim()) {
            setCarrierAddress(searchAddress.trim());
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Address copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy address");
        }
    };

    const formatRating = (ratingTimes100?: bigint) => {
        if (!ratingTimes100) return "0.00";
        return (Number(ratingTimes100) / 100).toFixed(2);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500/50" />
                );
            } else {
                stars.push(
                    <Star key={i} className="w-5 h-5 text-gray-300" />
                );
            }
        }

        return stars;
    };

    return (
        <div className="space-y-6">
            {/* Search Section */}
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Carrier Profile Lookup
                    </CardTitle>
                    <CardDescription>
                        Enter a carrier's wallet address to view their performance statistics
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            placeholder="0x742d35Cc6635C0532925a3b8D39Cd9F5B1e4F9D1"
                            value={searchAddress}
                            onChange={(e) => setSearchAddress(e.target.value)}
                            className="font-mono"
                        />
                        <Button onClick={handleSearch} disabled={!searchAddress.trim()}>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Carrier Profile Results */}
            {carrierAddress && (
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Rating Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Star className="w-5 h-5 text-yellow-500" />
                                Average Rating
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingRating ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                    <span className="text-sm text-muted-foreground">Loading rating...</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-primary mb-2">
                                            {formatRating(ratingData as bigint)}
                                        </div>
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            {renderStars(Number(formatRating(ratingData as bigint)))}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Based on {statsData ? Number((statsData as any)[1]) : 0} reviews
                                        </p>
                                    </div>

                                    {Number(formatRating(ratingData as bigint)) >= 4.5 && (
                                        <Badge className="w-full justify-center bg-green-100 text-green-800 border-green-200">
                                            Excellent Carrier
                                        </Badge>
                                    )}
                                    {Number(formatRating(ratingData as bigint)) >= 4.0 && Number(formatRating(ratingData as bigint)) < 4.5 && (
                                        <Badge className="w-full justify-center bg-blue-100 text-blue-800 border-blue-200">
                                            Good Carrier
                                        </Badge>
                                    )}
                                    {Number(formatRating(ratingData as bigint)) >= 3.0 && Number(formatRating(ratingData as bigint)) < 4.0 && (
                                        <Badge className="w-full justify-center bg-yellow-100 text-yellow-800 border-yellow-200">
                                            Average Carrier
                                        </Badge>
                                    )}
                                    {Number(formatRating(ratingData as bigint)) < 3.0 && Number(formatRating(ratingData as bigint)) > 0 && (
                                        <Badge className="w-full justify-center bg-red-100 text-red-800 border-red-200">
                                            Needs Improvement
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Statistics Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="w-5 h-5" />
                                Carrier Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingStats ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                    <span className="text-sm text-muted-foreground">Loading stats...</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Reviews:</span>
                                        <span className="font-semibold">
                                            {statsData ? Number((statsData as any)[1]) : 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Rating Points:</span>
                                        <span className="font-semibold">
                                            {statsData ? Number((statsData as any)[0]) : 0}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Package className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Completed {statsData ? Number((statsData as any)[1]) : 0} shipments
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Carrier Address Display */}
            {carrierAddress && (
                <Card className="w-full max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-sm">Carrier Wallet Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <span className="font-mono text-sm flex-1">{carrierAddress}</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(carrierAddress)}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
