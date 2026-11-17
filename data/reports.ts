/** 가짜 신고 목록 (관리자 화면 확인용) */
import type { Report } from "@/lib/domain/types";
import { relDateTime } from "@/lib/domain/dates";
import { DEMO_GUEST_ID } from "./users";

export const seedReports: Report[] = [
  { id: "rp-01", spaceId: "sp-08", reporterId: "u-guest-2", reason: "fee", detail: "도착하니 '사례금'으로 1만원을 달라고 하셨어요.", status: "open", createdAt: relDateTime(-1, 15) },
  { id: "rp-02", spaceId: "sp-15", reporterId: "u-guest-3", reason: "safety", detail: "차박 자리 바로 옆 배수로가 깊어서 밤에 위험해 보였어요.", status: "open", createdAt: relDateTime(-3, 11) },
  { id: "rp-03", spaceId: "sp-06", reporterId: DEMO_GUEST_ID, reason: "false_info", detail: "화장실이 있다고 되어 있었는데 없었어요.", status: "resolved", createdAt: relDateTime(-20, 10), handledAt: relDateTime(-19, 14) },
];
