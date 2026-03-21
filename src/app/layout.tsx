import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev-Nexus | 20년차 개발자 포트폴리오",
  description: "50개 프로젝트로 보는 20년의 개발 여정. 풀스택, AI, 인프라까지.",
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
