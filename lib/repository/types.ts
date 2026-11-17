/**
 * Repository(저장소) 인터페이스 — "데이터를 어떻게 읽고 쓰는가"의 약속입니다.
 *
 * 화면 코드는 이 인터페이스만 알고, 데이터가 실제로 어디에 저장되는지
 * (지금: 가짜 데이터 + localStorage / 나중: Supabase)는 모릅니다.
 * 그래서 저장 방식을 바꿀 때 화면 코드는 고치지 않아도 됩니다.
 *
 * - 모든 메서드는 Promise를 돌려줍니다. 나중에 네트워크 요청으로 바뀌어도 화면 코드는 똑같이 await 하면 됩니다.
 * - "누가 요청했는지"는 따로 넘기지 않습니다. 지금 로그인한 사람(가짜 로그인 세션)을 저장소가 직접 확인합니다.
 *   Supabase에서도 로그인 세션 + RLS(행 단위 권한)로 똑같이 동작합니다.
 * - 권한이 없으면 RepositoryError를 던집니다.
 */
import type {
  AmenityKey,
  Booking,
  BookingStatus,
  DateString,
  DiaryEntry,
  LatLng,
  Message,
  RegionCode,
  Report,
  ReportReason,
  ReportStatus,
  Space,
  SpacePrivate,
  SpaceType,
  User,
  VerificationKind,
  VerificationRequest,
} from "@/lib/domain/types";

/** 데이터 묶음 이름 — 변경 알림에 사용 */
export type Collection =
  | "users"
  | "spaces"
  | "spacePrivates"
  | "bookings"
  | "messages"
  | "diaries"
  | "reports"
  | "verifications";

export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepositoryError";
  }
}

/* ───────── 화면에 바로 쓰기 좋게 묶은 모양 ───────── */

export interface SpaceListItem {
  space: Space;
  host: User | null;
  /** 본인 인증 + 소유 확인이 모두 끝난 마당지기인지 */
  hostVerified: boolean;
  ratingAvg: number | null;
  ratingCount: number;
}

export interface BookingDetail {
  booking: Booking;
  space: Space | null;
  guest: User | null;
  host: User | null;
  hasDiary: boolean;
}

export interface ThreadSummary extends BookingDetail {
  lastMessage: Message | null;
}

export interface DiaryWithAuthor {
  diary: DiaryEntry;
  author: User | null;
}

export interface DiaryWithSpace {
  diary: DiaryEntry;
  space: Space | null;
}

export interface ReportWithSpace {
  report: Report;
  space: Space | null;
  reporter: User | null;
}

export interface VerificationWithUser {
  request: VerificationRequest;
  user: User | null;
}

/* ───────── 입력 모양 ───────── */

export interface SpaceFilter {
  regionCode?: RegionCode;
  types?: SpaceType[];
  /** 이 날 신청 가능한 곳만 */
  date?: DateString;
  /** 이 인원 이상 받을 수 있는 곳만 */
  guests?: number;
  /** 이 편의시설을 모두 갖춘 곳만 */
  amenities?: AmenityKey[];
}

/** 마당 등록·수정 입력 (id·마당지기·상태 등은 저장소가 정함) */
export interface SpaceInput {
  title: string;
  description: string;
  type: SpaceType;
  regionCode: RegionCode;
  neighborhood: string;
  landType: Space["landType"];
  nearForest: boolean;
  maxGuests: number;
  maxVehicles: number;
  amenities: AmenityKey[];
  rules: string[];
  checkInTime: string;
  checkOutTime: string;
  availableDates: DateString[];
  photos: string[];
  legalCheckedIds: string[];
  /** 비공개: 상세 주소 */
  address: string;
  /** 비공개: 지도에서 찍은 정확한 위치 */
  exactLocation: LatLng;
}

export interface BookingInput {
  spaceId: string;
  startDate: DateString;
  endDate: DateString;
  guests: number;
  vehicles: number;
  note: string;
  agreedFireAndTrash: boolean;
}

export interface DiaryInput {
  bookingId: string;
  rating: number;
  text: string;
  photos: string[];
}

/* ───────── 저장소 묶음별 약속 ───────── */

export interface UsersRepository {
  get(id: string): Promise<User | null>;
}

export interface SpacesRepository {
  /** 찾기: 공개된(숨김 아님) 마당만 */
  search(filter?: SpaceFilter): Promise<SpaceListItem[]>;
  /** 상세: 숨김 마당은 소유 마당지기·관리자만 볼 수 있음(그 외엔 null) */
  get(id: string): Promise<SpaceListItem | null>;
  /** 내가 등록한 마당 (마당지기) */
  listMine(): Promise<SpaceListItem[]>;
  /** 모든 마당 (관리자) */
  listAll(): Promise<SpaceListItem[]>;
  create(input: SpaceInput): Promise<Space>;
  update(id: string, input: SpaceInput): Promise<Space>;
  /** 숨김/공개 (관리자) */
  setHidden(id: string, hidden: boolean, reason?: string): Promise<Space>;
  /** 정확한 주소 — 승인된 마당손님·소유 마당지기·관리자만, 그 외엔 null */
  getPrivate(spaceId: string): Promise<SpacePrivate | null>;
  /** 이미 승인된 신청이 차지한 날짜 */
  takenDates(spaceId: string): Promise<DateString[]>;
}

export interface BookingsRepository {
  /** 마당 신청 (마당손님) — 인사말은 대화방 첫 메시지가 됩니다 */
  create(input: BookingInput): Promise<Booking>;
  /** 신청 1건 — 해당 마당손님·마당지기·관리자만 */
  get(id: string): Promise<BookingDetail | null>;
  /** 내 신청 내역 (마당손님) */
  listMine(): Promise<BookingDetail[]>;
  /** 받은 신청 (마당지기) */
  listReceived(): Promise<BookingDetail[]>;
  /** 상태 바꾸기: 승인·거절·이용 완료(마당지기), 취소(마당손님) */
  changeStatus(id: string, to: BookingStatus, memo?: string): Promise<Booking>;
}

export interface MessagesRepository {
  listByBooking(bookingId: string): Promise<Message[]>;
  send(bookingId: string, text: string): Promise<Message>;
  /** 내 대화 목록 (손님이면 내 신청들, 지기면 받은 신청들) */
  listThreads(): Promise<ThreadSummary[]>;
}

export interface DiariesRepository {
  listBySpace(spaceId: string): Promise<DiaryWithAuthor[]>;
  listMine(): Promise<DiaryWithSpace[]>;
  /** 이용 완료된 내 신청에만, 신청 1건당 1번 */
  create(input: DiaryInput): Promise<DiaryEntry>;
}

export interface ReportsRepository {
  create(input: { spaceId: string; reason: ReportReason; detail: string }): Promise<Report>;
  /** 신고 목록 (관리자) */
  list(): Promise<ReportWithSpace[]>;
  setStatus(id: string, status: ReportStatus): Promise<Report>;
}

export interface VerificationsRepository {
  /** 내 인증 요청 (본인 인증 / 소유 확인) */
  request(kind: VerificationKind, opts: { fileName?: string; demoAuto: boolean }): Promise<VerificationRequest>;
  listMine(): Promise<VerificationRequest[]>;
  /** 인증 요청 목록 (관리자) */
  list(): Promise<VerificationWithUser[]>;
  /** 승인/반려 (관리자) */
  review(id: string, approve: boolean): Promise<VerificationRequest>;
  /** 데모 전용: 3초 지난 자동 인증 요청을 '인증 완료'로 바꿉니다 */
  settleDemo(): Promise<void>;
}

export interface Repository {
  users: UsersRepository;
  spaces: SpacesRepository;
  bookings: BookingsRepository;
  messages: MessagesRepository;
  diaries: DiariesRepository;
  reports: ReportsRepository;
  verifications: VerificationsRepository;
  /** 데이터가 바뀌면 알려 줍니다. 반환된 함수를 부르면 구독 해제. */
  subscribe(listener: (collection: Collection) => void): () => void;
  /** 데모 데이터를 처음 상태로 되돌립니다. (프로토타입 전용) */
  resetDemoData(): Promise<void>;
}
