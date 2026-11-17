/** 가짜 인증 요청 목록 (관리자 '인증 요청' 탭 확인용) */
import type { VerificationRequest } from "@/lib/domain/types";
import { relDateTime } from "@/lib/domain/dates";

export const seedVerificationRequests: VerificationRequest[] = [
  { id: "vr-01", userId: "u-host-4", kind: "ownership", status: "pending", fileName: "등기부등본_정선_북평면.pdf", demoAuto: false, requestedAt: relDateTime(-2, 13) },
  { id: "vr-02", userId: "u-host-6", kind: "identity", status: "pending", demoAuto: false, requestedAt: relDateTime(-1, 16) },
  { id: "vr-03", userId: "u-host-1", kind: "ownership", status: "verified", fileName: "등기부등본_홍천.pdf", demoAuto: false, requestedAt: relDateTime(-290, 10), reviewedAt: relDateTime(-289, 11) },
];
