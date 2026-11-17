import type { Metadata } from "next";
import { SpaceDetailClient } from "@/components/space/SpaceDetailClient";

export const metadata: Metadata = { title: "마당 상세" };

/**
 * 공간 상세 페이지.
 * 서버에서는 주소의 id만 꺼내 넘기고, 실제 데이터는 브라우저에서 불러옵니다(SpaceDetailClient).
 */
export default async function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SpaceDetailClient id={id} />;
}
