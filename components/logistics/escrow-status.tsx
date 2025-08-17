"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetShipment, useIsEscrowReleased } from "@/hooks/use-logistics";
import { StatusEnum } from "@/lib/contracts";
import { CheckCircle, Clock, Shield, Wallet, XCircle } from "lucide-react";
import { formatEther } from "viem";

interface EscrowStatusProps {
    shipmentCode: string;
}

export function EscrowStatus({ shipmentCode }: EscrowStatusProps) {
    const { shipment, isLoading } = useGetShipment(shipmentCode);
    const { isReleased, isRefunded, depositAmount } = useIsEscrowReleased(shipmentCode);

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">Loading escrow status...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!shipment || !depositAmount || depositAmount === BigInt(0)) {
        return (
            <Card className="w-full border-gray-200">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">No Escrow</CardTitle>
                            <CardDescription>This shipment has no escrow deposit</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        );
    }

    const getEscrowStatus = () => {
        if (isReleased) {
            return {
                status: "Released",
                icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                color: "bg-green-100 text-green-800 border-green-200",
                description: "Funds have been released to the carrier"
            };
        }

        if (isRefunded) {
            return {
                status: "Refunded",
                icon: <XCircle className="w-5 h-5 text-red-500" />,
                color: "bg-red-100 text-red-800 border-red-200",
                description: "Funds have been refunded to the creator"
            };
        }

        if (shipment.currentStatus === StatusEnum.Canceled) {
            return {
                status: "Pending Refund",
                icon: <Clock className="w-5 h-5 text-yellow-500" />,
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                description: "Refund will be processed automatically"
            };
        }

        if (shipment.currentStatus === StatusEnum.Delivered) {
            return {
                status: "Pending Release",
                icon: <Clock className="w-5 h-5 text-blue-500" />,
                color: "bg-blue-100 text-blue-800 border-blue-200",
                description: "Release to carrier will be processed automatically"
            };
        }

        return {
            status: "Held in Escrow",
            icon: <Shield className="w-5 h-5 text-blue-500" />,
            color: "bg-blue-100 text-blue-800 border-blue-200",
            description: "Funds are safely held in smart contract"
        };
    };

    const escrowInfo = getEscrowStatus();

    return (
        <Card className="w-full">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg">Escrow Status</CardTitle>
                        <CardDescription>
                            Deposit: {formatEther(depositAmount)} ETH
                        </CardDescription>
                    </div>
                    <Badge className={escrowInfo.color}>
                        <div className="flex items-center gap-1">
                            {escrowInfo.icon}
                            {escrowInfo.status}
                        </div>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Deposit Amount</span>
                            <span className="font-mono font-bold">{formatEther(depositAmount)} ETH</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{escrowInfo.description}</p>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>• <strong>Auto Release:</strong> Funds automatically released when status changes to &ldquo;Delivered&rdquo;</p>
                        <p>• <strong>Auto Refund:</strong> Funds automatically refunded when status changes to &ldquo;Canceled&rdquo;</p>
                        <p>• <strong>Security:</strong> Smart contract ensures transparent and secure transactions</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
