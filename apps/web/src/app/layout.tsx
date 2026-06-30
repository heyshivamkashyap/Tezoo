import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/config/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import TopLoader from "@/components/top-loader";
import { Toaster } from "@/components/ui/sonner";
import AppProvider from "@/components/app-provider";

export const metadata: Metadata = {
  title: {
    default: "Tezoo - Shop Smarter, Save More, Best Deals, Lowest Prices",
    template: "%s | Tezoo",
  },
  description:
    "Tezoo is a modern e-commerce platform for seamless online shopping and store management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables}`} suppressHydrationWarning>
      <body>
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <TopLoader />
            {children}
            <Toaster position="top-right" closeButton />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
