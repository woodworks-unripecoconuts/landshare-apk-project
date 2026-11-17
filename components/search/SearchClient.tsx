"use client";

import { Fragment, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { List, Map as MapIcon } from "lucide-react";
import { repo, type SpaceFilter } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { filterFromParams, filterToQuery } from "@/lib/utils/search-query";
import { getRegion } from "@/data/regions";
import { formatDate } from "@/lib/domain/dates";
import { AD_CONFIG } from "@/lib/ads/config";
import { FilterPanel } from "./FilterPanel";
import { SpaceCard } from "@/components/space/SpaceCard";
import { SearchMap } from "@/components/map";
import { AdSlot } from "@/components/ads/AdSlot";
import { EmptyState, ErrorBox } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filter = filterFromParams(params);
  const [view, setView] = useState<"list" | "map">("list");
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, loading, error } = useRepoQuery(
    () => repo.spaces.search(filter),
    [filter],
    ["spaces", "bookings", "diaries", "users"],
  );
  const items = data ?? [];

  function update(f: SpaceFilter) {
    router.replace(pathname + filterToQuery(f), { scroll: false });
  }

  const region = filter.regionCode ? getRegion(filter.regionCode) : null;
  const summary = [region?.name ?? "강원 전체", filter.date ? formatDate(filter.date) : null, filter.guests ? `${filter.guests}명` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <h1 className="sr-only">마당 찾기</h1>
      <FilterPanel filter={filter} onChange={update} />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-soil-700">
          <b className="text-ink">{summary}</b> {loading ? "찾는 중…" : `${items.length}곳`}
        </p>
        {/* 모바일: 목록/지도 전환 */}
        <div className="flex rounded-full border border-soil-200 bg-white p-0.5 lg:hidden" role="tablist">
          {(
            [
              ["list", "목록", List],
              ["map", "지도", MapIcon],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={view === key}
              onClick={() => setView(key)}
              className={cn(
                "flex h-8 items-center gap-1 rounded-full px-3 text-sm font-semibold",
                view === key ? "bg-grass-600 text-white" : "text-soil-600",
              )}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      <ErrorBox error={error} />

      <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-5">
        {/* 목록 */}
        <div className={cn(view === "map" && "hidden lg:block")}>
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/4] animate-pulse rounded-2xl bg-soil-100" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState emoji="🔍" title="조건에 맞는 마당이 없어요" description="날짜나 편의시설 조건을 줄여 보세요.">
              <Button variant="outline" onClick={() => update({})}>
                조건 초기화
              </Button>
            </EmptyState>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((item, i) => (
                <Fragment key={item.space.id}>
                  <SpaceCard item={item} highlighted={activeId === item.space.id} onHover={setActiveId} />
                  {(i + 1) % AD_CONFIG.searchListEvery === 0 && i < items.length - 1 && (
                    <AdSlot slot="search-list" className="sm:col-span-2" />
                  )}
                </Fragment>
              ))}
              {items.length < AD_CONFIG.searchListEvery && <AdSlot slot="search-list" className="sm:col-span-2" />}
            </div>
          )}
        </div>

        {/* 지도 */}
        <div className={cn("lg:block", view === "list" && "hidden")}>
          <div className="h-[calc(100dvh-15rem)] min-h-[360px] lg:sticky lg:top-24 lg:h-[calc(100dvh-8rem)]">
            <SearchMap
              items={items}
              activeId={activeId}
              onSelect={setActiveId}
              fallbackCenter={region?.center}
              fallbackZoom={region?.zoom}
            />
          </div>
          <p className="mt-2 text-xs text-soil-500">
            지도의 위치는 동네 단위 대략적인 위치예요. 정확한 주소는 신청이 승인된 뒤에 공개돼요.
          </p>
          {/* 모바일 지도 보기에서 선택한 마당 카드 */}
          {view === "map" && activeId && (
            <div className="mt-3 lg:hidden">
              {items
                .filter((i) => i.space.id === activeId)
                .map((item) => (
                  <SpaceCard key={item.space.id} item={item} compact />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
