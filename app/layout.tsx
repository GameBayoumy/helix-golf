import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Helix Dojo - Practice Helix In The Browser",
  description: "Practice a real Helix subset in the browser with cursor, selection, and buffer-aware challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="paper-texture" />
        {children}
      </body>
    </html>
  );
}
