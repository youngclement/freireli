"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { ModeToggleSimple } from "@/components/theme/mode-toggle-simple";

const navigation = [
    { name: "Tạo vận đơn", href: "/create" },
    { name: "Tra cứu", href: "/track" },
    { name: "Quản lý", href: "/manage" },
    { name: "Hướng dẫn", href: "/setup" },
];

export function Navbar() {
    const pathname = usePathname();
    const scrolled = useScroll(50);
    const isHomePage = pathname === "/";


    const getNavBackground = () => {
        if (isHomePage) {
            return scrolled
                ? "bg-background/80 backdrop-blur-md border-border/20"
                : "bg-transparent border-transparent";
        } else {
            return scrolled
                ? "bg-background/80 backdrop-blur-md"
                : "bg-background";
        }
    };

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200",
            getNavBackground()
        )}>
            <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16 relative">
                    {/* Left Navigation Pills */}
                    <div className="flex items-center gap-1.5">
                        {navigation.slice(0, 2).map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "h-8 px-4 py-2 rounded-full flex justify-center items-center cursor-pointer transition-all text-sm font-normal",
                                        isActive
                                            ? "bg-white text-black shadow-sm"
                                            : (isHomePage && !scrolled
                                                ? "bg-white/10 border border-white/30 backdrop-blur-sm text-white hover:bg-white/20"
                                                : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700")
                                    )}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Center Logo - Absolutely Centered */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link href="/" className={cn(
                            "text-lg font-normal font-brand leading-relaxed transition-colors hover:opacity-80",
                            isHomePage && !scrolled ? "text-white" : "text-foreground"
                        )}>
                            FREIRELI
                        </Link>
                    </div>

                    {/* Right Navigation Pills + Actions */}
                    <div className="flex items-center gap-1.5 ml-auto">
                        <div className="hidden md:flex items-center gap-1.5">
                            {navigation.slice(2).map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "h-8 px-4 py-2 rounded-full flex justify-center items-center cursor-pointer transition-all text-sm font-normal",
                                            isActive
                                                ? "bg-white text-black shadow-sm"
                                                : (isHomePage && !scrolled
                                                    ? "bg-white/10 border border-white/30 backdrop-blur-sm text-white hover:bg-white/20"
                                                    : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700")
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Dark Mode Toggle with Pill Style */}
                        <div className={cn(
                            "h-8 w-8 rounded-full flex justify-center items-center cursor-pointer transition-all",
                            isHomePage && !scrolled
                                ? "bg-white/10 border border-white/30 backdrop-blur-sm hover:bg-white/20"
                                : "bg-gray-100 border border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                        )}>
                            <ModeToggleSimple />
                        </div>

                        {/* Connect Wallet */}
                        <ConnectButton />
                    </div>
                </div>
            </div>            {/* Mobile navigation */}
            <div className="sm:hidden">
                <div className="pt-2 pb-3 space-y-2 px-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "block w-full h-10 px-4 py-2 rounded-full text-center transition-all text-sm font-normal",
                                    isActive
                                        ? "bg-white text-black shadow-sm"
                                        : (isHomePage && !scrolled
                                            ? "bg-white/10 border border-white/30 backdrop-blur-sm text-white hover:bg-white/20"
                                            : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700")
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Mobile Connect Wallet */}
                    <div className="pt-2">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}
