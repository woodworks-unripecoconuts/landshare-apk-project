"use client";

/**
 * 달력 하나로 세 가지 용도를 처리합니다.
 *  - mode="view"     : 신청 가능한 날짜 보기 (상세 페이지)
 *  - mode="multiple" : 날짜 여러 개 켜고 끄기 (마당 등록 5단계)
 *  - mode="range"    : 시작~끝 날짜 고르기 (마당 신청). singleDay면 하루만.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DateString } from "@/lib/domain/types";
import { fromDateString, relDate, toDateString, today } from "@/lib/domain/dates";
import { cn } from "@/lib/utils/cn";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

type Props =
  | { mode: "view"; available: DateString[]; taken?: DateString[] }
  | {
      mode: "multiple";
      selected: DateString[];
      onToggle: (d: DateString) => void;
      /** 오늘부터 며칠 뒤까지 고를 수 있는지 */
      maxDaysAhead?: number;
    }
  | {
      mode: "range";
      /** 고를 수 있는 날짜. 없으면 내일부터 모든 날짜를 고를 수 있어요 (찾기·등록용) */
      available?: DateString[];
      taken?: DateString[];
      start: DateString | null;
      end: DateString | null;
      singleDay?: boolean;
      onChange: (start: DateString | null, end: DateString | null) => void;
    };

export function Calendar(props: Props) {
  const todayStr = today();
  const initial = (() => {
    const first =
      props.mode === "range" ? (props.start ?? props.available?.[0]) : props.mode === "view" ? props.available[0] : null;
    const d = first ? fromDateString(first) : new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  })();
  const [{ y, m }, setYM] = useState(initial);

  const firstDay = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (DateString | null)[] = [
    ...Array.from({ length: firstDay.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => toDateString(new Date(y, m, i + 1))),
  ];

  const move = (delta: number) => {
    const d = new Date(y, m + delta, 1);
    setYM({ y: d.getFullYear(), m: d.getMonth() });
  };

  const availableSet = new Set(props.mode === "multiple" ? props.selected : (props.available ?? []));
  const anyDate = props.mode === "range" && !props.available;
  const takenSet = new Set(props.mode !== "multiple" ? (props.taken ?? []) : []);
  const maxDate =
    props.mode === "multiple" && props.maxDaysAhead
      ? relDate(props.maxDaysAhead)
      : null;

  function cellState(d: DateString) {
    const past = d <= todayStr;
    if (props.mode === "view") {
      return { enabled: false, on: availableSet.has(d) && !takenSet.has(d) && !past, taken: takenSet.has(d), inRange: false };
    }
    if (props.mode === "multiple") {
      const tooFar = maxDate ? d > maxDate : false;
      return { enabled: !past && !tooFar, on: availableSet.has(d), taken: false, inRange: false };
    }
    const { start, end } = props;
    const selectable = !past && (anyDate || availableSet.has(d)) && !takenSet.has(d);
    const canBeEnd = !props.singleDay && !!start && !end && d > start && !past;
    const on = d === start || d === end;
    const inRange = !!start && !!end && d > start && d < end;
    return { enabled: selectable || canBeEnd, on, taken: takenSet.has(d), inRange, open: selectable && !anyDate };
  }

  function onClick(d: DateString) {
    if (props.mode === "multiple") return props.onToggle(d);
    if (props.mode !== "range") return;
    const { start, end, singleDay, onChange } = props;
    if (singleDay) return onChange(d, d);
    if (!start || end || d <= start) return onChange(d, null);
    onChange(start, d);
  }

  return (
    <div className="rounded-2xl border border-soil-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => move(-1)} aria-label="이전 달" className="rounded-lg p-2 hover:bg-soil-100">
          <ChevronLeft className="size-5" />
        </button>
        <p className="font-bold">
          {y}년 {m + 1}월
        </p>
        <button type="button" onClick={() => move(1)} aria-label="다음 달" className="rounded-lg p-2 hover:bg-soil-100">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-soil-500">
        {WEEK.map((w, i) => (
          <div key={w} className={cn("py-1", i === 0 && "text-red-500", i === 6 && "text-sky-600")}>
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const s = cellState(d);
          const day = Number(d.slice(8));
          const isView = props.mode === "view";
          const isOpenDay = props.mode === "range" ? "open" in s && s.open : false;
          const content = (
            <span
              className={cn(
                "flex aspect-square w-full items-center justify-center rounded-lg text-sm",
                s.on && !isView && "bg-grass-600 font-bold text-white",
                s.on && isView && "bg-grass-100 font-semibold text-grass-800",
                !s.on && s.inRange && "bg-grass-100 text-grass-900",
                !s.on && !s.inRange && isOpenDay && "bg-grass-50 font-semibold text-grass-800",
                s.taken && "text-soil-300 line-through",
                !s.on && !s.inRange && !isOpenDay && !s.enabled && !isView && "text-soil-300",
                isView && !s.on && "text-soil-300",
              )}
            >
              {day}
            </span>
          );
          return isView ? (
            <div key={d} aria-label={`${d}${s.on ? " 신청 가능" : ""}`}>
              {content}
            </div>
          ) : (
            <button
              key={d}
              type="button"
              disabled={!s.enabled}
              onClick={() => onClick(d)}
              aria-pressed={s.on}
              aria-label={d}
              className="disabled:cursor-not-allowed"
            >
              {content}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-soil-600">
        {props.mode === "multiple" ? (
          <span className="flex items-center gap-1">
            <i className="inline-block size-3 rounded bg-grass-600" /> 신청 가능으로 연 날짜
          </span>
        ) : anyDate ? (
          <span>시작 날짜를 누른 뒤 끝 날짜를 눌러 주세요</span>
        ) : (
          <>
            <span className="flex items-center gap-1">
              <i className={cn("inline-block size-3 rounded", props.mode === "view" ? "bg-grass-100" : "bg-grass-50 ring-1 ring-grass-200")} />
              신청 가능
            </span>
            {props.mode === "range" && (
              <span className="flex items-center gap-1">
                <i className="inline-block size-3 rounded bg-grass-600" /> 선택
              </span>
            )}
            <span className="flex items-center gap-1 text-soil-400 line-through">12</span>
            <span>이미 승인됨</span>
          </>
        )}
      </div>
    </div>
  );
}
