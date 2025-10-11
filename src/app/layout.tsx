import type { Metadata } from "next"
import { Roboto_Slab } from "next/font/google"
import "./globals.css"
import NextAuthProvider from "@/providers/session-provider";
import { Toaster } from "sonner";

const RobotoSlab = Roboto_Slab({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "PayInvoice",
  description: "Invoicing made effortless",
};

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
