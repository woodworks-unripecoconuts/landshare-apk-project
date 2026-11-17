"use client";

import Link from "next/link";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatDateTime, formatRange } from "@/lib/domain/dates";
import { SpaceImage } from "@/components/space/SpaceImage";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { EmptyState, ErrorBox, LoadingBlock } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";

/** 메시지 목록: 마당 신청 1건 = 대화방 1개 */
export function ThreadList() {
  const { user, role } = useAuth();
  const { data, loading, error } = useRepoQuery(() => repo.messages.listThreads(), [], ["messages", "bookings"]);

  if (role === "admin") {
    return (
      <EmptyState emoji="🛠️" title="관리자 계정에는 대화가 없어요" description="마당손님이나 마당지기로 바꿔서 확인해 보세요." />
    );
  }
  if (loading) return <LoadingBlock lines={4} />;
  if (error) return <ErrorBox error={error} />;
  if (!data?.length) {
    return (
      <EmptyState emoji="💬" title="아직 대화가 없어요" description="마당을 신청하면 마당지기와 대화할 수 있어요.">
        <LinkButton href="/search">마당 찾기</LinkButton>
      </EmptyState>
    );
  }

  return (
    <ul className="divide-y divide-soil-100 overflow-hidden rounded-2xl border border-soil-200/70 bg-white">
      {data.map((t) => {
        const other = t.booking.guestId === user?.id ? t.host : t.guest;
        const otherLabel = t.booking.guestId === user?.id ? "마당지기" : "마당손님";
        const last = t.lastMessage;
        return (
          <li key={t.booking.id}>
            <Link href={`/messages/${t.booking.id}`} className="flex gap-3 p-3 hover:bg-soil-50">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-soil-100">
                <SpaceImage src={t.space?.photos[0]} alt="" sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-bold">{t.space?.title ?? "삭제된 마당"}</p>
                  <BookingStatusBadge status={t.booking.status} />
                </div>
                <p className="text-xs text-soil-500">
                  {otherLabel} {other?.name} · {formatRange(t.booking.startDate, t.booking.endDate)}
                </p>
                <p className="mt-0.5 truncate text-sm text-soil-700">
                  {last ? (last.senderId === "system" ? `📢 ${last.text}` : last.text) : "대화를 시작해 보세요"}
                </p>
              </div>
              {last && <span className="shrink-0 text-[11px] text-soil-400">{formatDateTime(last.createdAt)}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
