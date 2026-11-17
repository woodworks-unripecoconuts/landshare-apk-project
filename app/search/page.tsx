import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "@/components/search/SearchClient";
import { LoadingBlock } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "마당 찾기" };

export default function SearchPage() {
  return (
    // 주소창 조건(?region=...)은 브라우저에서 읽기 때문에 Suspense로 감쌉니다.
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-4">
          <LoadingBlock />
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
