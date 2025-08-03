import type { Metadata } from "next";
import Navigation from "./components/navigation";
import TFTOverlay from "./components/TFTOverlay";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Josh Kotrous",
  description: "Founding Engineer @ Pensar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased relative`}>
        <TFTOverlay />
        <div className="relative z-10">
          <Navigation />
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
