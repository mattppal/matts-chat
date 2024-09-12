import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AI_CONFIG } from "./config/ai-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: AI_CONFIG.name,
  description: `Chat with ${AI_CONFIG.model}`,
  openGraph: {
    title: AI_CONFIG.name,
    description: `Chat with ${AI_CONFIG.model}`,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${AI_CONFIG.name} Open Graph Image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: AI_CONFIG.name,
    description: `Chat with ${AI_CONFIG.model}`,
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
