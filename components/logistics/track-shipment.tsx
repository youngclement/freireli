"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetShipment, useGetShipmentEvents } from "@/hooks/use-logistics";
import { StatusEnum } from "@/lib/contracts";
import { Search, Package, MapPin, User, Calendar, Truck } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const getStatusText = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Created:
            return "Đã tạo";
        case StatusEnum.InTransit:
            return "Đang vận chuyển";
        case StatusEnum.Delivered:
            return "Đã giao";
        case StatusEnum.Cancelled:
            return "Đã hủy";
        default:
            return "Không xác định";
    }
};

const getStatusColor = (status: StatusEnum) => {
    switch (status) {
        case StatusEnum.Created:
            return "bg-blue-500";
        case StatusEnum.InTransit:
            return "bg-yellow-500";
        case StatusEnum.Delivered:
            return "bg-green-500";
        case StatusEnum.Cancelled:
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
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
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Search Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Tra Cứu Vận Đơn
                    </CardTitle>
                    <CardDescription>
                        Nhập mã vận đơn để theo dõi tình trạng giao hàng
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Nhập mã vận đơn"
                            value={shipmentCode}
                            onChange={(e) => setShipmentCode(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch} disabled={!shipmentCode.trim()}>
                            Tra cứu
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Shipment Details */}
            {searchCode && (
                <>
                    {isLoadingShipment ? (
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">Đang tải thông tin vận đơn...</div>
                            </CardContent>
                        </Card>
                    ) : shipment ? (
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Thông Tin Vận Đơn: {shipment.shipmentCode}
                                        </CardTitle>
                                        <CardDescription>
                                            Tạo lúc: {format(new Date(Number(shipment.createdAt) * 1000), 'PPpp', { locale: vi })}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className={getStatusColor(shipment.currentStatus)}>
                                            {getStatusText(shipment.currentStatus)}
                                        </Badge>
                                        <Button variant="outline" size="sm" onClick={handleRefresh}>
                                            Làm mới
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Sản phẩm:</span>
                                            <span>{shipment.productName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Xuất phát:</span>
                                            <span>{shipment.origin}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Đích đến:</span>
                                            <span>{shipment.destination}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Người tạo:</span>
                                            <span className="text-sm font-mono">{shipment.creator}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Nhà vận chuyển:</span>
                                            <span className="text-sm font-mono">{shipment.carrier}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center text-muted-foreground">
                                    Không tìm thấy vận đơn với mã: {searchCode}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Shipment Events */}
                    {isLoadingEvents ? (
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">Đang tải lịch sử vận chuyển...</div>
                            </CardContent>
                        </Card>
                    ) : events && events.length > 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Lịch Sử Vận Chuyển
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {events.map((event, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                                                {index < events.length - 1 && (
                                                    <div className="w-px h-12 bg-border"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">{event.eventType}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            <MapPin className="inline h-3 w-3 mr-1" />
                                                            {event.location}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground font-mono">
                                                            Cập nhật bởi: {event.updatedBy}
                                                        </p>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {format(new Date(Number(event.timestamp) * 1000), 'PPpp', { locale: vi })}
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
                            <CardContent className="p-6">
                                <div className="text-center text-muted-foreground">
                                    Chưa có sự kiện nào được ghi nhận cho vận đơn này
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
