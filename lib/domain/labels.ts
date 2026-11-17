/**
 * 화면에 보여 줄 한국어 이름표 모음 (서비스 용어 사전)
 *  - 호스트 = 마당지기, 게스트 = 마당손님, 예약 신청 = 마당 신청, 후기 = 마당 일기
 */
import type { BookingStatus, ReportReason, ReportStatus, Role, VerificationKind, VerificationStatus } from "./types";

export const ROLE_LABEL: Record<Role, string> = {
  guest: "마당손님",
  host: "마당지기",
  admin: "관리자",
};

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  requested: "신청됨",
  approved: "승인",
  rejected: "거절",
  cancelled: "취소",
  completed: "이용 완료",
};

export const VERIFICATION_STATUS_LABEL: Record<VerificationStatus, string> = {
  none: "미인증",
  pending: "심사 중",
  verified: "인증 완료(데모)",
  rejected: "반려됨",
};

export const VERIFICATION_KIND_LABEL: Record<VerificationKind, string> = {
  identity: "본인 인증",
  ownership: "토지·주택 소유 확인",
};

export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  fee: "이용료·사례금을 요구했어요",
  illegal: "불법 영업·분양이 의심돼요",
  safety: "안전이 걱정돼요",
  false_info: "정보가 실제와 달라요",
  etc: "기타",
};

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  open: "접수됨",
  resolved: "처리 완료",
  dismissed: "기각",
};
