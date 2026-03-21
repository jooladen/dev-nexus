import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev-Nexus | 만들고 싶은 걸 만들다 보니 여기까지",
  description: "바이브 코딩으로 만든 프로젝트 모음. 각각의 이유와 인사이트.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
