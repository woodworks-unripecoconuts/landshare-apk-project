import { Ban } from "lucide-react";
import type { Space } from "@/lib/domain/types";
import { AMENITIES } from "@/data/amenities";
import { AMENITY_ICONS } from "./amenity-icons";
import { cn } from "@/lib/utils/cn";

/** 편의시설 7가지를 있음/없음으로 보여 줍니다. 산림 인접이면 불은 '금지'로 표시 */
export function AmenityList({ space }: { space: Pick<Space, "amenities" | "nearForest"> }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {AMENITIES.map((a) => {
        const Icon = AMENITY_ICONS[a.key];
        const has = space.amenities.includes(a.key);
        const fireBanned = a.key === "fire" && (space.nearForest || !has);
        return (
          <li
            key={a.key}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm",
              fireBanned
                ? "border-red-200 bg-red-50 text-red-700"
                : has
                  ? "border-grass-200 bg-grass-50 text-grass-900"
                  : "border-soil-100 bg-white text-soil-300 line-through",
            )}
          >
            {fireBanned ? <Ban className="size-4" /> : <Icon className="size-4" />}
            {fireBanned ? (space.nearForest ? "불 사용 금지 (산림 인접)" : "불 사용 금지") : a.label}
          </li>
        );
      })}
    </ul>
  );
}
