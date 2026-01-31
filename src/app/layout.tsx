import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VendorGuard Lite",
  description: "Modern Vendor Risk Management",
};

import { VendorProvider } from "@/context/VendorContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30`}
      >
        <VendorProvider>
          <Sidebar />
          <main className="pl-64 min-h-screen">
            <div className="container mx-auto p-8 max-w-6xl">
              {children}
            </div>
          </main>
        </VendorProvider>
      </body>
    </html>
  );
}
