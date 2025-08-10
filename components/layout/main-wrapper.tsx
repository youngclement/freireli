"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainWrapperProps {
    children: React.ReactNode;
}

export function MainWrapper({ children }: MainWrapperProps) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <main className={cn(
            "flex-1",
            // Trang home không cần padding-top vì hero section cần full height
            // Các trang khác cần padding-top để không bị navbar che
            isHomePage ? "" : "pt-16"
        )}>
            {children}
        </main>
    );
}
