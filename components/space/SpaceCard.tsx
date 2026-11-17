"use client";

/**
 * 마당 카드 — 사진이 주인공인 모던 카드 (Hipcamp·Campspace 스타일 참고)
 * 사진 위: 인증/미인증 표시, 산림 인접 시 '불 사용 금지'
 * 사진 아래: 제목 · 별점 / 유형 · 지역 / 무료 · 최대 인원
 */
import Link from "next/link";
import { BadgeCheck, Ban, Star } from "lucide-react";
import type { SpaceListItem } from "@/lib/repository";
import { getRegion } from "@/data/regions";
import { spaceTypeLabel } from "@/data/space-types";
import { isFireAllowed } from "@/lib/domain/space-rules";
import { SpaceImage } from "./SpaceImage";
import { cn } from "@/lib/utils/cn";

function PhotoPills({ item }: { item: SpaceListItem }) {
  const { space, hostVerified } = item;
  return (
    <>
      <span
        className={cn(
          "absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm backdrop-blur",
          hostVerified ? "bg-white/95 text-grass-800" : "bg-white/85 text-soil-600",
        )}
      >
        {hostVerified ? <BadgeCheck className="size-3.5 text-grass-600" /> : null}
        {hostVerified ? "인증 마당지기" : "미인증"}
      </span>
      {space.nearForest && !isFireAllowed(space) && (
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          <Ban className="size-3" /> 불 사용 금지
        </span>
      )}
      {space.status === "hidden" && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
          숨김 처리됨
        </span>
      )}
    </>
  );
}

export function SpaceCard({
  item,
  highlighted,
  onHover,
  compact,
  className,
}: {
  item: SpaceListItem;
  highlighted?: boolean;
  onHover?: (id: string | null) => void;
  compact?: boolean;
  className?: string;
}) {
  const { space } = item;
  const region = getRegion(space.regionCode);

  if (compact) {
    return (
      <Link
        href={`/spaces/${space.id}`}
        className={cn("flex gap-3 rounded-2xl bg-white p-2.5 shadow-lift", className)}
      >
        <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-soil-100">
          <SpaceImage src={space.photos[0]} alt={space.title} sizes="112px" />
        </div>
        <div className="min-w-0 py-1">
          <p className="text-xs text-soil-500">
            {spaceTypeLabel(space.type)} · {region.shortName}
          </p>
          <p className="line-clamp-2 font-semibold">{space.title}</p>
          <p className="mt-1 text-sm">
            <b>무료</b> <span className="text-soil-500">· 최대 {space.maxGuests}명</span>
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/spaces/${space.id}`}
      onMouseEnter={() => onHover?.(space.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn("group block", className)}
    >
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-2xl bg-soil-100 transition",
          highlighted && "ring-2 ring-grass-600 ring-offset-2",
        )}
      >
        <SpaceImage
          src={space.photos[0]}
          alt={space.title}
          sizes="(max-width: 640px) 90vw, 360px"
          className="transition duration-500 ease-out group-hover:scale-[1.04]"
        />
        <PhotoPills item={item} />
      </div>
      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold text-ink">{space.title}</h3>
          {item.ratingAvg != null && (
            <span className="flex shrink-0 items-center gap-1 text-sm text-ink">
              <Star className="size-3.5 fill-ink text-ink" />
              {item.ratingAvg.toFixed(1)}
              <span className="text-soil-400">({item.ratingCount})</span>
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm text-soil-500">
          {spaceTypeLabel(space.type)} · {region.name} {space.neighborhood}
        </p>
        <p className="mt-1 text-sm">
          <b className="text-ink">무료</b> <span className="text-soil-500">· 최대 {space.maxGuests}명</span>
        </p>
      </div>
    </Link>
  );
}
