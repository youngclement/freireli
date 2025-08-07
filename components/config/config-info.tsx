"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import { config } from "@/lib/config";
import { toast } from "sonner";
import Link from "next/link";

export function ConfigInfo() {
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Đã copy ${label} vào clipboard`);
    };

    const isDefaultContractAddress = config.contract.logisticsAddress === "0x1234567890123456789012345678901234567890";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contract Configuration */}
            <Card className={isDefaultContractAddress ? "border-yellow-500" : "border-green-500"}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {isDefaultContractAddress ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        Contract Configuration
                    </CardTitle>
                    <CardDescription>
                        {isDefaultContractAddress
                            ? "Cần cập nhật địa chỉ contract thực tế"
                            : "Contract đã được cấu hình"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Contract Address:</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(config.contract.logisticsAddress, "địa chỉ contract")}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                        <p className="text-xs font-mono break-all text-muted-foreground">
                            {config.contract.logisticsAddress}
                        </p>
                    </div>

                    {isDefaultContractAddress && (
                        <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                ⚠️ Đây là địa chỉ mặc định. Vui lòng cập nhật địa chỉ contract thực tế trong file .env.local
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Network Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Network Configuration
                    </CardTitle>
                    <CardDescription>Cấu hình mạng Kairos Testnet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">RPC URL:</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(config.network.kairos.rpcUrl, "RPC URL")}
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground break-all">
                        {config.network.kairos.rpcUrl}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Chain ID:</span>
                        <Badge variant="outline">{config.network.kairos.chainId}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Explorer:</span>
                        <Link
                            href={config.network.kairos.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 text-xs"
                        >
                            Xem <ExternalLink className="h-3 w-3" />
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* App Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        App Configuration
                    </CardTitle>
                    <CardDescription>Thông tin ứng dụng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <span className="text-sm font-medium">App Name:</span>
                        <p className="text-sm text-muted-foreground">{config.app.name}</p>
                    </div>

                    <div>
                        <span className="text-sm font-medium">Description:</span>
                        <p className="text-sm text-muted-foreground">{config.app.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Environment:</span>
                        <Badge variant={config.isDevelopment ? "default" : "secondary"}>
                            {config.isDevelopment ? "Development" : "Production"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* WalletConnect Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        WalletConnect
                    </CardTitle>
                    <CardDescription>Cấu hình kết nối ví</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Project ID:</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(config.walletConnect.projectId, "Project ID")}
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground break-all">
                        {config.walletConnect.projectId}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Faucet:</span>
                        <Link
                            href={config.external.faucetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 text-xs"
                        >
                            Lấy test KLAY <ExternalLink className="h-3 w-3" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
