/** 가짜 메시지 — 신청 건별 1:1 대화 */
import type { Message } from "@/lib/domain/types";
import { relDateTime } from "@/lib/domain/dates";
import { DEMO_GUEST_ID, DEMO_HOST_ID } from "./users";

let n = 0;
const m = (bookingId: string, senderId: string, text: string, daysAgo: number, hour: number, minute = 0): Message => ({
  id: `msg-seed-${++n}`,
  bookingId,
  senderId,
  text,
  createdAt: relDateTime(-daysAgo, hour, minute),
});

export const seedMessages: Message[] = [
  // bk-01: 원주 귀래 (이용 완료)
  m("bk-01", DEMO_GUEST_ID, "처음 마당캠핑 해 봐요. 조용히 쉬다 가겠습니다!", 30, 9, 30),
  m("bk-01", "system", "마당지기가 신청을 승인했어요. 이제 정확한 주소를 볼 수 있어요.", 29, 20, 10),
  m("bk-01", "u-host-2", "반가워요! 도착하시면 평상 옆에 텐트 치시면 돼요. 개수대는 창고 옆이에요.", 29, 20, 12),
  m("bk-01", DEMO_GUEST_ID, "감사합니다. 쓰레기는 다 챙겨 갈게요!", 29, 21, 0),
  m("bk-01", "system", "이용 완료로 바뀌었어요. 마당 일기를 남겨 보세요.", 20, 12),

  // bk-02: 평창 봉평 (신청됨) — 데모 마당지기가 승인/거절해 볼 수 있음
  m("bk-02", DEMO_GUEST_ID, "메밀꽃 보러 가족 셋이 가고 싶어요. 불은 쓰지 않을게요.", 1, 9, 30),

  // bk-03: 강릉 사천 (승인)
  m("bk-03", DEMO_GUEST_ID, "바다 보면서 차박하고 싶어요. 늦게 도착할 수도 있어요.", 4, 9, 30),
  m("bk-03", "system", "마당지기가 신청을 승인했어요. 이제 정확한 주소를 볼 수 있어요.", 3, 20, 10),
  m("bk-03", "u-host-3", "늦게 오셔도 괜찮아요. 대문은 열어 둘게요. 차는 감나무 옆에 세워 주세요.", 3, 20, 15),

  // bk-04: 태백 (거절)
  m("bk-04", DEMO_GUEST_ID, "친구들과 도시락 먹으러 가도 될까요?", 3, 9, 30),
  m("bk-04", "system", "마당지기가 신청을 거절했어요. (그날은 집안 행사가 있어 어려워요. 다음에 꼭 오세요!)", 2, 20, 10),

  // bk-06: 춘천 동산면 (신청됨) — 데모 마당지기가 받은 신청
  m("bk-06", "u-guest-2", "별 사진 찍으러 가고 싶어요. 조용히 있다 갈게요.", 0, 8, 10),

  // bk-08: 평창 봉평 (승인) — 데모 마당지기
  m("bk-08", "u-guest-3", "아이 둘과 함께 가요. 일찍 잘게요!", 5, 9, 30),
  m("bk-08", "system", "마당지기가 신청을 승인했어요. 이제 정확한 주소를 볼 수 있어요.", 4, 20, 10),
  m("bk-08", DEMO_HOST_ID, "환영해요! 집 뒤가 숲이라 불은 쓸 수 없는 점만 꼭 기억해 주세요.", 4, 20, 20),
  m("bk-08", "u-guest-3", "네, 버너도 안 가져갈게요. 감사합니다!", 4, 21, 5),
];
