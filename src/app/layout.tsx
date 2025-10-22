import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import NextAuthProvider from "@/providers/session-provider";
import { Toaster } from "sonner";

const RobotoSlab = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BillQ — Smart Invoicing for Freelancers",
    template: "%s | BillQ",
  },
  description:
    "BillQ helps freelancers and small businesses create invoices, send PayLinks, and get paid faster — powered by AI and Stripe.",
  openGraph: {
    title: "BillQ — Smart Invoicing for Freelancers",
    description:
      "Create invoices in seconds with AI, share payment links, and get paid seamlessly through Stripe or Paystack.",
    url: "https://billq.vercel.app",
    siteName: "BillQ",
    images: [
      {
        url: "https://billq.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "BillQ — AI-powered Invoicing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BillQ — Smart Invoicing for Freelancers",
    description:
      "Generate invoices with AI, send payment links, and track payments effortlessly.",
    images: ["https://billq.vercel.app/og-image.png"],
    creator: "@yourhandle",
  },
  icons: {
    icon: "/favicon.ico",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${RobotoSlab.className} antialiased tracking-wide`}
      >
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
