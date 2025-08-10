import type { Metadata } from "next";
import "./globals.css";
import { WalletProviders } from "@/providers/wallet-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MainWrapper } from "@/components/layout/main-wrapper";
// import { Toaster } from "@/components/ui/sonner";
import { config } from "@/lib/config";
import "@/lib/env-validation"; // Import validation để chạy khi app khởi động
import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: config.app.name,
  description: config.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${fontVariables} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProviders>
            <div className="min-h-screen bg-background flex flex-col">
              <Navbar />
              <MainWrapper>
                {children}
              </MainWrapper>
              <Footer />
            </div>
            <Toaster
              theme={undefined}
              className="toaster group"
              toastOptions={{
                classNames: {
                  toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                  description: "group-[.toast]:text-muted-foreground",
                  actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                  cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
              }}
            />
          </WalletProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
