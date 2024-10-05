import type { Metadata } from "next";
import Navigation from "./components/navigation";
import "./globals.css";

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
      <body className={`antialiased`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
