"use client";

import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { SpaceCard } from "@/components/space/SpaceCard";
import { ErrorBox } from "@/components/ui/EmptyState";

/** 추천 마당: 인증 마당지기 + 별점 높은 순으로 6곳 */
export function FeaturedSpaces() {
  const { data, loading, error } = useRepoQuery(() => repo.spaces.search(), [], ["spaces", "diaries", "users"]);
  const items = (data ?? [])
    .slice()
    .sort(
      (a, b) =>
        Number(b.hostVerified) - Number(a.hostVerified) ||
        (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0) ||
        b.ratingCount - a.ratingCount,
    )
    .slice(0, 6);

  if (error) return <ErrorBox error={error} />;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/4] animate-pulse rounded-2xl bg-soil-100" />)
        : items.map((item) => <SpaceCard key={item.space.id} item={item} />)}
    </div>
  );
}
