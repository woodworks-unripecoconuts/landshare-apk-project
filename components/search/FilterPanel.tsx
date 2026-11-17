"use client";

import { useState } from "react";
import { BadgeCheck, SlidersHorizontal, X } from "lucide-react";
import type { SpaceFilter } from "@/lib/repository";
import type { AmenityKey, RegionCode, SpaceType } from "@/lib/domain/types";
import { REGIONS } from "@/data/regions";
import { SPACE_TYPES } from "@/data/space-types";
import { AMENITIES } from "@/data/amenities";
import { relDate } from "@/lib/domain/dates";
import { AMENITY_ICONS } from "@/components/space/amenity-icons";
import { cn } from "@/lib/utils/cn";

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap transition",
        on ? "border-ink bg-ink text-white" : "border-soil-200 bg-white text-soil-700 hover:border-soil-400",
      )}
    >
      {children}
    </button>
  );
}

function toggle<T>(list: T[] | undefined, v: T): T[] | undefined {
  const cur = list ?? [];
  const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
  return next.length ? next : undefined;
}

/** 찾기 필터: 시·군, 유형, 날짜, 인원, 편의시설 */
export function FilterPanel({ filter, onChange }: { filter: SpaceFilter; onChange: (f: SpaceFilter) => void }) {
  const [open, setOpen] = useState(false);
  const extraCount = (filter.amenities?.length ?? 0) + (filter.date ? 1 : 0) + (filter.guests ? 1 : 0);
  const anyFilter = !!(filter.regionCode || filter.types?.length || filter.verifiedOnly || extraCount);

  const label = "text-xs font-bold text-soil-600";
  const input = "h-10 w-full rounded-xl border border-soil-200 bg-white px-3 text-[15px]";

  return (
    <div className="space-y-3">
      {/* 항상 보이는 줄: 시·군 + 유형 + 인증 + 상세 필터 (모바일은 가로 스크롤) */}
      <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        <select
          aria-label="시·군"
          value={filter.regionCode ?? ""}
          onChange={(e) => onChange({ ...filter, regionCode: (e.target.value || undefined) as RegionCode | undefined })}
          className="h-9 shrink-0 rounded-full border border-soil-200 bg-white px-3.5 text-sm font-semibold"
        >
          <option value="">강원 전체</option>
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name}
            </option>
          ))}
        </select>
        {SPACE_TYPES.map((t) => (
          <Chip
            key={t.key}
            on={!!filter.types?.includes(t.key)}
            onClick={() => onChange({ ...filter, types: toggle<SpaceType>(filter.types, t.key) })}
          >
            <span aria-hidden="true">{t.emoji}</span> {t.label}
          </Chip>
        ))}
        <Chip on={!!filter.verifiedOnly} onClick={() => onChange({ ...filter, verifiedOnly: filter.verifiedOnly ? undefined : true })}>
          <BadgeCheck className="size-4" /> 인증 마당지기
        </Chip>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-soil-200 px-3.5 text-sm font-semibold text-ink hover:border-soil-400"
        >
          <SlidersHorizontal className="size-4" /> 상세 필터{extraCount ? ` ${extraCount}` : ""}
        </button>
        {anyFilter && (
          <button
            type="button"
            onClick={() => onChange({})}
            className="flex h-9 shrink-0 items-center gap-1 px-2 text-sm font-semibold text-soil-500 underline-offset-4 hover:text-ink hover:underline"
          >
            <X className="size-4" /> 초기화
          </button>
        )}
      </div>

      {open && (
        <div className="grid gap-4 rounded-3xl border border-soil-200/80 bg-white p-4 shadow-soft sm:grid-cols-2">
          <label className="space-y-1">
            <span className={label}>이용 날짜</span>
            <input
              type="date"
              className={input}
              min={relDate(1)}
              value={filter.date ?? ""}
              onChange={(e) => onChange({ ...filter, date: e.target.value || undefined })}
            />
          </label>
          <label className="space-y-1">
            <span className={label}>인원</span>
            <select
              className={input}
              value={filter.guests ?? ""}
              onChange={(e) => onChange({ ...filter, guests: Number(e.target.value) || undefined })}
            >
              <option value="">상관없음</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}명 이상
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-1 sm:col-span-2">
            <span className={label}>편의시설 (모두 갖춘 곳)</span>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => {
                const Icon = AMENITY_ICONS[a.key];
                return (
                  <Chip
                    key={a.key}
                    on={!!filter.amenities?.includes(a.key)}
                    onClick={() => onChange({ ...filter, amenities: toggle<AmenityKey>(filter.amenities, a.key) })}
                  >
                    <Icon className="size-4" /> {a.label}
                  </Chip>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
