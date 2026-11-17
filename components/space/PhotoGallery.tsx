"use client";

/** 데스크톱 사진 격자: 큰 사진 1장 + 작은 사진 최대 4장 (Hipcamp 상세 페이지 구성 참고) */
import { SpaceImage } from "./SpaceImage";
import { cn } from "@/lib/utils/cn";

export function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const list = (photos.length ? photos : [""]).slice(0, 5);
  const n = list.length;

  if (n === 1) {
    return (
      <div className="relative aspect-[21/9] overflow-hidden rounded-3xl bg-soil-100">
        <SpaceImage src={list[0] || undefined} alt={`${title} 사진`} sizes="1100px" priority />
      </div>
    );
  }

  // 사진 수에 맞춰 칸 나누기
  const cell = (i: number) => {
    if (i === 0) return "col-span-2 row-span-2";
    if (n === 2) return "col-span-2 row-span-2";
    if (n === 3) return "col-span-2";
    if (n === 4) return i === 1 ? "col-span-2" : "";
    return "";
  };

  return (
    <div className="grid h-[440px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl">
      {list.map((src, i) => (
        <div key={i} className={cn("relative overflow-hidden bg-soil-100", cell(i))}>
          <SpaceImage
            src={src || undefined}
            alt={`${title} 사진 ${i + 1}`}
            sizes={i === 0 ? "560px" : "280px"}
            priority={i === 0}
            className="transition duration-500 hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  );
}
