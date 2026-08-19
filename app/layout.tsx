import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbital Atlas — A Solar System Interface",
  description: "An interactive solar-system atlas where every world is an instrument.",
  openGraph: {
    title: "Orbital Atlas — A Solar System Interface",
    description: "Eight worlds. Eight instruments. Enter the solar system.",
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "Orbital Atlas solar system interface" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbital Atlas",
    description: "Eight worlds. Eight instruments. Enter the solar system.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
