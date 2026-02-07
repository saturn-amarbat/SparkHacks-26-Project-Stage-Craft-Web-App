import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { CartSheet } from "@/components/cart/cart-sheet";
import { Toaster } from "sonner";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = localFont({
  src: "./fonts/InterVF.woff2",
  variable: "--font-inter",
  weight: "100 900",
});

const playfair = localFont({
  src: "./fonts/PlayfairDisplayVF.woff2",
  variable: "--font-playfair",
  weight: "400 900",
});

export const metadata: Metadata = {
  title: "StageCraft - AI-Powered Theatrical Marketplace",
  description: "Rent costumes, props, and equipment with intelligent AI recommendations for your theatrical productions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} antialiased`}
      >
        <SmoothScroll>
          <Header />
          {children}
          <CartSheet />
          <Toaster position="top-right" richColors />
        </SmoothScroll>
      </body>
    </html>
  );
}
