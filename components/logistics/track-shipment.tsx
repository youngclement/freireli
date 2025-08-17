"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetShipment, useGetShipmentEvents } from "@/hooks/use-logistics";
import { StatusEnum } from "@/lib/contracts";
import { Search, Package, MapPin, User, Calendar, Truck, RefreshCw, Clock, CheckCircle2, AlertCircle, XCircle, Copy, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";

const getStatusText = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Created:
            return "Created";
        case StatusEnum.InTransit:
            return "In Transit";
        case StatusEnum.Delivered:
            return "Delivered";
        case StatusEnum.Cancelled:
            return "Cancelled";
        default:
            return "Không xác định";
    }
};

const getStatusColor = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Created:
            return "bg-blue-500 hover:bg-blue-600";
        case StatusEnum.InTransit:
            return "bg-yellow-500 hover:bg-yellow-600";
        case StatusEnum.Delivered:
            return "bg-green-500 hover:bg-green-600";
        case StatusEnum.Cancelled:
            return "bg-red-500 hover:bg-red-600";
        default:
            return "bg-gray-500 hover:bg-gray-600";
    }
};

const getStatusIcon = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Created:
            return <Package className="w-4 h-4" />;
        case StatusEnum.InTransit:
            return <Truck className="w-4 h-4" />;
        case StatusEnum.Delivered:
            return <CheckCircle2 className="w-4 h-4" />;
        case StatusEnum.Cancelled:
            return <XCircle className="w-4 h-4" />;
        default:
            return <AlertCircle className="w-4 h-4" />;
    }
};

const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
};

export function TrackShipment() {
    const [shipmentCode, setShipmentCode] = useState("");
    const [searchCode, setSearchCode] = useState("");

    const { shipment, isLoading: isLoadingShipment, refetch: refetchShipment } = useGetShipment(searchCode);
    const { events, isLoading: isLoadingEvents, refetch: refetchEvents } = useGetShipmentEvents(searchCode);

    const handleSearch = () => {
        if (shipmentCode.trim()) {
            setSearchCode(shipmentCode.trim());
        }
    };

    const handleRefresh = () => {
        refetchShipment();
        refetchEvents();
    };

    return (
        <div className="space-y-8">
            {/* Enhanced Search Section */}
            <Card className="border-2 shadow-lg">
                <CardHeader className="pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Search className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Track Shipment</CardTitle>
                            <CardDescription className="text-base mt-1">
                                Enter shipment code to view detailed information and track journey
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="Enter shipment code (e.g. SH-2025-001)"
                            value={shipmentCode}
                            onChange={(e) => setShipmentCode(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-12 text-base"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={!shipmentCode.trim()}
                            className="h-12 px-8 text-base font-semibold"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Tra cứu
                        </Button>
                    </div>
                    {searchCode && !shipment && !isLoadingShipment && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-700 dark:text-red-300 text-sm">
                                <AlertCircle className="w-4 h-4 inline mr-1" />
                                Shipment not found with code: <strong>{searchCode}</strong>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Loading State */}
            {searchCode && isLoadingShipment && (
                <Card>
                    <CardContent className="p-8">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-lg font-medium">Loading shipment information...</p>
                            <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Enhanced Shipment Details */}
            {searchCode && shipment && (
                <div className="space-y-6">
                    {/* Status Overview */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <Package className="h-6 w-6 text-primary" />
                                        Shipment: {shipment.shipmentCode}
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        Created at: {format(new Date(Number(shipment.createdAt) * 1000), 'PPpp', { locale: vi })}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={`${getStatusColor(shipment.currentStatus)} text-white px-4 py-2 text-base font-medium`}>
                                        {getStatusIcon(shipment.currentStatus)}
                                        <span className="ml-2">{getStatusText(shipment.currentStatus)}</span>
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRefresh}
                                        className="h-10"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Làm mới
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Tiến độ vận chuyển</span>
                                    <span className="text-sm text-muted-foreground">
                                        {shipment.currentStatus === StatusEnum.Created && "0%"}
                                        {shipment.currentStatus === StatusEnum.InTransit && "50%"}
                                        {shipment.currentStatus === StatusEnum.Delivered && "100%"}
                                        {shipment.currentStatus === StatusEnum.Cancelled && "Cancelled"}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-500 ${shipment.currentStatus === StatusEnum.Created ? 'w-1/4 bg-blue-500' :
                                            shipment.currentStatus === StatusEnum.InTransit ? 'w-3/4 bg-yellow-500' :
                                                shipment.currentStatus === StatusEnum.Delivered ? 'w-full bg-green-500' :
                                                    'w-0 bg-red-500'
                                            }`}>
                                    </div>
                                </div>
                            </div>

                            {/* Shipment Information Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Product Information */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold border-b pb-2">Product Information</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                            <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Product Name</p>
                                                <p className="text-base font-medium mt-1">{shipment.productName}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                                <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Origin</p>
                                                    <p className="text-base font-medium mt-1">{shipment.origin}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                                <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Destination</p>
                                                    <p className="text-base font-medium mt-1">{shipment.destination}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Blockchain Information */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold border-b pb-2">Thông tin blockchain</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                            <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Creator</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-sm font-mono bg-background p-2 rounded border flex-1 truncate">
                                                        {shipment.creator}
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => copyToClipboard(shipment.creator, "creator address")}
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                            <Truck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Carrier</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-sm font-mono bg-background p-2 rounded border flex-1 truncate">
                                                        {shipment.carrier}
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => copyToClipboard(shipment.carrier, "carrier address")}
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Enhanced Shipment Events Timeline */}
                    {isLoadingEvents ? (
                        <Card>
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto mb-4" />
                                    <p className="text-lg font-medium">Loading shipping history...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : events && events.length > 0 ? (
                        <Card className="border-2 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <Calendar className="h-6 w-6 text-primary" />
                                    Shipping History
                                </CardTitle>
                                <CardDescription>
                                    Timeline chi tiết các sự kiện trong quá trình vận chuyển
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {events.map((event, index) => (
                                        <div key={index} className="flex gap-4 relative">
                                            {/* Timeline dot and line */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10"></div>
                                                {index < events.length - 1 && (
                                                    <div className="w-px h-16 bg-border mt-2"></div>
                                                )}
                                            </div>

                                            {/* Event content */}
                                            <div className="flex-1 pb-8">
                                                <div className="bg-muted/30 rounded-lg p-4 border">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-semibold text-base">{event.eventType}</h4>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium">
                                                                {format(new Date(Number(event.timestamp) * 1000), 'dd/MM/yyyy', { locale: vi })}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {format(new Date(Number(event.timestamp) * 1000), 'HH:mm:ss', { locale: vi })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                                        <span className="text-sm">{event.location}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <User className="w-3 h-3" />
                                                            <span>Updated by:</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-mono bg-background px-2 py-1 rounded border">
                                                                {event.updatedBy.slice(0, 6)}...{event.updatedBy.slice(-4)}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6 w-6 p-0"
                                                                onClick={() => copyToClipboard(event.updatedBy, "updater address")}
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : searchCode && shipment && (
                        <Card>
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-lg font-medium mb-2">Chưa có sự kiện nào</p>
                                    <p className="text-muted-foreground">
                                        No events have been recorded for this shipment yet. Please check again later.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Quick Tips */}
            {!searchCode && (
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            Mẹo sử dụng
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>Shipment codes usually follow the format: SH-2025-XXX</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>Real-time information updates from blockchain</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>Click "Refresh" to update the latest information</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>You can copy wallet addresses by clicking the copy icon</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
