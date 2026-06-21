import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Global 文档翻译',
  description: '扫描 GitHub 仓库并提交 Markdown 翻译任务',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="font-sans">
      <body>{children}</body>
    </html>
  );
}
