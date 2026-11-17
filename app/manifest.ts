import type { MetadataRoute } from "next";

/**
 * PWA 설정 — 안드로이드 크롬에서 '홈 화면에 추가'하면 앱처럼 열립니다.
 * 나중에 이 사이트 주소를 TWA(Bubblewrap/PWABuilder)로 감싸면 Play 스토어용 안드로이드 앱이 됩니다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "마당공유 - 남는 마당, 함께 쓰는 쉼터",
    short_name: "마당공유",
    description: "강원의 남는 마당을 무료로 나누는 캠핑·차박·나들이 공유 (프로토타입)",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e6",
    theme_color: "#4f7a3a",
    lang: "ko",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
