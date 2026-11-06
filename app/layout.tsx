import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "轨道星图 · 太阳系交互界面",
  description: "一个以八颗行星为仪器的交互式太阳系星图。",
  openGraph: {
    title: "轨道星图 · 太阳系交互界面",
    description: "八颗行星，八种观测仪器。进入已知宇宙。",
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "Orbital Atlas solar system interface" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "轨道星图",
    description: "八颗行星，八种观测仪器。进入已知宇宙。",
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
