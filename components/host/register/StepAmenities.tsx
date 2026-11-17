"use client";

import { Ban, Check } from "lucide-react";
import { AMENITIES } from "@/data/amenities";
import type { AmenityKey } from "@/lib/domain/types";
import { AMENITY_ICONS } from "@/components/space/amenity-icons";
import { effectiveNearForest, type RegisterDraft } from "./draft";
import { cn } from "@/lib/utils/cn";

type Props = { draft: RegisterDraft; set: (patch: Partial<RegisterDraft>) => void };

/** ④ 편의시설: 산림 100m 이내면 '불 사용 가능'은 고를 수 없음 */
export function StepAmenities({ draft, set }: Props) {
  const nearForest = effectiveNearForest(draft);
  const toggle = (k: AmenityKey) =>
    set({ amenities: draft.amenities.includes(k) ? draft.amenities.filter((a) => a !== k) : [...draft.amenities, k] });

  return (
    <div className="space-y-3">
      <p className="text-sm text-soil-700">마당손님이 쓸 수 있는 것을 모두 골라 주세요.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {AMENITIES.map((a) => {
          const Icon = AMENITY_ICONS[a.key];
          const locked = a.key === "fire" && nearForest;
          const on = !locked && draft.amenities.includes(a.key);
          return (
            <button
              key={a.key}
              type="button"
              role="checkbox"
              aria-checked={on}
              disabled={locked}
              onClick={() => toggle(a.key)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-3 text-left",
                locked
                  ? "cursor-not-allowed border-red-200 bg-red-50"
                  : on
                    ? "border-grass-600 bg-grass-50 ring-2 ring-grass-200"
                    : "border-soil-200 bg-white",
              )}
            >
              {locked ? <Ban className="size-6 text-red-600" /> : <Icon className="size-6 text-grass-700" />}
              <span className="flex-1">
                <span className={cn("block font-bold", locked && "text-red-700")}>{a.label}</span>
                <span className={cn("block text-sm", locked ? "text-red-600" : "text-soil-600")}>
                  {locked ? "산림 100m 이내라 선택할 수 없어요 (산림재난방지법)" : a.description}
                </span>
              </span>
              {on && <Check className="size-5 text-grass-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
