"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { RULE_SUGGESTIONS } from "@/lib/domain/space-rules";
import { dateRange, fromDateString, upcomingDates } from "@/lib/domain/dates";
import { rangeLabel } from "@/components/ui/DateRangePicker";
import { cn } from "@/lib/utils/cn";
import { Calendar } from "@/components/ui/Calendar";
import { Button } from "@/components/ui/Button";
import { effectiveNearForest, type RegisterDraft } from "./draft";
import { Field, inputClass } from "./fields";

type Props = { draft: RegisterDraft; set: (patch: Partial<RegisterDraft>) => void };

/** ⑤ 이용 규칙, 체크인/아웃 시간, 신청 가능 날짜 */
export function StepRules({ draft, set }: Props) {
  const [custom, setCustom] = useState("");
  const [dateMode, setDateMode] = useState<"range" | "single">("range");
  const [range, setRange] = useState<{ s: string | null; e: string | null }>({ s: null, e: null });
  const nearForest = effectiveNearForest(draft);
  const suggestions = RULE_SUGGESTIONS.filter(
    (r) => !draft.rules.includes(r) && !(nearForest && r.startsWith("불은")),
  );
  const addRule = (r: string) => r.trim() && set({ rules: [...draft.rules, r.trim()] });

  const addDates = (dates: string[]) => set({ availableDates: Array.from(new Set([...draft.availableDates, ...dates])).sort() });
  const toggleDate = (d: string) =>
    set({
      availableDates: draft.availableDates.includes(d)
        ? draft.availableDates.filter((x) => x !== d)
        : [...draft.availableDates, d].sort(),
    });

  return (
    <div className="space-y-6">
      <Field label="이용 규칙" hint="마당손님이 꼭 지켜야 할 것을 적어 주세요.">
        <ul className="space-y-2">
          {draft.rules.map((r, i) => (
            <li key={i} className="flex items-center gap-2 rounded-xl border border-soil-200 bg-white px-3 py-2 text-sm">
              <span className="flex-1">{r}</span>
              <button
                type="button"
                aria-label="규칙 삭제"
                onClick={() => set({ rules: draft.rules.filter((_, j) => j !== i) })}
                className="rounded-full p-1 text-soil-500 hover:bg-soil-100"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
          {nearForest && !draft.rules.some((r) => r.includes("불 사용 금지")) && (
            <li>
              <button
                type="button"
                onClick={() => addRule("불 사용 금지 — 버너·숯·화로대 모두 안 돼요")}
                className="text-sm font-semibold text-red-700 underline"
              >
                + &lsquo;불 사용 금지&rsquo; 규칙 추가하기 (산림 인접 마당에 권장)
              </button>
            </li>
          )}
        </ul>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => addRule(r)}
              className="rounded-full border border-dashed border-soil-300 px-3 py-1.5 text-xs text-soil-700 hover:bg-soil-50"
            >
              + {r}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={inputClass}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="직접 쓰기"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addRule(custom);
                setCustom("");
              }
            }}
          />
          <Button
            variant="outline"
            className="h-12 shrink-0"
            onClick={() => {
              addRule(custom);
              setCustom("");
            }}
          >
            <Plus className="size-4" /> 추가
          </Button>
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={draft.type === "picnic" ? "이용 시작" : "체크인"}>
          <input type="time" className={inputClass} value={draft.checkInTime} onChange={(e) => set({ checkInTime: e.target.value })} />
        </Field>
        <Field label={draft.type === "picnic" ? "이용 끝" : "체크아웃"}>
          <input type="time" className={inputClass} value={draft.checkOutTime} onChange={(e) => set({ checkOutTime: e.target.value })} />
        </Field>
      </div>

      <Field
        label={`신청 가능 날짜 (${draft.availableDates.length}일)`}
        hint={draft.type === "picnic" ? "나들이 가능한 날을 눌러 주세요." : "마당손님이 묵을 수 있는 밤(체크인 날짜)을 눌러 주세요."}
      >
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => addDates(upcomingDates(56, (wd) => wd === 5 || wd === 6, 1))}
          >
            앞으로 8주 금·토 모두
          </Button>
          <Button size="sm" variant="outline" onClick={() => addDates(upcomingDates(14, () => true, 1))}>
            앞으로 2주 매일
          </Button>
          <Button size="sm" variant="ghost" onClick={() => set({ availableDates: [] })}>
            모두 지우기
          </Button>
        </div>
        <div role="tablist" className="flex w-fit rounded-full border border-soil-200 bg-white p-0.5">
          {(
            [
              ["range", "기간으로 선택"],
              ["single", "하루씩 선택"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={dateMode === key}
              onClick={() => setDateMode(key)}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-semibold",
                dateMode === key ? "bg-ink text-white" : "text-soil-600",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {dateMode === "range" ? (
          <div className="max-w-sm space-y-2">
            <Calendar mode="range" start={range.s} end={range.e} onChange={(s, e) => setRange({ s, e })} />
            <p className="text-sm font-semibold text-grass-800">
              {range.s ? `고른 기간: ${rangeLabel(range.s, range.e)}` : "시작 날짜와 끝 날짜를 차례로 눌러 주세요."}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={!range.s}
                onClick={() => {
                  if (!range.s) return;
                  addDates(dateRange(range.s, range.e ?? range.s));
                  setRange({ s: null, e: null });
                }}
              >
                이 기간 모두 열기
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!range.s}
                onClick={() => {
                  if (!range.s) return;
                  const remove = new Set(dateRange(range.s, range.e ?? range.s));
                  set({ availableDates: draft.availableDates.filter((d) => !remove.has(d)) });
                  setRange({ s: null, e: null });
                }}
              >
                이 기간 닫기
              </Button>
            </div>
            <p className="text-xs text-soil-500">기간의 시작일과 끝 날짜를 모두 포함해요. 연 날짜는 &lsquo;하루씩 선택&rsquo;에서 확인·수정할 수 있어요.</p>
          </div>
        ) : (
          <div className="max-w-sm">
            <Calendar mode="multiple" selected={draft.availableDates} onToggle={toggleDate} maxDaysAhead={180} />
          </div>
        )}
        {draft.availableDates.length > 0 && (
          <p className="text-xs text-soil-500">
            가장 빠른 날: {fromDateString(draft.availableDates[0]).toLocaleDateString("ko-KR")}
          </p>
        )}
      </Field>
    </div>
  );
}
