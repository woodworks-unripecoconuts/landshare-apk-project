/**
 * 마당공유의 핵심 데이터 모양(타입) 모음입니다.
 *
 * - 이 파일은 React·Next.js에 전혀 의존하지 않는 순수 TypeScript입니다.
 *   나중에 안드로이드 앱(React Native 등)을 만들 때도 그대로 가져다 쓸 수 있습니다.
 * - 나중에 Supabase로 옮길 때 테이블 하나 = 아래 인터페이스 하나로 생각하면 됩니다.
 */

/** 날짜 문자열 'YYYY-MM-DD' (예: '2026-11-28') */
export type DateString = string;
/** 날짜+시간 ISO 문자열 (예: '2026-11-17T09:00:00.000Z') */
export type ISODateTime = string;

export interface LatLng {
  lat: number;
  lng: number;
}

/* ───────────── 사용자 ───────────── */

/** guest = 마당손님, host = 마당지기, admin = 관리자 */
export type Role = "guest" | "host" | "admin";

/** 인증 상태: 안 함 / 심사 중 / 인증 완료 / 반려 */
export type VerificationStatus = "none" | "pending" | "verified" | "rejected";

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  intro?: string;
  /** 사는 곳(시·군 이름) — 프로필 표시용 */
  hometown?: string;
  joinedAt: ISODateTime;
  /** 본인 인증 상태 */
  identityStatus: VerificationStatus;
  /** 토지·주택 소유 확인 상태 (마당지기만 의미 있음) */
  ownershipStatus: VerificationStatus;
}

/* ───────────── 지역 ───────────── */

/** 강원특별자치도 18개 시·군 코드 */
export type RegionCode =
  | "chuncheon"
  | "wonju"
  | "gangneung"
  | "donghae"
  | "taebaek"
  | "sokcho"
  | "samcheok"
  | "hongcheon"
  | "hoengseong"
  | "yeongwol"
  | "pyeongchang"
  | "jeongseon"
  | "cheorwon"
  | "hwacheon"
  | "yanggu"
  | "inje"
  | "goseong"
  | "yangyang";

export interface Region {
  code: RegionCode;
  /** 정식 이름 (예: '춘천시') */
  name: string;
  /** 짧은 이름 (예: '춘천') */
  shortName: string;
  center: LatLng;
  zoom: number;
}

/* ───────────── 공간(마당) ───────────── */

/** camping = 마당캠핑, carcamp = 마당차박, picnic = 마당나들이 */
export type SpaceType = "camping" | "carcamp" | "picnic";

/** 토지 종류: 주택 마당 / 농지 / 임야 / 기타 */
export type LandType = "house_yard" | "farmland" | "forest" | "other";

/** 편의시설 */
export type AmenityKey =
  | "toilet"
  | "water"
  | "electricity"
  | "parking"
  | "fire"
  | "pets"
  | "shade";

export type SpaceStatus = "active" | "hidden";

/**
 * 누구나 볼 수 있는 공개 정보.
 * 정확한 주소·좌표는 여기 넣지 않고 SpacePrivate에 따로 둡니다.
 */
export interface Space {
  id: string;
  hostId: string;
  title: string;
  description: string;
  type: SpaceType;
  regionCode: RegionCode;
  /** 동네 이름 (예: '봉평면 무이리') */
  neighborhood: string;
  /** 동네 단위 원의 중심 — 실제 위치에서 일부러 조금 떨어뜨린 좌표 */
  approxCenter: LatLng;
  /** 동네 단위 원의 반지름(m) */
  approxRadiusM: number;
  landType: LandType;
  /** 산림 또는 산림에서 100m 이내인지 */
  nearForest: boolean;
  maxGuests: number;
  maxVehicles: number;
  amenities: AmenityKey[];
  rules: string[];
  /** 'HH:MM' */
  checkInTime: string;
  checkOutTime: string;
  availableDates: DateString[];
  photos: string[];
  status: SpaceStatus;
  hiddenReason?: string;
  /** 등록 6단계에서 체크한 법령 안내 항목 id 목록 */
  legalCheckedIds: string[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** 비공개 정보: 승인된 마당손님·소유 마당지기·관리자만 볼 수 있음 */
export interface SpacePrivate {
  spaceId: string;
  address: string;
  exactLocation: LatLng;
}

/* ───────────── 마당 신청 ───────────── */

/** 신청됨 / 승인 / 거절 / 취소 / 이용 완료 */
export type BookingStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export interface BookingHistoryItem {
  status: BookingStatus;
  at: ISODateTime;
  byUserId: string;
  memo?: string;
}

export interface Booking {
  id: string;
  spaceId: string;
  guestId: string;
  hostId: string;
  /** 시작일 (이 날 체크인) */
  startDate: DateString;
  /** 마지막 이용일. 당일 나들이면 startDate와 같음 */
  endDate: DateString;
  guests: number;
  vehicles: number;
  /** 신청할 때 마당지기에게 남긴 인사말 */
  note: string;
  /** "불 사용 규칙과 쓰레기 되가져가기에 동의합니다" 체크 여부 */
  agreedFireAndTrash: boolean;
  status: BookingStatus;
  history: BookingHistoryItem[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/* ───────────── 메시지 ───────────── */

/** senderId가 'system'이면 상태 변경 안내 같은 자동 메시지 */
export interface Message {
  id: string;
  bookingId: string;
  senderId: string | "system";
  text: string;
  createdAt: ISODateTime;
}

/* ───────────── 마당 일기(후기) ───────────── */

export interface DiaryEntry {
  id: string;
  bookingId: string;
  spaceId: string;
  authorId: string;
  /** 별점 1~5 */
  rating: number;
  text: string;
  photos: string[];
  createdAt: ISODateTime;
}

/* ───────────── 신고 ───────────── */

export type ReportReason = "fee" | "illegal" | "safety" | "false_info" | "etc";
export type ReportStatus = "open" | "resolved" | "dismissed";

export interface Report {
  id: string;
  spaceId: string;
  reporterId: string;
  reason: ReportReason;
  detail: string;
  status: ReportStatus;
  createdAt: ISODateTime;
  handledAt?: ISODateTime;
}

/* ───────────── 인증 요청 ───────────── */

/** identity = 본인 인증, ownership = 토지·주택 소유 확인 */
export type VerificationKind = "identity" | "ownership";

export interface VerificationRequest {
  id: string;
  userId: string;
  kind: VerificationKind;
  status: VerificationStatus;
  /** 업로드한 파일 이름(데모: 파일 내용은 저장하지 않음) */
  fileName?: string;
  /** true면 데모 버튼으로 요청한 것 → 3초 뒤 자동 인증 완료 */
  demoAuto: boolean;
  requestedAt: ISODateTime;
  reviewedAt?: ISODateTime;
}
