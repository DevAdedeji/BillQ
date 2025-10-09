import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const DMSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Instavoice",
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
        className={`${DMSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
