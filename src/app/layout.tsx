import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "KollegeAI - AI Powered Q&A Assistant for MBA Admissions",
  description:
    "KollegeAI helps prospective students quickly find accurate answers to their MBA admissions questions through an AI-powered, interactive Q&A platform. Simplify your search and get sharp, relevant information instantly.",
  icons: {
    icon: "/icon/kollege-ai-letter.png", // You can specify a PNG or other formats
    shortcut: "/icon/kollege-ai-letter.png", // Define a shortcut icon if needed
    apple: "/icon/kollege-ai-letter.png", // Define an Apple touch icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-TQDVLSNP" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
