/**
 * 가짜 DB: /data 폴더의 시드 데이터를 처음 한 번 localStorage에 복사하고,
 * 그 뒤로는 localStorage에서 읽고 씁니다. (테이블 하나 = localStorage 키 하나)
 *
 * SEED_VERSION을 올리면 모든 사용자의 데모 데이터가 새 시드로 다시 채워집니다.
 */
import { readJSON, writeJSON, clearAll } from "@/lib/storage/local-store";
import type { Collection } from "../types";
import type {
  Booking,
  DiaryEntry,
  Message,
  Report,
  Space,
  SpacePrivate,
  User,
  VerificationRequest,
} from "@/lib/domain/types";
import { occupiedDates } from "@/lib/domain/booking-rules";
import { seedUsers } from "@/data/users";
import { seedSpaces, seedSpacePrivates } from "@/data/spaces";
import { seedBookings } from "@/data/bookings";
import { seedMessages } from "@/data/messages";
import { seedDiaries } from "@/data/diaries";
import { seedReports } from "@/data/reports";
import { seedVerificationRequests } from "@/data/verification-requests";

export const SEED_VERSION = 3;

export type Tables = {
  users: User[];
  spaces: Space[];
  spacePrivates: SpacePrivate[];
  bookings: Booking[];
  messages: Message[];
  diaries: DiaryEntry[];
  reports: Report[];
  verifications: VerificationRequest[];
};

const TABLE_NAMES: (keyof Tables)[] = [
  "users",
  "spaces",
  "spacePrivates",
  "bookings",
  "messages",
  "diaries",
  "reports",
  "verifications",
];

function buildSeed(): Tables {
  // 신청 예시의 날짜가 마당지기가 열어 둔 날짜에 꼭 들어가도록 맞춰 줍니다.
  const spaces = seedSpaces.map((s) => {
    const extra = seedBookings
      .filter((b) => b.spaceId === s.id && (b.status === "requested" || b.status === "approved"))
      .flatMap(occupiedDates);
    return { ...s, availableDates: Array.from(new Set([...s.availableDates, ...extra])).sort() };
  });
  return {
    users: seedUsers,
    spaces,
    spacePrivates: seedSpacePrivates,
    bookings: seedBookings,
    messages: seedMessages,
    diaries: seedDiaries,
    reports: seedReports,
    verifications: seedVerificationRequests,
  };
}

let seededChecked = false;

/** 처음 실행이거나 시드 버전이 바뀌었으면 시드를 다시 채웁니다. */
export function ensureSeeded(): void {
  if (seededChecked || typeof window === "undefined") return;
  const meta = readJSON<{ seedVersion: number } | null>("meta", null);
  if (!meta || meta.seedVersion !== SEED_VERSION) {
    const seed = buildSeed();
    TABLE_NAMES.forEach((t) => writeJSON(`db:${t}`, seed[t]));
    writeJSON("meta", { seedVersion: SEED_VERSION, seededAt: new Date().toISOString() });
  }
  seededChecked = true;
}

export function readTable<K extends keyof Tables>(name: K): Tables[K] {
  ensureSeeded();
  return readJSON<Tables[K]>(`db:${name}`, [] as unknown as Tables[K]);
}

export function writeTable<K extends keyof Tables>(name: K, rows: Tables[K]): void {
  writeJSON(`db:${name}`, rows);
  emit(name);
}

export function resetAll(): void {
  // 로그인 상태(session)는 남겨 두고 데이터만 지웁니다.
  const session = readJSON<string | null>("session", null);
  clearAll();
  if (session) writeJSON("session", session);
  seededChecked = false;
  ensureSeeded();
  TABLE_NAMES.forEach((t) => emit(t));
}

/* ── 변경 알림 ── */
const listeners = new Set<(c: Collection) => void>();

export function subscribe(listener: (c: Collection) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emit(c: Collection): void {
  listeners.forEach((l) => l(c));
}

// 다른 브라우저 탭에서 데이터를 바꾸면 이 탭에도 알려 줍니다.
// (가짜 로그인 상태는 모든 탭이 함께 쓰므로, 역할을 바꾸면 다른 탭은 새로고침해 주세요.)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    const m = e.key?.match(/^madang:db:(\w+)$/);
    if (m && (TABLE_NAMES as string[]).includes(m[1])) emit(m[1] as Collection);
  });
}

/** 진짜 서버처럼 아주 짧게 기다립니다 → 로딩 화면도 확인할 수 있게 */
export const MOCK_DELAY_MS = 120;
export function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
