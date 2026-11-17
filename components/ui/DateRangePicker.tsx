"use client";

/**
 * 기간(시작~끝) 고르기: 버튼을 누르면 달력 팝업이 열리고,
 * 시작 날짜 → 끝 날짜를 차례로 누르면 기간이 정해져요.
 * 사용법:
 *   <DateRangePicker start={s} end={e} onChange={(s, e) => ...}>
 *     {(label, open) => <button onClick={open}>{label}</button>}
 *   </DateRangePicker>
 */
import { useState } from "react";
import type { DateString } from "@/lib/domain/types";
import { addDays, formatDate, formatRange, nextWeekday } from "@/lib/domain/dates";
import { Calendar } from "./Calendar";
import { Modal } from "./Modal";
import { Button } from "./Button";

export function rangeLabel(start?: DateString | null, end?: DateString | null, empty = "날짜 선택"): string {
  if (!start) return empty;
  if (!end || end === start) return `${formatDate(start)} 하루`;
  return formatRange(start, end);
}

export function DateRangePicker({
  start,
  end,
  onChange,
  title = "기간 선택",
  children,
}: {
  start?: DateString | null;
  end?: DateString | null;
  onChange: (start: DateString | null, end: DateString | null) => void;
  title?: string;
  children: (label: string, open: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<{ s: DateString | null; e: DateString | null }>({ s: null, e: null });

  const openPicker = () => {
    setDraft({ s: start ?? null, e: end ?? null });
    setOpen(true);
  };
  const weekend = (offsetWeeks: number) => {
    const sat = addDays(nextWeekday(6), offsetWeeks * 7);
    setDraft({ s: sat, e: addDays(sat, 1) });
  };

  return (
    <>
      {children(rangeLabel(start, end), openPicker)}
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <div className="mb-3 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => weekend(0)}>
            이번 주말 (토~일)
          </Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => weekend(1)}>
            다음 주말 (토~일)
          </Button>
        </div>
        <Calendar mode="range" start={draft.s} end={draft.e} onChange={(s, e) => setDraft({ s, e })} />
        <p className="mt-3 text-center text-sm font-semibold text-grass-800">
          {draft.s ? rangeLabel(draft.s, draft.e) : "시작 날짜를 눌러 주세요"}
          {draft.s && !draft.e && " — 끝 날짜를 누르거나 그대로 적용하면 하루만"}
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              onChange(null, null);
              setOpen(false);
            }}
          >
            지우기
          </Button>
          <Button
            className="flex-[2]"
            disabled={!draft.s}
            onClick={() => {
              onChange(draft.s, draft.e && draft.s && draft.e > draft.s ? draft.e : null);
              setOpen(false);
            }}
          >
            적용
          </Button>
        </div>
      </Modal>
    </>
  );
}
