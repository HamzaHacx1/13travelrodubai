import "./globals.css";

import { Geist_Mono, Figtree } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${figtree.className} ${figtree.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
