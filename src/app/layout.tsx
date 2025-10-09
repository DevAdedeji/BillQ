import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const ManropeFont = Manrope({
  variable: "--font-manrope",
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
        className={`${ManropeFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
