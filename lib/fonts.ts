import { Geist, Geist_Mono, Gugi } from "next/font/google";

// Font chính cho toàn bộ website
export const primaryFont = Geist({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

// Font cho code/monospace
export const monoFont = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Font cho thương hiệu/brand (FREIRELI)
export const brandFont = Gugi({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Danh sách tất cả font variables để dễ dàng sử dụng
export const fontVariables = [
  primaryFont.variable,
  monoFont.variable,
  brandFont.variable,
].join(" ");

// Export các class names để sử dụng trong components
export const fontClasses = {
  primary: "font-primary",
  mono: "font-mono",
  brand: "font-brand",
} as const;

// Type cho font classes
export type FontClass = keyof typeof fontClasses;
