"use client";

import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { formatDateTime, formatRange } from "@/lib/domain/dates";
import { StarRating } from "@/components/ui/StarRating";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, LoadingBlock } from "@/components/ui/EmptyState";

/** 내 마당 일기 + 아직 안 쓴(이용 완료) 신청 */
export function MyDiaries() {
  const diaries = useRepoQuery(() => repo.diaries.listMine(), [], ["diaries"]);
  const bookings = useRepoQuery(() => repo.bookings.listMine(), [], ["bookings", "diaries"]);
  if (diaries.loading || bookings.loading) return <LoadingBlock />;
  const writable = (bookings.data ?? []).filter((d) => d.booking.status === "completed" && !d.hasDiary);

  return (
    <div className="space-y-4">
      {writable.length > 0 && (
        <section className="rounded-2xl bg-sun-100 p-4">
          <p className="font-bold">✍️ 마당 일기를 기다리는 곳이 있어요</p>
          <ul className="mt-2 space-y-2">
            {writable.map((d) => (
              <li key={d.booking.id} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{d.space?.title}</span>
                  <span className="text-xs text-soil-500">{formatRange(d.booking.startDate, d.booking.endDate)}</span>
                </span>
                <LinkButton href={`/diary/write/${d.booking.id}`} size="sm">
                  <NotebookPen className="size-4" /> 쓰기
                </LinkButton>
              </li>
            ))}
          </ul>
        </section>
      )}
      {!diaries.data?.length ? (
        <EmptyState emoji="📔" title="아직 쓴 마당 일기가 없어요" description="이용 완료된 마당에만 마당 일기를 쓸 수 있어요." />
      ) : (
        <ul className="space-y-3">
          {diaries.data.map(({ diary, space }) => (
            <li key={diary.id} className="rounded-2xl border border-soil-200/70 bg-white p-4">
              <Link href={space ? `/spaces/${space.id}` : "#"} className="font-bold hover:underline">
                {space?.title ?? "삭제된 마당"}
              </Link>
              <div className="mt-1 flex items-center gap-2">
                <StarRating value={diary.rating} size={14} />
                <span className="text-xs text-soil-500">{formatDateTime(diary.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm whitespace-pre-line text-soil-800">{diary.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
