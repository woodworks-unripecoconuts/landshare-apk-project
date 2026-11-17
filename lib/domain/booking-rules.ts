/**
 * 마당 신청 규칙 — 상태가 어떻게 바뀔 수 있는지, 날짜를 고를 수 있는지.
 * (React/Next 의존 없음 → 앱에서도 재사용)
 *
 *   신청됨 ──(마당지기 승인)──▶ 승인 ──(마당지기 '이용 완료')──▶ 이용 완료
 *     │  └─(마당지기 거절)──▶ 거절
 *     └──────(마당손님 취소)──▶ 취소   ◀──(마당손님 취소)── 승인
 */
import type { Booking, BookingStatus, DateString, Role, Space } from "./types";
import { addDays, dateRange, diffDays } from "./dates";

export interface StatusAction {
  to: BookingStatus;
  label: string;
  tone: "primary" | "danger" | "secondary";
}

/** 지금 이 사람이 이 신청에 할 수 있는 일 */
export function availableActions(booking: Booking, userId: string | null, role: Role | null): StatusAction[] {
  if (!userId) return [];
  const isHost = booking.hostId === userId;
  const isGuest = booking.guestId === userId;
  const actions: StatusAction[] = [];
  if (booking.status === "requested" && (isHost || role === "admin")) {
    actions.push({ to: "approved", label: "승인하기", tone: "primary" });
    actions.push({ to: "rejected", label: "거절하기", tone: "danger" });
  }
  if (booking.status === "approved" && (isHost || role === "admin")) {
    actions.push({ to: "completed", label: "이용 완료 처리", tone: "primary" });
  }
  if ((booking.status === "requested" || booking.status === "approved") && isGuest) {
    actions.push({ to: "cancelled", label: "신청 취소", tone: "secondary" });
  }
  return actions;
}

export function canChangeStatus(booking: Booking, to: BookingStatus, userId: string | null, role: Role | null): boolean {
  return availableActions(booking, userId, role).some((a) => a.to === to);
}

/** 상태가 바뀔 때 대화방에 남기는 자동 메시지 */
export function systemMessageFor(to: BookingStatus, memo?: string): string {
  const extra = memo ? ` (${memo})` : "";
  switch (to) {
    case "approved":
      return "마당지기가 신청을 승인했어요. 이제 정확한 주소를 볼 수 있어요.";
    case "rejected":
      return `마당지기가 신청을 거절했어요.${extra}`;
    case "cancelled":
      return `마당손님이 신청을 취소했어요.${extra}`;
    case "completed":
      return "이용 완료로 바뀌었어요. 마당 일기를 남겨 보세요.";
    default:
      return "새 마당 신청이 들어왔어요.";
  }
}

/**
 * 신청이 차지하는 날짜.
 * 당일 나들이(start = end)는 그 날 하루, 1박 이상은 체크인 날부터 체크아웃 전날까지의 '밤'.
 */
export function occupiedDates(b: Pick<Booking, "startDate" | "endDate">): DateString[] {
  if (b.startDate === b.endDate) return [b.startDate];
  return dateRange(b.startDate, addDays(b.endDate, -1));
}

/** 유형별 최대 박 수 */
export const MAX_NIGHTS = 3;

/** 날짜 선택이 올바른지 검사하고, 문제가 있으면 이유(한국어)를 돌려줍니다. */
export function validateDates(
  space: Pick<Space, "type" | "availableDates">,
  start: DateString | null,
  end: DateString | null,
  takenDates: DateString[],
): string | null {
  if (!start) return "이용 날짜를 골라 주세요.";
  const finalEnd = end ?? start;
  const nights = diffDays(start, finalEnd);
  if (space.type === "picnic" && nights !== 0) return "마당나들이는 당일 이용만 가능해요.";
  if (space.type !== "picnic" && nights < 1) return "체크아웃 날짜를 골라 주세요. (최소 1박)";
  if (nights > MAX_NIGHTS) return `한 번에 최대 ${MAX_NIGHTS}박까지 신청할 수 있어요.`;
  const need = occupiedDates({ startDate: start, endDate: finalEnd });
  const available = new Set(space.availableDates);
  const taken = new Set(takenDates);
  for (const d of need) {
    if (!available.has(d)) return "마당지기가 열어 둔 날짜만 신청할 수 있어요.";
    if (taken.has(d)) return "이미 다른 신청이 승인된 날짜가 있어요.";
  }
  return null;
}
