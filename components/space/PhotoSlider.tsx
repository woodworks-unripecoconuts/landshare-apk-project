"use client";

/** 사진 슬라이드: 손가락으로 넘기기(모바일) + 화살표(데스크톱) */
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SpaceImage } from "./SpaceImage";
import { cn } from "@/lib/utils/cn";

export function PhotoSlider({ photos, title }: { photos: string[]; title: string }) {
  const list = photos.length ? photos : [""];
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const next = Math.max(0, Math.min(list.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden bg-soil-100 md:rounded-3xl">
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {list.map((src, i) => (
          <div key={i} className="relative aspect-[4/3] w-full shrink-0 snap-center md:aspect-[16/9]">
            <SpaceImage src={src || undefined} alt={`${title} 사진 ${i + 1}`} sizes="(max-width: 768px) 100vw, 900px" priority={i === 0} />
          </div>
        ))}
      </div>
      {list.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="이전 사진"
            className="absolute top-1/2 left-3 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow md:block"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="다음 사진"
            className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow md:block"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}번째 사진`}
                className={cn("h-2 rounded-full transition-all", i === index ? "w-5 bg-white" : "w-2 bg-white/60")}
              />
            ))}
          </div>
          <span className="absolute top-3 right-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
            {index + 1} / {list.length}
          </span>
        </>
      )}
    </div>
  );
}
