"use client";

import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";
import type { SpaceListItem } from "@/lib/repository";
import { getRegion } from "@/data/regions";
import { SpaceImage } from "./SpaceImage";
import { FireBadge, HostVerifyBadge, SpaceTypeBadge } from "./SpaceBadges";
import { cn } from "@/lib/utils/cn";

/** 목록에 쓰는 마당 카드 */
export function SpaceCard({
  item,
  highlighted,
  onHover,
  compact,
}: {
  item: SpaceListItem;
  highlighted?: boolean;
  onHover?: (id: string | null) => void;
  compact?: boolean;
}) {
  const { space } = item;
  const region = getRegion(space.regionCode);
  return (
    <Link
      href={`/spaces/${space.id}`}
      onMouseEnter={() => onHover?.(space.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "group block overflow-hidden rounded-2xl border bg-white shadow-soft transition",
        highlighted ? "border-grass-500 ring-2 ring-grass-200" : "border-soil-200/70 hover:border-soil-300",
        compact && "flex",
      )}
    >
      <div className={cn("relative bg-soil-100", compact ? "aspect-square w-32 shrink-0" : "aspect-[4/3]")}>
        <SpaceImage src={space.photos[0]} alt={space.title} className="transition group-hover:scale-[1.02]" />
        {!compact && (
          <div className="absolute top-2 left-2 flex gap-1">
            <SpaceTypeBadge type={space.type} />
          </div>
        )}
        {space.status === "hidden" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
            숨김 처리됨
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 p-3">
        <p className="flex items-center gap-1 text-xs text-soil-600">
          <MapPin className="size-3.5" /> {region.name} {space.neighborhood}
        </p>
        <h3 className="mt-0.5 line-clamp-1 font-bold text-ink">{space.title}</h3>
        <div className="mt-1 flex items-center gap-3 text-xs text-soil-700">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> 최대 {space.maxGuests}명
          </span>
          {item.ratingAvg != null ? (
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-sun-500 text-sun-500" /> {item.ratingAvg.toFixed(1)} ({item.ratingCount})
            </span>
          ) : (
            <span className="text-soil-400">마당 일기 없음</span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {compact && <SpaceTypeBadge type={space.type} />}
          <HostVerifyBadge verified={item.hostVerified} />
          <FireBadge space={space} forestOnly />
        </div>
      </div>
    </Link>
  );
}
