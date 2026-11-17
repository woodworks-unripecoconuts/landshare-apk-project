/**
 * 날짜 도우미 — 라이브러리 없이 'YYYY-MM-DD' 문자열로 다룹니다.
 * 모든 계산은 사용자의 브라우저 시간대(한국이면 KST) 기준입니다.
 */
import type { DateString } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

/** Date → 'YYYY-MM-DD' */
export function toDateString(d: Date): DateString {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 'YYYY-MM-DD' → Date (그 날 0시) */
export function fromDateString(s: DateString): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function today(): DateString {
  return toDateString(new Date());
}

/** 오늘로부터 n일 뒤(음수면 이전) */
export function relDate(n: number): DateString {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return toDateString(d);
}

/** 오늘로부터 n일 뒤 특정 시각의 ISO 문자열 */
export function relDateTime(n: number, hour = 10, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function addDays(s: DateString, n: number): DateString {
  const d = fromDateString(s);
  d.setDate(d.getDate() + n);
  return toDateString(d);
}

/** start~end(포함) 사이 모든 날짜 */
export function dateRange(start: DateString, end: DateString): DateString[] {
  const out: DateString[] = [];
  let cur = start;
  let guard = 0;
  while (cur <= end && guard < 400) {
    out.push(cur);
    cur = addDays(cur, 1);
    guard++;
  }
  return out;
}

/** 두 날짜 사이 일수 (같은 날이면 0) */
export function diffDays(a: DateString, b: DateString): number {
  return Math.round((fromDateString(b).getTime() - fromDateString(a).getTime()) / 86400000);
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** '11월 28일 (토)' */
export function formatDate(s: DateString): string {
  const d = fromDateString(s);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

/** '11.28 (토) ~ 11.29 (일) · 1박' 같은 기간 표시 */
export function formatRange(start: DateString, end: DateString): string {
  const f = (s: DateString) => {
    const d = fromDateString(s);
    return `${d.getMonth() + 1}.${d.getDate()} (${WEEKDAYS[d.getDay()]})`;
  };
  const nights = diffDays(start, end);
  if (nights <= 0) return `${f(start)} · 당일`;
  return `${f(start)} ~ ${f(end)} · ${nights}박`;
}

/** ISO → '11월 17일 오후 3:05' */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${ampm} ${h12}:${pad(d.getMinutes())}`;
}

/** 앞으로 days일 동안 조건에 맞는 날짜 목록 (가짜 데이터의 '신청 가능 날짜' 만들 때 사용) */
export function upcomingDates(
  days: number,
  pick: (weekday: number, index: number) => boolean,
  startOffset = 0,
): DateString[] {
  const out: DateString[] = [];
  for (let i = startOffset; i < startOffset + days; i++) {
    const s = relDate(i);
    if (pick(fromDateString(s).getDay(), i)) out.push(s);
  }
  return out;
}
