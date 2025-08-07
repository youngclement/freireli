"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Package, Search, Settings, Home, Book } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Logistics", href: "/logistics", icon: Package },
    { name: "Tạo vận đơn", href: "/create", icon: Package },
    { name: "Tra cứu", href: "/track", icon: Search },
    { name: "Quản lý", href: "/manage", icon: Settings },
    { name: "Hướng dẫn", href: "/setup", icon: Book },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="w-full border-b">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Package className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold">Freireli Logistics</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                                            pathname === item.href
                                                ? "border-primary text-primary"
                                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                                        )}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <ConnectButton />
                    </div>
                </div>
            </div>

            {/* Mobile navigation */}
            <div className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                                    pathname === item.href
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-gray-50 hover:border-gray-300"
                                )}
                            >
                                <Icon className="h-4 w-4 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
