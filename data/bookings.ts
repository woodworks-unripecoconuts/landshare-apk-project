/**
 * 가짜 마당 신청 목록 — 5가지 상태(신청됨/승인/거절/취소/이용 완료)가 모두 들어 있습니다.
 * 날짜는 오늘 기준 상대 날짜입니다.
 */
import type { Booking, BookingStatus } from "@/lib/domain/types";
import { relDate, relDateTime } from "@/lib/domain/dates";
import { DEMO_GUEST_ID, DEMO_HOST_ID } from "./users";

interface BookingSeedInput {
  id: string;
  spaceId: string;
  guestId: string;
  hostId: string;
  start: number; // 오늘로부터 며칠 뒤(음수 = 지난 날)
  nights: number;
  guests: number;
  vehicles: number;
  note: string;
  status: BookingStatus;
  createdDaysAgo: number;
  memo?: string;
}

const INPUTS: BookingSeedInput[] = [
  // ── 데모 마당손님(김하늘)의 신청 ──
  { id: "bk-01", spaceId: "sp-03", guestId: DEMO_GUEST_ID, hostId: "u-host-2", start: -21, nights: 1, guests: 2, vehicles: 1, note: "처음 마당캠핑 해 봐요. 조용히 쉬다 가겠습니다!", status: "completed", createdDaysAgo: 30 },
  { id: "bk-02", spaceId: "sp-13", guestId: DEMO_GUEST_ID, hostId: DEMO_HOST_ID, start: 10, nights: 1, guests: 3, vehicles: 1, note: "메밀꽃 보러 가족 셋이 가고 싶어요. 불은 쓰지 않을게요.", status: "requested", createdDaysAgo: 1 },
  { id: "bk-03", spaceId: "sp-04", guestId: DEMO_GUEST_ID, hostId: "u-host-3", start: 5, nights: 1, guests: 2, vehicles: 1, note: "바다 보면서 차박하고 싶어요. 늦게 도착할 수도 있어요.", status: "approved", createdDaysAgo: 4 },
  { id: "bk-04", spaceId: "sp-07", guestId: DEMO_GUEST_ID, hostId: "u-host-5", start: 3, nights: 0, guests: 4, vehicles: 1, note: "친구들과 도시락 먹으러 가도 될까요?", status: "rejected", createdDaysAgo: 3, memo: "그날은 집안 행사가 있어 어려워요. 다음에 꼭 오세요!" },
  { id: "bk-05", spaceId: "sp-10", guestId: DEMO_GUEST_ID, hostId: "u-host-7", start: 8, nights: 1, guests: 2, vehicles: 1, note: "주말에 한 번 가 보고 싶어요.", status: "cancelled", createdDaysAgo: 6, memo: "일정이 바뀌어 취소했어요." },
  { id: "bk-17", spaceId: "sp-20", guestId: DEMO_GUEST_ID, hostId: DEMO_HOST_ID, start: -60, nights: 1, guests: 2, vehicles: 1, note: "서핑하러 가요!", status: "completed", createdDaysAgo: 70 },

  // ── 데모 마당지기(박산들)가 받은 신청 ──
  { id: "bk-06", spaceId: "sp-01", guestId: "u-guest-2", hostId: DEMO_HOST_ID, start: 14, nights: 1, guests: 2, vehicles: 1, note: "별 사진 찍으러 가고 싶어요. 조용히 있다 갈게요.", status: "requested", createdDaysAgo: 0 },
  { id: "bk-08", spaceId: "sp-13", guestId: "u-guest-3", hostId: DEMO_HOST_ID, start: 21, nights: 1, guests: 4, vehicles: 1, note: "아이 둘과 함께 가요. 일찍 잘게요!", status: "approved", createdDaysAgo: 5 },
  { id: "bk-07", spaceId: "sp-20", guestId: "u-guest-3", hostId: DEMO_HOST_ID, start: -30, nights: 1, guests: 4, vehicles: 1, note: "가족 캠핑 부탁드려요.", status: "completed", createdDaysAgo: 40 },
  { id: "bk-13", spaceId: "sp-13", guestId: "u-guest-2", hostId: DEMO_HOST_ID, start: -35, nights: 1, guests: 2, vehicles: 1, note: "메밀꽃 시즌에 꼭 가 보고 싶었어요.", status: "completed", createdDaysAgo: 45 },

  // ── 그 밖의 이용 완료 건 (마당 일기 예시용) ──
  { id: "bk-09", spaceId: "sp-04", guestId: "u-guest-2", hostId: "u-host-3", start: -40, nights: 1, guests: 1, vehicles: 1, note: "혼자 조용히 차박해요.", status: "completed", createdDaysAgo: 50 },
  { id: "bk-10", spaceId: "sp-02", guestId: "u-guest-3", hostId: "u-host-1", start: -15, nights: 0, guests: 4, vehicles: 1, note: "아이들과 소풍 가요.", status: "completed", createdDaysAgo: 20 },
  { id: "bk-11", spaceId: "sp-09", guestId: "u-guest-2", hostId: "u-host-5", start: -25, nights: 1, guests: 2, vehicles: 1, note: "사과꽃 보러 가요.", status: "completed", createdDaysAgo: 33 },
  { id: "bk-12", spaceId: "sp-03", guestId: "u-guest-3", hostId: "u-host-2", start: -50, nights: 1, guests: 4, vehicles: 1, note: "강아지와 함께 가도 될까요?", status: "completed", createdDaysAgo: 60 },
  { id: "bk-14", spaceId: "sp-12", guestId: "u-guest-2", hostId: "u-host-2", start: -18, nights: 1, guests: 2, vehicles: 1, note: "조용한 곳을 찾고 있었어요.", status: "completed", createdDaysAgo: 25 },
  { id: "bk-15", spaceId: "sp-17", guestId: "u-guest-3", hostId: "u-host-2", start: -12, nights: 0, guests: 6, vehicles: 2, note: "모임 나들이로 가요.", status: "completed", createdDaysAgo: 16 },
  { id: "bk-16", spaceId: "sp-11", guestId: "u-guest-2", hostId: "u-host-1", start: -8, nights: 1, guests: 1, vehicles: 1, note: "은하수 촬영하러 가요.", status: "completed", createdDaysAgo: 12 },
];

function historyFor(b: BookingSeedInput): Booking["history"] {
  const created = relDateTime(-b.createdDaysAgo, 9, 30);
  const h: Booking["history"] = [{ status: "requested", at: created, byUserId: b.guestId }];
  const later = relDateTime(-b.createdDaysAgo + 1 > 0 ? 0 : -b.createdDaysAgo + 1, 20, 10);
  if (b.status === "approved" || b.status === "completed") h.push({ status: "approved", at: later, byUserId: b.hostId });
  if (b.status === "rejected") h.push({ status: "rejected", at: later, byUserId: b.hostId, memo: b.memo });
  if (b.status === "cancelled") h.push({ status: "cancelled", at: later, byUserId: b.guestId, memo: b.memo });
  if (b.status === "completed") h.push({ status: "completed", at: relDateTime(b.start + b.nights, 12), byUserId: b.hostId });
  return h;
}

export const seedBookings: Booking[] = INPUTS.map((b) => {
  const history = historyFor(b);
  return {
    id: b.id,
    spaceId: b.spaceId,
    guestId: b.guestId,
    hostId: b.hostId,
    startDate: relDate(b.start),
    endDate: relDate(b.start + b.nights),
    guests: b.guests,
    vehicles: b.vehicles,
    note: b.note,
    agreedFireAndTrash: true,
    status: b.status,
    history,
    createdAt: history[0].at,
    updatedAt: history[history.length - 1].at,
  };
});
