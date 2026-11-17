"use client";

/** 신청 건별 1:1 대화방 + 신청 요약 + 상태 버튼 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, LockOpen, NotebookPen, Send, Users } from "lucide-react";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatDateTime, formatRange } from "@/lib/domain/dates";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { BookingActions } from "@/components/booking/BookingActions";
import { EmptyState, LoadingBlock } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

export function ChatRoom({ bookingId }: { bookingId: string }) {
  const { user } = useAuth();
  const toast = useToast();
  const detail = useRepoQuery(() => repo.bookings.get(bookingId), [bookingId], ["bookings", "diaries"]);
  const spaceId = detail.data?.booking.spaceId;
  const messages = useRepoQuery(
    () => (detail.data ? repo.messages.listByBooking(bookingId) : Promise.resolve([])),
    [bookingId, !!detail.data],
    ["messages"],
  );
  const priv = useRepoQuery(
    () => (spaceId ? repo.spaces.getPrivate(spaceId) : Promise.resolve(null)),
    [spaceId, detail.data?.booking.status],
    ["bookings"],
  );
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const count = messages.data?.length ?? 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [count]);

  if (detail.loading) return <div className="mx-auto max-w-2xl p-4"><LoadingBlock /></div>;
  if (!detail.data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <EmptyState emoji="🔒" title="볼 수 없는 대화예요" description="이 신청의 마당손님·마당지기만 볼 수 있어요.">
          <LinkButton href="/messages">메시지 목록</LinkButton>
        </EmptyState>
      </div>
    );
  }

  const { booking, space, guest, host, hasDiary } = detail.data;
  const iAmGuest = user?.id === booking.guestId;
  const iAmParticipant = iAmGuest || user?.id === booking.hostId;
  const other = iAmGuest ? host : guest;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await repo.messages.send(bookingId, text);
      setText("");
    } catch (err) {
      toast(err instanceof Error ? err.message : "보내지 못했어요.", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-4 pt-3 pb-36 md:pb-24">
      <Link href="/messages" className="mb-2 flex items-center gap-1 text-sm font-semibold text-soil-600">
        <ArrowLeft className="size-4" /> 메시지 목록
      </Link>

      {/* 신청 요약 */}
      <section className="space-y-2 rounded-2xl border border-soil-200/70 bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <BookingStatusBadge status={booking.status} />
          <p className="text-sm text-soil-600">
            {iAmGuest ? "마당지기" : "마당손님"} <b>{other?.name}</b>
          </p>
        </div>
        <Link href={space ? `/spaces/${space.id}` : "#"} className="block font-bold hover:underline">
          {space?.title ?? "삭제된 마당"}
        </Link>
        <p className="flex flex-wrap gap-x-3 text-sm text-soil-700">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4" /> {formatRange(booking.startDate, booking.endDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-4" /> {booking.guests}명 · 차 {booking.vehicles}대
          </span>
        </p>
        {priv.data && (booking.status === "approved" || booking.status === "completed") && (
          <p className="flex items-start gap-1.5 rounded-xl bg-grass-50 p-2.5 text-sm text-grass-900">
            <LockOpen className="mt-0.5 size-4 shrink-0" />
            <span>
              <b>정확한 주소</b>: {priv.data.address}
            </span>
          </p>
        )}
        {booking.status === "requested" && iAmGuest && (
          <p className="text-xs text-soil-500">마당지기가 승인하면 정확한 주소가 여기에 보여요.</p>
        )}
        <BookingActions booking={booking} size="sm" />
        {iAmGuest && booking.status === "completed" && !hasDiary && (
          <LinkButton href={`/diary/write/${booking.id}`} size="sm">
            <NotebookPen className="size-4" /> 마당 일기 쓰기
          </LinkButton>
        )}
      </section>

      {/* 대화 */}
      <ul className="mt-4 space-y-3" aria-label="대화 내용">
        {(messages.data ?? []).map((m) => {
          if (m.senderId === "system") {
            return (
              <li key={m.id} className="text-center">
                <span className="inline-block rounded-full bg-soil-100 px-3 py-1 text-xs text-soil-700">{m.text}</span>
              </li>
            );
          }
          const mine = m.senderId === user?.id;
          const who = m.senderId === booking.guestId ? guest : host;
          return (
            <li key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
              {!mine && <span className="mb-0.5 text-xs text-soil-500">{who?.name}</span>}
              <p
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2 text-[15px] whitespace-pre-line",
                  mine ? "rounded-br-sm bg-grass-600 text-white" : "rounded-bl-sm bg-white text-ink shadow-soft",
                )}
              >
                {m.text}
              </p>
              <span className="mt-0.5 text-[11px] text-soil-400">{formatDateTime(m.createdAt)}</span>
            </li>
          );
        })}
      </ul>
      <div ref={bottomRef} />

      {/* 입력창 */}
      {iAmParticipant ? (
        <form
          onSubmit={send}
          className="fixed inset-x-0 bottom-16 z-30 border-t border-soil-200 bg-white px-4 py-2.5 md:bottom-0"
        >
          <div className="mx-auto flex max-w-2xl gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="메시지를 입력하세요"
              maxLength={1000}
              className="h-11 flex-1 rounded-full border border-soil-200 bg-soil-50 px-4 text-[15px] outline-none focus:border-grass-500"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              aria-label="보내기"
              className="flex size-11 items-center justify-center rounded-full bg-grass-600 text-white disabled:opacity-40"
            >
              <Send className="size-5" />
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-6 text-center text-sm text-soil-500">관리자는 대화를 읽기만 할 수 있어요.</p>
      )}
    </div>
  );
}
