import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { PageNotice } from "@/components/layout/PageNotice";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { SERVICE_NAME, SLOGAN } from "@/data/policies";

export const metadata: Metadata = {
  title: {
    default: `${SERVICE_NAME} · ${SLOGAN}`,
    template: `%s · ${SERVICE_NAME}`,
  },
  description: "강원의 남는 마당·주택 마당·농지를 무료로 나누는 캠핑·차박·나들이 공유 서비스 (프로토타입)",
  icons: { icon: "/logo.svg", apple: "/icons/icon-192.png" },
  // 프로토타입이므로 검색엔진에 노출하지 않습니다.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2f5d3a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* 한글 웹폰트 Pretendard (필요한 글자만 내려받는 방식). 못 불러와도 기본 글꼴로 보입니다. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <PageNotice />
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
