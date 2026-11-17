"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** 별점 표시(읽기 전용) 또는 선택(onChange가 있으면) */
export function StarRating({
  value,
  onChange,
  size = 16,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" role={onChange ? "radiogroup" : undefined} aria-label={`별점 ${value}점`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={cn(filled ? "fill-sun-500 text-sun-500" : "fill-transparent text-soil-300")}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n}점`}
            onClick={() => onChange(n)}
            className="p-1"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
