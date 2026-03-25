// 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Ye Global Metadata hai
export const metadata: Metadata = {
  title: {
    default: "MyToolsHub - Free Online Developer Tools",
    template: "%s | MyToolsHub",
  },
  description: "Free online tools for developers and designers. Compress images, format JSON, generate QR codes, and more. Fast and secure.",
  keywords: ["online tools", "developer tools", "image compressor", "json formatter", "web tools"],
  authors: [{ name: "Syed Anas" }],
  
  // Yahan Verification add hogi
  verification: {
    google: "4razs74pssDhzsttCA0hcOcB5iq38aGRqoHWz3UxHpE",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://developer-tools-uz59.vercel.app", // Yahan apna live link dalein
    siteName: "MyToolsHub",
    title: "MyToolsHub - Free Online Tools",
    description: "Collection of free tools for daily tasks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyToolsHub",
    description: "Free online tools for developers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}