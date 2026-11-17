import type { Metadata } from "next";
import { RoleGate } from "@/components/auth/RoleGate";
import { DiaryWriteClient } from "@/components/diary/DiaryWriteClient";

export const metadata: Metadata = { title: "마당 일기 쓰기" };

export default async function DiaryWritePage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return (
    <RoleGate allow={["guest"]} reason="마당 일기는 마당손님만 쓸 수 있어요.">
      <DiaryWriteClient bookingId={bookingId} />
    </RoleGate>
  );
}
