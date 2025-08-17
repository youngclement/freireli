import { Geist, Geist_Mono, Instrument_Sans, Nunito } from "next/font/google";

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
export const brandFont = Nunito({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Font cho logistics section
export const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Danh sách tất cả font variables để dễ dàng sử dụng
export const fontVariables = [
  primaryFont.variable,
  monoFont.variable,
  brandFont.variable,
  instrumentSans.variable,
].join(" ");

// Export các class names để sử dụng trong components
export const fontClasses = {
  primary: "font-primary",
  mono: "font-mono",
  brand: "font-brand",
  instrument: "font-instrument",
} as const;

// Type cho font classes
export type FontClass = keyof typeof fontClasses;
