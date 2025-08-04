import type { Metadata } from "next";
import Navigation from "./components/navigation";
import TFTOverlay from "./components/TFTOverlay";
import MonochromeNoiseOverlay from "./components/MonochromeNoiseOverlay";
import ColoredNoiseOverlay from "./components/ColoredNoiseOverlay";
import BloomEffect from "./components/BloomEffect";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./themeProvider";

export const metadata: Metadata = {
  title: "Josh Kotrous",
  description: "Founding Engineer @ Pensar",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased relative h-screen w-screen overflow-hidden transition-all`}
      >
        <ThemeProvider>
          <BloomEffect />

          <ColoredNoiseOverlay />
          {/* <MonochromeNoiseOverlay /> */}
          <TFTOverlay />
          <div className="relative z-10 overflow-auto size-full flex flex-col">
            <Navigation />
            <div className="p-4 pt-0 size-full">{children}</div>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
