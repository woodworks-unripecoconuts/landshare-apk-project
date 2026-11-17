"use client";

import { cn } from "@/lib/utils/cn";

export function Tabs<K extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: K; label: string; count?: number }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div role="tablist" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-soil-200">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "-mb-px shrink-0 border-b-2 px-3 py-2.5 text-[15px] font-semibold whitespace-nowrap",
            value === t.key ? "border-grass-600 text-grass-800" : "border-transparent text-soil-500 hover:text-soil-800",
          )}
        >
          {t.label}
          {t.count != null && <span className="ml-1 text-xs text-soil-400">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** 상태 등으로 거르는 작은 칩 줄 */
export function FilterChips<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto py-1">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            "h-8 shrink-0 rounded-full border px-3 text-sm font-semibold",
            value === o.key ? "border-grass-600 bg-grass-600 text-white" : "border-soil-200 bg-white text-soil-700",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
