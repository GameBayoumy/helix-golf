import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helix Dojo — Master the Editor",
  description: "Interactive Helix Editor training. Learn selection-first editing through challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen grid-bg">
        {/* CRT Overlay Effect */}
        <div className="crt-overlay" />
        
        {/* Ambient Glow */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-radial from-[#ff6b6b]/10 to-transparent blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-radial from-[#4ecdc4]/10 to-transparent blur-3xl" />
        </div>
        
        {children}
      </body>
    </html>
  );
}