import type { NextConfig } from "next";

/**
 * 마당공유 Next.js 설정
 *
 * - Netlify의 Next.js 자동 지원(OpenNext 어댑터)으로 배포합니다. Vercel 전용 설정은 쓰지 않습니다.
 * - output: "export"(정적 내보내기)는 쓰지 않습니다. 새로 등록한 마당의 상세 페이지(/spaces/[id])를
 *   새로고침해도 열리게 하려면 동적 라우트가 필요하기 때문입니다.
 */
const nextConfig: NextConfig = {
  images: {
    // 프로토타입에서는 이미지 최적화 서버를 거치지 않고 원본 주소 그대로 보여줍니다.
    // → Netlify 배포 후 외부 placeholder 이미지나 브라우저에서 만든 미리보기(data URL)가 깨지지 않습니다.
    unoptimized: true,
    // 나중에 최적화를 켤 때(unoptimized: false) 허용할 외부 이미지 주소 목록입니다.
    // Supabase Storage를 쓰게 되면 "<프로젝트>.supabase.co" 를 여기에 추가하세요.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
