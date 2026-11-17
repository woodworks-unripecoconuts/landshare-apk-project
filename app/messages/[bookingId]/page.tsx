import type { Metadata } from "next";
import { ChatRoom } from "@/components/messages/ChatRoom";

export const metadata: Metadata = { title: "대화" };

export default async function ChatPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return <ChatRoom bookingId={bookingId} />;
}
