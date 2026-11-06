import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NOVA · AI 前端模板",
  description: "面向生成、分析、检索与自动化产品的高级 AI 前端界面母版。",
};

export default function AILayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
