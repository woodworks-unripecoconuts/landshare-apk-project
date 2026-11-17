"use client";

import { useState } from "react";
import type { BookingStatus } from "@/lib/domain/types";
import { BOOKING_STATUS_LABEL } from "@/lib/domain/labels";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { BookingCard } from "@/components/booking/BookingCard";
import { FilterChips } from "@/components/ui/Tabs";
import { EmptyState, ErrorBox, LoadingBlock } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";

type Filter = "all" | BookingStatus;
const OPTIONS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  ...(Object.keys(BOOKING_STATUS_LABEL) as BookingStatus[]).map((k) => ({ key: k, label: BOOKING_STATUS_LABEL[k] })),
];

/** 내 신청 내역(마당손님) / 받은 신청 관리(마당지기) */
export function BookingList({ perspective }: { perspective: "guest" | "host" }) {
  const [filter, setFilter] = useState<Filter>(perspective === "host" ? "requested" : "all");
  const q = useRepoQuery(
    () => (perspective === "guest" ? repo.bookings.listMine() : repo.bookings.listReceived()),
    [perspective],
    ["bookings", "diaries"],
  );
  const list = (q.data ?? []).filter((d) => filter === "all" || d.booking.status === filter);
  const counts = (q.data ?? []).reduce<Record<string, number>>((acc, d) => {
    acc[d.booking.status] = (acc[d.booking.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <FilterChips
        options={OPTIONS.map((o) => ({ ...o, label: o.key === "all" ? o.label : `${o.label} ${counts[o.key] ?? 0}` }))}
        value={filter}
        onChange={setFilter}
      />
      {q.loading ? (
        <LoadingBlock />
      ) : q.error ? (
        <ErrorBox error={q.error} />
      ) : list.length === 0 ? (
        <EmptyState
          emoji={perspective === "guest" ? "🎒" : "📭"}
          title={perspective === "guest" ? "해당하는 신청이 없어요" : "해당하는 받은 신청이 없어요"}
        >
          {perspective === "guest" && <LinkButton href="/search">마당 찾으러 가기</LinkButton>}
        </EmptyState>
      ) : (
        list.map((d) => <BookingCard key={d.booking.id} detail={d} perspective={perspective} />)
      )}
    </div>
  );
}
