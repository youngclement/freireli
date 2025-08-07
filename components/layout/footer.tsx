"use client";

import Link from "next/link";
import { Package, Github, Twitter, Mail } from "lucide-react";
import { config } from "@/lib/config";

export function Footer() {
    return (
        <footer className="w-full bg-background border-t">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo và mô tả */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Package className="h-6 w-6 text-primary" />
                            <span className="font-bold text-lg">Freireli Logistics</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Hệ thống theo dõi logistics sử dụng công nghệ blockchain để đảm bảo tính minh bạch và bảo mật.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/logistics" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Tạo vận đơn
                                </Link>
                            </li>
                            <li>
                                <Link href="/track" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Tra cứu
                                </Link>
                            </li>
                            <li>
                                <Link href="/manage" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Quản lý
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/setup" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Hướng dẫn cài đặt
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Tài liệu API
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Liên hệ hỗ trợ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Network Info */}
                    <div>
                        <h3 className="font-semibold mb-4">Network</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-muted-foreground">
                                <span className="font-medium">Mạng:</span> Kairos Testnet
                            </li>
                            <li className="text-muted-foreground">
                                <span className="font-medium">Chain ID:</span> {config.network.kairos.chainId}
                            </li>
                            <li className="text-muted-foreground">
                                <span className="font-medium">RPC:</span> Ankr
                            </li>
                            <li>
                                <a
                                    href={config.network.kairos.explorerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Block Explorer ↗
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-sm text-muted-foreground">
                            © 2025 Freireli Logistics. All rights reserved.
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="mailto:support@freireli.com" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
