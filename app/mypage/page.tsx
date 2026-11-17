import type { Metadata } from "next";
import { Suspense } from "react";
import { MyPageClient } from "@/components/mypage/MyPageClient";

export const metadata: Metadata = { title: "마이페이지" };

export default function MyPage() {
  return (
    <Suspense fallback={<div className="mx-auto mt-6 h-40 max-w-2xl animate-pulse rounded-2xl bg-soil-100" />}>
      <MyPageClient />
    </Suspense>
  );
}
