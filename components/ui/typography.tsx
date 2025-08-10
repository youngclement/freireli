import { cn } from "@/lib/utils";
import { fontClasses, type FontClass } from "@/lib/fonts";
import { ElementType, ReactNode } from "react";

interface TypographyProps {
    children: ReactNode;
    font?: FontClass;
    className?: string;
    as?: ElementType;
}

/**
 * Typography component với font preset
 * Sử dụng để đảm bảo consistency trong việc sử dụng fonts
 */
export function Typography({
    children,
    font = "primary",
    className = "",
    as: Component = "div"
}: TypographyProps) {
    return (
        <Component className={cn(fontClasses[font], className)}>
            {children}
        </Component>
    );
}

// Preset components cho các loại typography thường dùng
export function BrandText({ children, className = "", ...props }: Omit<TypographyProps, "font">) {
    return (
        <Typography font="brand" className={cn("font-normal", className)} {...props}>
            {children}
        </Typography>
    );
}

export function CodeText({ children, className = "", ...props }: Omit<TypographyProps, "font">) {
    return (
        <Typography font="mono" className={cn("text-sm", className)} {...props}>
            {children}
        </Typography>
    );
}

export function BodyText({ children, className = "", ...props }: Omit<TypographyProps, "font">) {
    return (
        <Typography font="primary" className={className} {...props}>
            {children}
        </Typography>
    );
}
