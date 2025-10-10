import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";

const RobotoSlab = Roboto_Slab({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Payvoice",
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
        {children}
      </body>
    </html>
  );
}
