"use client";

import Link from "next/link";
import { CalendarDays, MessageCircle, NotebookPen, Users } from "lucide-react";
import type { BookingDetail } from "@/lib/repository";
import { formatRange } from "@/lib/domain/dates";
import { SpaceImage } from "@/components/space/SpaceImage";
import { LinkButton } from "@/components/ui/Button";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingActions } from "./BookingActions";

/** 신청 1건 카드 — 마이페이지 '내 신청 내역' / '받은 신청 관리'에서 사용 */
export function BookingCard({ detail, perspective }: { detail: BookingDetail; perspective: "guest" | "host" }) {
  const { booking, space, guest, host, hasDiary } = detail;
  const other = perspective === "guest" ? host : guest;
  return (
    <div className="rounded-2xl border border-soil-200/70 bg-white p-3 shadow-soft">
      <div className="flex gap-3">
        <Link href={space ? `/spaces/${space.id}` : "#"} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-soil-100">
          <SpaceImage src={space?.photos[0]} alt={space?.title ?? ""} sizes="80px" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <span className="truncate text-xs text-soil-500">
              {perspective === "guest" ? "마당지기" : "마당손님"} {other?.name}
            </span>
          </div>
          <p className="mt-1 truncate font-bold">{space?.title ?? "삭제된 마당"}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-soil-700">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" /> {formatRange(booking.startDate, booking.endDate)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" /> {booking.guests}명 · 차 {booking.vehicles}대
            </span>
          </p>
        </div>
      </div>
      {booking.note && perspective === "host" && (
        <p className="mt-2 rounded-xl bg-soil-50 px-3 py-2 text-sm text-soil-700">&ldquo;{booking.note}&rdquo;</p>
      )}
      <div className="mt-3 flex flex-wrap items-start gap-2">
        <LinkButton href={`/messages/${booking.id}`} variant="outline" size="sm">
          <MessageCircle className="size-4" /> 대화
        </LinkButton>
        {perspective === "guest" && booking.status === "completed" && !hasDiary && (
          <LinkButton href={`/diary/write/${booking.id}`} size="sm">
            <NotebookPen className="size-4" /> 마당 일기 쓰기
          </LinkButton>
        )}
        {perspective === "guest" && hasDiary && <span className="self-center text-xs text-grass-700">✓ 마당 일기 작성함</span>}
        <BookingActions booking={booking} size="sm" />
      </div>
    </div>
  );
}
