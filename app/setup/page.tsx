import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Code, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { config } from "@/lib/config";
import { ConfigInfo } from "@/components/config/config-info";
import Link from "next/link";

export default function SetupPage() {
    return (
        <div className="w-full py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Setup Guide</h1>
                    <p className="text-muted-foreground">
                        Required steps to use {config.app.name} system
                    </p>
                </div>

                {/* Alert */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Important:</strong> You need to update environment variables in <code>.env.local</code> file after deploying smart contract to Kairos testnet.
                    </AlertDescription>
                </Alert>

                {/* Current Configuration */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Current Configuration</h2>
                    <ConfigInfo />
                </div>

                {/* Steps */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">1</Badge>
                                Install MetaMask Wallet
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Install MetaMask and add Kairos Testnet network:</p>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="font-medium mb-2">Kairos Testnet Network Information:</p>
                                <ul className="space-y-1 text-sm">
                                    <li><strong>Network Name:</strong> Kairos Testnet</li>
                                    <li><strong>RPC URL:</strong> {config.network.kairos.rpcUrl}</li>
                                    <li><strong>Chain ID:</strong> {config.network.kairos.chainId}</li>
                                    <li><strong>Currency Symbol:</strong> KLAY</li>
                                    <li><strong>Block Explorer:</strong> {config.network.kairos.explorerUrl}</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">2</Badge>
                                Get Test KLAY
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Access Kairos Testnet Faucet to get test KLAY:</p>
                            <div className="bg-muted p-4 rounded-lg mt-2 flex items-center justify-between">
                                <code>{config.external.faucetUrl}</code>
                                <Link
                                    href={config.external.faucetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-primary hover:underline flex items-center gap-1"
                                >
                                    Open <ExternalLink className="h-3 w-3" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">3</Badge>
                                Cấu Hình Environment Variables
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Tạo file <code>.env.local</code> và cấu hình các giá trị:</p>
                            <div className="bg-muted p-4 rounded-lg">
                                <pre className="text-sm overflow-x-auto">
                                    {`# Contract Address - UPDATE AFTER DEPLOYING
NEXT_PUBLIC_LOGISTICS_CONTRACT_ADDRESS=your_deployed_contract_address

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${config.walletConnect.projectId}

# Network Configuration
NEXT_PUBLIC_KAIROS_RPC_URL=${config.network.kairos.rpcUrl}
NEXT_PUBLIC_KAIROS_CHAIN_ID=${config.network.kairos.chainId}
NEXT_PUBLIC_KAIROS_EXPLORER_URL=${config.network.kairos.explorerUrl}

# App Configuration
NEXT_PUBLIC_APP_NAME=${config.app.name}
NEXT_PUBLIC_APP_DESCRIPTION=${config.app.description}

# Faucet URL
NEXT_PUBLIC_FAUCET_URL=${config.external.faucetUrl}`}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">4</Badge>
                                Deploy Smart Contract
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Deploy file <code>freireli.sol</code> lên Kairos testnet bằng Remix IDE hoặc Hardhat.</p>
                            <Alert>
                                <Code className="h-4 w-4" />
                                <AlertDescription>
                                    Sau khi deploy thành công, copy địa chỉ contract và cập nhật trong file <code>.env.local</code>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Sẵn Sàng Sử Dụng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Bây giờ bạn có thể:</p>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                                <li>Kết nối ví MetaMask</li>
                                <li>Tạo vận đơn mới</li>
                                <li>Tra cứu thông tin vận đơn</li>
                                <li>Cập nhật trạng thái và thêm sự kiện</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Features Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chức Năng Có Sẵn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium mb-2">Tạo Vận Đơn</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Tạo vận đơn với thông tin chi tiết</li>
                                    <li>• Gán nhà vận chuyển</li>
                                    <li>• Lưu trữ trên blockchain</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Tra Cứu Vận Đơn</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Tìm kiếm theo mã vận đơn</li>
                                    <li>• Xem thông tin chi tiết</li>
                                    <li>• Theo dõi lịch sử vận chuyển</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Quản Lý Vận Đơn</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Thêm sự kiện vận chuyển</li>
                                    <li>• Cập nhật trạng thái</li>
                                    <li>• Ghi nhận vị trí hiện tại</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Bảo Mật Blockchain</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Dữ liệu không thể thay đổi</li>
                                    <li>• Minh bạch và có thể kiểm tra</li>
                                    <li>• Phân quyền người dùng</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* UI Features */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tính Năng Giao Diện</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium mb-2">Dark/Light Mode</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Chuyển đổi theme dark/light</li>
                                    <li>• Tự động theo system theme</li>
                                    <li>• Toggle button trên header</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Responsive Design</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Tương thích mobile</li>
                                    <li>• Layout linh hoạt</li>
                                    <li>• Navigation thu gọn</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
