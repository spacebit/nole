import type { Metadata } from "next";
import {  Unbounded, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/modules/Header";
import Footer from "@/components/modules/Footer";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: "Nole | Build, Own, Trade. Just Vibe.",
  description: "Create, mint, and swap NFTs and tokens with style.",
  openGraph: {
    title: "Nole Marketplace",
    description: "Create, mint, and swap NFTs and tokens with style",
    url: "https://nole.market", // TODO: update
    siteName: "Nole Marketplace",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nole Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nole | Build, Own, Trade. Just Vibe.",
    description: "A launchpad for digital assets",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${sora.variable} ${unbounded.variable}`}>
      <body className="antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
