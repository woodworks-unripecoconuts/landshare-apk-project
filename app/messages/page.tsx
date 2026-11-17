import type { Metadata } from "next";
import { ThreadList } from "@/components/messages/ThreadList";

export const metadata: Metadata = { title: "메시지" };

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <h1 className="text-xl font-extrabold">메시지</h1>
      <p className="mt-1 mb-4 text-sm text-soil-600">마당 신청마다 마당손님과 마당지기가 1:1로 이야기해요.</p>
      <ThreadList />
    </div>
  );
}
