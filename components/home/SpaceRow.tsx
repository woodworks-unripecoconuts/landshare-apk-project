"use client";

/** 가로로 넘기는 마당 줄 (손가락으로 밀기 / 데스크톱은 화살표) */
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { SpaceListItem } from "@/lib/repository";
import { SpaceCard } from "@/components/space/SpaceCard";

export function SpaceRow({
  title,
  subtitle,
  items,
  loading,
  moreHref,
}: {
  title: string;
  subtitle?: string;
  items: SpaceListItem[];
  loading?: boolean;
  moreHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  if (!loading && items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-soil-500">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {moreHref && (
            <Link href={moreHref} className="flex items-center gap-1 text-sm font-semibold text-ink underline-offset-4 hover:underline">
              전체 보기 <ArrowRight className="size-4" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="이전"
            className="hidden size-9 items-center justify-center rounded-full border border-soil-200 hover:shadow-soft md:flex"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="다음"
            className="hidden size-9 items-center justify-center rounded-full border border-soil-200 hover:shadow-soft md:flex"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[78%] shrink-0 sm:w-[46%] lg:w-[calc(25%-15px)]">
                <div className="aspect-[4/3] animate-pulse rounded-2xl bg-soil-100" />
                <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-soil-100" />
              </div>
            ))
          : items.map((item) => (
              <div key={item.space.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(25%-15px)]">
                <SpaceCard item={item} />
              </div>
            ))}
      </div>
    </section>
  );
}
