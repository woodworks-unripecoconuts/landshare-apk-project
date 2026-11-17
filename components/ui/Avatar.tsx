"use client";

/** 프로필 동그라미: 사진이 있으면 사진, 없으면 이름 첫 글자 */
import { SpaceImage } from "@/components/space/SpaceImage";
import { cn } from "@/lib/utils/cn";

const COLORS = ["bg-grass-600", "bg-sun-500", "bg-soil-600", "bg-grass-400", "bg-soil-800", "bg-sun-600"];

export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name?: string | null;
  src?: string;
  size?: number;
  className?: string;
}) {
  const label = (name ?? "?").trim();
  let h = 0;
  for (const ch of label) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <SpaceImage src={src} alt={`${label} 프로필`} sizes={`${size}px`} />
      ) : (
        <span
          aria-hidden="true"
          className={cn("flex size-full items-center justify-center font-bold text-white", COLORS[h % COLORS.length])}
          style={{ fontSize: Math.round(size * 0.42) }}
        >
          {label.slice(0, 1)}
        </span>
      )}
    </span>
  );
}
