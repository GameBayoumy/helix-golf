import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helix Dojo — The Art of Text Editing",
  description: "Master Helix Editor through deliberate practice. A training ground for the selection-first workflow.",
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
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen">
        {/* Paper Texture Overlay */}
        <div className="paper-texture" />
        
        {children}
      </body>
    </html>
  );
}
