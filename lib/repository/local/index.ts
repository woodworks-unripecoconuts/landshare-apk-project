/**
 * 가짜 데이터 + localStorage로 동작하는 Repository 구현입니다.
 *
 * 권한 검사(누가 무엇을 할 수 있는지)도 여기서 합니다.
 * 나중에 Supabase로 옮기면 이 검사는 DB의 RLS(행 단위 권한) 정책이 맡게 됩니다.
 */
import type {
  Booking,
  BookingStatus,
  DiaryEntry,
  Message,
  Report,
  Role,
  Space,
  SpacePrivate,
  User,
  VerificationRequest,
} from "@/lib/domain/types";
import {
  type BookingDetail,
  type Repository,
  RepositoryError,
  type SpaceFilter,
  type SpaceInput,
  type SpaceListItem,
  type ThreadSummary,
} from "../types";
import { authService } from "@/lib/auth/auth-service";
import { canChangeStatus, occupiedDates, systemMessageFor, validateDates } from "@/lib/domain/booking-rules";
import {
  APPROX_RADIUS_M,
  forcesNearForest,
  isHostVerified,
  makeApproxCenter,
  sanitizeAmenities,
} from "@/lib/domain/space-rules";
import { isInsideGangwon, isRegionCode } from "@/data/regions";
import { newId } from "@/lib/utils/id";
import { delay, readTable, resetAll, subscribe, writeTable, type Tables } from "./db";

/* ───────── 공통 도우미 ───────── */

const nowISO = () => new Date().toISOString();
const DEMO_VERIFY_MS = 3000;

function currentUser(): User | null {
  const id = authService.getCurrentUserId();
  if (!id) return null;
  return readTable("users").find((u) => u.id === id) ?? null;
}

function requireUser(): User {
  const u = currentUser();
  if (!u) throw new RepositoryError("로그인이 필요해요.");
  return u;
}

function requireRole(role: Role): User {
  const u = requireUser();
  if (u.role !== role) {
    const label = role === "host" ? "마당지기" : role === "guest" ? "마당손님" : "관리자";
    throw new RepositoryError(`${label}만 할 수 있어요.`);
  }
  return u;
}

/** 데모 인증: 요청 후 3초가 지났으면 '인증 완료'로 바꿉니다. */
function settleDemoVerifications(): void {
  const reqs = readTable("verifications");
  const now = Date.now();
  let changed = false;
  const users = readTable("users");
  const nextReqs = reqs.map((r) => {
    if (r.status === "pending" && r.demoAuto && now - new Date(r.requestedAt).getTime() >= DEMO_VERIFY_MS) {
      changed = true;
      const u = users.find((x) => x.id === r.userId);
      if (u) {
        if (r.kind === "identity") u.identityStatus = "verified";
        else u.ownershipStatus = "verified";
      }
      return { ...r, status: "verified" as const, reviewedAt: nowISO() };
    }
    return r;
  });
  if (changed) {
    writeTable("verifications", nextReqs);
    writeTable("users", users);
  }
}

function buildIndexes() {
  const users = new Map(readTable("users").map((u) => [u.id, u]));
  const ratings = new Map<string, { sum: number; count: number }>();
  for (const d of readTable("diaries")) {
    const r = ratings.get(d.spaceId) ?? { sum: 0, count: 0 };
    r.sum += d.rating;
    r.count += 1;
    ratings.set(d.spaceId, r);
  }
  return { users, ratings };
}

function toListItem(space: Space, idx: ReturnType<typeof buildIndexes>): SpaceListItem {
  const host = idx.users.get(space.hostId) ?? null;
  const r = idx.ratings.get(space.id);
  return {
    space,
    host,
    hostVerified: isHostVerified(host),
    ratingAvg: r ? Math.round((r.sum / r.count) * 10) / 10 : null,
    ratingCount: r?.count ?? 0,
  };
}

function takenDatesOf(spaceId: string, bookings: Booking[], exceptBookingId?: string): string[] {
  return bookings
    .filter((b) => b.spaceId === spaceId && b.status === "approved" && b.id !== exceptBookingId)
    .flatMap(occupiedDates);
}

function newestFirst<T extends { createdAt: string }>(a: T, b: T) {
  return b.createdAt.localeCompare(a.createdAt);
}

function toBookingDetail(b: Booking, tables: Pick<Tables, "spaces" | "diaries">, users: Map<string, User>): BookingDetail {
  return {
    booking: b,
    space: tables.spaces.find((s) => s.id === b.spaceId) ?? null,
    guest: users.get(b.guestId) ?? null,
    host: users.get(b.hostId) ?? null,
    hasDiary: tables.diaries.some((d) => d.bookingId === b.id),
  };
}

function canAccessBooking(b: Booking, u: User | null): boolean {
  return !!u && (u.role === "admin" || b.guestId === u.id || b.hostId === u.id);
}

function addMessage(bookingId: string, senderId: string, text: string): Message {
  const msg: Message = { id: newId("msg"), bookingId, senderId, text, createdAt: nowISO() };
  writeTable("messages", [...readTable("messages"), msg]);
  return msg;
}

function validateSpaceInput(input: SpaceInput): void {
  if (!input.title.trim()) throw new RepositoryError("제목을 입력해 주세요.");
  if (!isRegionCode(input.regionCode)) throw new RepositoryError("강원 18개 시·군 중에서 골라 주세요.");
  if (!isInsideGangwon(input.exactLocation.lat, input.exactLocation.lng))
    throw new RepositoryError("지도에서 강원 지역 안의 위치를 찍어 주세요.");
  if (input.maxGuests < 1) throw new RepositoryError("수용 인원은 1명 이상이어야 해요.");
}

function normalizeSpaceFields(input: SpaceInput) {
  const nearForest = input.nearForest || forcesNearForest(input.landType);
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    type: input.type,
    regionCode: input.regionCode,
    neighborhood: input.neighborhood.trim(),
    landType: input.landType,
    nearForest,
    maxGuests: input.maxGuests,
    maxVehicles: input.maxVehicles,
    amenities: sanitizeAmenities(input.amenities, nearForest),
    rules: input.rules.map((r) => r.trim()).filter(Boolean),
    checkInTime: input.checkInTime,
    checkOutTime: input.checkOutTime,
    availableDates: Array.from(new Set(input.availableDates)).sort(),
    photos: input.photos,
    legalCheckedIds: input.legalCheckedIds,
  };
}

/* ───────── Repository 만들기 ───────── */

export function createLocalRepository(): Repository {
  return {
    /* ── 사용자 ── */
    users: {
      async get(id) {
        settleDemoVerifications();
        return delay(readTable("users").find((u) => u.id === id) ?? null);
      },
    },

    /* ── 마당(공간) ── */
    spaces: {
      async search(filter: SpaceFilter = {}) {
        settleDemoVerifications();
        const idx = buildIndexes();
        const bookings = readTable("bookings");
        const result = readTable("spaces")
          .filter((s) => s.status === "active")
          .filter((s) => !filter.regionCode || s.regionCode === filter.regionCode)
          .filter((s) => !filter.types?.length || filter.types.includes(s.type))
          .filter((s) => !filter.guests || s.maxGuests >= filter.guests)
          .filter((s) => !filter.amenities?.length || filter.amenities.every((a) => s.amenities.includes(a)))
          .filter(
            (s) =>
              !filter.date ||
              (s.availableDates.includes(filter.date) && !takenDatesOf(s.id, bookings).includes(filter.date)),
          )
          .sort(newestFirst)
          .map((s) => toListItem(s, idx));
        return delay(result);
      },

      async get(id) {
        settleDemoVerifications();
        const space = readTable("spaces").find((s) => s.id === id);
        if (!space) return delay(null);
        if (space.status === "hidden") {
          const u = currentUser();
          if (!u || (u.role !== "admin" && u.id !== space.hostId)) return delay(null);
        }
        return delay(toListItem(space, buildIndexes()));
      },

      async listMine() {
        const u = requireRole("host");
        settleDemoVerifications();
        const idx = buildIndexes();
        return delay(
          readTable("spaces")
            .filter((s) => s.hostId === u.id)
            .sort(newestFirst)
            .map((s) => toListItem(s, idx)),
        );
      },

      async listAll() {
        requireRole("admin");
        const idx = buildIndexes();
        return delay(readTable("spaces").sort(newestFirst).map((s) => toListItem(s, idx)));
      },

      async create(input) {
        const u = requireRole("host");
        validateSpaceInput(input);
        const id = newId("sp");
        const now = nowISO();
        const space: Space = {
          id,
          hostId: u.id,
          ...normalizeSpaceFields(input),
          approxCenter: makeApproxCenter(input.exactLocation, id),
          approxRadiusM: APPROX_RADIUS_M,
          status: "active",
          createdAt: now,
          updatedAt: now,
        };
        const priv: SpacePrivate = { spaceId: id, address: input.address.trim(), exactLocation: input.exactLocation };
        // 사진(data URL)이 커서 저장 공간이 부족하면 여기서 StorageFullError가 납니다.
        writeTable("spacePrivates", [...readTable("spacePrivates"), priv]);
        writeTable("spaces", [...readTable("spaces"), space]);
        return delay(space);
      },

      async update(id, input) {
        const u = requireRole("host");
        validateSpaceInput(input);
        const spaces = readTable("spaces");
        const i = spaces.findIndex((s) => s.id === id);
        if (i < 0) throw new RepositoryError("마당을 찾을 수 없어요.");
        if (spaces[i].hostId !== u.id) throw new RepositoryError("내가 등록한 마당만 고칠 수 있어요.");
        const prev = spaces[i];
        const oldPriv = readTable("spacePrivates").find((p) => p.spaceId === id);
        const moved =
          !oldPriv ||
          oldPriv.exactLocation.lat !== input.exactLocation.lat ||
          oldPriv.exactLocation.lng !== input.exactLocation.lng;
        const next: Space = {
          ...prev,
          ...normalizeSpaceFields(input),
          approxCenter: moved ? makeApproxCenter(input.exactLocation, id) : prev.approxCenter,
          updatedAt: nowISO(),
        };
        spaces[i] = next;
        const privs = readTable("spacePrivates").filter((p) => p.spaceId !== id);
        privs.push({ spaceId: id, address: input.address.trim(), exactLocation: input.exactLocation });
        writeTable("spacePrivates", privs);
        writeTable("spaces", spaces);
        return delay(next);
      },

      async setHidden(id, hidden, reason) {
        requireRole("admin");
        const spaces = readTable("spaces");
        const i = spaces.findIndex((s) => s.id === id);
        if (i < 0) throw new RepositoryError("마당을 찾을 수 없어요.");
        spaces[i] = {
          ...spaces[i],
          status: hidden ? "hidden" : "active",
          hiddenReason: hidden ? reason || "관리자 숨김 처리" : undefined,
          updatedAt: nowISO(),
        };
        writeTable("spaces", spaces);
        return delay(spaces[i]);
      },

      async getPrivate(spaceId) {
        const u = currentUser();
        const space = readTable("spaces").find((s) => s.id === spaceId);
        if (!u || !space) return delay(null);
        const allowed =
          u.role === "admin" ||
          space.hostId === u.id ||
          readTable("bookings").some(
            (b) =>
              b.spaceId === spaceId && b.guestId === u.id && (b.status === "approved" || b.status === "completed"),
          );
        if (!allowed) return delay(null);
        return delay(readTable("spacePrivates").find((p) => p.spaceId === spaceId) ?? null);
      },

      async takenDates(spaceId) {
        return delay(takenDatesOf(spaceId, readTable("bookings")));
      },
    },

    /* ── 마당 신청 ── */
    bookings: {
      async create(input) {
        const u = requireRole("guest");
        const space = readTable("spaces").find((s) => s.id === input.spaceId);
        if (!space || space.status !== "active") throw new RepositoryError("지금은 신청할 수 없는 마당이에요.");
        if (space.hostId === u.id) throw new RepositoryError("내 마당에는 신청할 수 없어요.");
        if (!input.agreedFireAndTrash)
          throw new RepositoryError("불 사용 규칙과 쓰레기 되가져가기에 동의해 주세요.");
        if (input.guests < 1 || input.guests > space.maxGuests)
          throw new RepositoryError(`인원은 1~${space.maxGuests}명까지 가능해요.`);
        if (input.vehicles < 0 || input.vehicles > space.maxVehicles)
          throw new RepositoryError(`차량은 최대 ${space.maxVehicles}대까지 가능해요.`);
        const bookings = readTable("bookings");
        const dateError = validateDates(space, input.startDate, input.endDate, takenDatesOf(space.id, bookings));
        if (dateError) throw new RepositoryError(dateError);

        const now = nowISO();
        const booking: Booking = {
          id: newId("bk"),
          spaceId: space.id,
          guestId: u.id,
          hostId: space.hostId,
          startDate: input.startDate,
          endDate: input.endDate,
          guests: input.guests,
          vehicles: input.vehicles,
          note: input.note.trim(),
          agreedFireAndTrash: true,
          status: "requested",
          history: [{ status: "requested", at: now, byUserId: u.id }],
          createdAt: now,
          updatedAt: now,
        };
        writeTable("bookings", [...bookings, booking]);
        addMessage(booking.id, "system", systemMessageFor("requested"));
        if (booking.note) addMessage(booking.id, u.id, booking.note);
        return delay(booking);
      },

      async get(id) {
        const u = currentUser();
        const b = readTable("bookings").find((x) => x.id === id);
        if (!b || !canAccessBooking(b, u)) return delay(null);
        const { users } = buildIndexes();
        return delay(toBookingDetail(b, { spaces: readTable("spaces"), diaries: readTable("diaries") }, users));
      },

      async listMine() {
        const u = requireUser();
        const { users } = buildIndexes();
        const t = { spaces: readTable("spaces"), diaries: readTable("diaries") };
        return delay(
          readTable("bookings")
            .filter((b) => b.guestId === u.id)
            .sort(newestFirst)
            .map((b) => toBookingDetail(b, t, users)),
        );
      },

      async listReceived() {
        const u = requireRole("host");
        const { users } = buildIndexes();
        const t = { spaces: readTable("spaces"), diaries: readTable("diaries") };
        return delay(
          readTable("bookings")
            .filter((b) => b.hostId === u.id)
            .sort(newestFirst)
            .map((b) => toBookingDetail(b, t, users)),
        );
      },

      async changeStatus(id, to: BookingStatus, memo) {
        const u = requireUser();
        const bookings = readTable("bookings");
        const i = bookings.findIndex((b) => b.id === id);
        if (i < 0) throw new RepositoryError("신청을 찾을 수 없어요.");
        const b = bookings[i];
        if (!canChangeStatus(b, to, u.id, u.role)) throw new RepositoryError("지금은 이 상태로 바꿀 수 없어요.");
        if (to === "approved") {
          const taken = new Set(takenDatesOf(b.spaceId, bookings, b.id));
          if (occupiedDates(b).some((d) => taken.has(d)))
            throw new RepositoryError("이미 승인한 다른 신청과 날짜가 겹쳐요.");
        }
        const now = nowISO();
        const next: Booking = {
          ...b,
          status: to,
          history: [...b.history, { status: to, at: now, byUserId: u.id, memo: memo?.trim() || undefined }],
          updatedAt: now,
        };
        bookings[i] = next;
        writeTable("bookings", bookings);
        addMessage(b.id, "system", systemMessageFor(to, memo?.trim()));
        return delay(next);
      },
    },

    /* ── 메시지 ── */
    messages: {
      async listByBooking(bookingId) {
        const u = currentUser();
        const b = readTable("bookings").find((x) => x.id === bookingId);
        if (!b || !canAccessBooking(b, u)) throw new RepositoryError("이 대화를 볼 수 없어요.");
        return delay(
          readTable("messages")
            .filter((m) => m.bookingId === bookingId)
            .sort((a, c) => a.createdAt.localeCompare(c.createdAt)),
          60,
        );
      },

      async send(bookingId, text) {
        const u = requireUser();
        const b = readTable("bookings").find((x) => x.id === bookingId);
        if (!b || (b.guestId !== u.id && b.hostId !== u.id))
          throw new RepositoryError("이 신청의 마당손님과 마당지기만 메시지를 보낼 수 있어요.");
        const clean = text.trim();
        if (!clean) throw new RepositoryError("메시지를 입력해 주세요.");
        if (clean.length > 1000) throw new RepositoryError("메시지는 1000자까지 보낼 수 있어요.");
        return delay(addMessage(bookingId, u.id, clean), 60);
      },

      async listThreads() {
        const u = requireUser();
        const { users } = buildIndexes();
        const t = { spaces: readTable("spaces"), diaries: readTable("diaries") };
        const messages = readTable("messages");
        const threads: ThreadSummary[] = readTable("bookings")
          .filter((b) => b.guestId === u.id || b.hostId === u.id)
          .map((b) => {
            const msgs = messages.filter((m) => m.bookingId === b.id);
            const last = msgs.sort((a, c) => a.createdAt.localeCompare(c.createdAt)).at(-1) ?? null;
            return { ...toBookingDetail(b, t, users), lastMessage: last };
          })
          .sort((a, c) =>
            (c.lastMessage?.createdAt ?? c.booking.createdAt).localeCompare(a.lastMessage?.createdAt ?? a.booking.createdAt),
          );
        return delay(threads);
      },
    },

    /* ── 마당 일기 ── */
    diaries: {
      async listBySpace(spaceId) {
        const { users } = buildIndexes();
        return delay(
          readTable("diaries")
            .filter((d) => d.spaceId === spaceId)
            .sort(newestFirst)
            .map((d) => ({ diary: d, author: users.get(d.authorId) ?? null })),
        );
      },

      async listMine() {
        const u = requireUser();
        const spaces = readTable("spaces");
        return delay(
          readTable("diaries")
            .filter((d) => d.authorId === u.id)
            .sort(newestFirst)
            .map((d) => ({ diary: d, space: spaces.find((s) => s.id === d.spaceId) ?? null })),
        );
      },

      async create(input) {
        const u = requireUser();
        const b = readTable("bookings").find((x) => x.id === input.bookingId);
        if (!b || b.guestId !== u.id) throw new RepositoryError("내 신청에만 마당 일기를 쓸 수 있어요.");
        if (b.status !== "completed") throw new RepositoryError("이용 완료된 신청에만 마당 일기를 쓸 수 있어요.");
        const diaries = readTable("diaries");
        if (diaries.some((d) => d.bookingId === b.id)) throw new RepositoryError("이미 마당 일기를 썼어요.");
        if (input.rating < 1 || input.rating > 5) throw new RepositoryError("별점을 골라 주세요.");
        if (input.text.trim().length < 10) throw new RepositoryError("마당 일기는 10자 이상 써 주세요.");
        const entry: DiaryEntry = {
          id: newId("dy"),
          bookingId: b.id,
          spaceId: b.spaceId,
          authorId: u.id,
          rating: Math.round(input.rating),
          text: input.text.trim(),
          photos: input.photos,
          createdAt: nowISO(),
        };
        writeTable("diaries", [...diaries, entry]);
        return delay(entry);
      },
    },

    /* ── 신고 ── */
    reports: {
      async create(input) {
        const u = requireUser();
        const space = readTable("spaces").find((s) => s.id === input.spaceId);
        if (!space) throw new RepositoryError("마당을 찾을 수 없어요.");
        if (space.hostId === u.id) throw new RepositoryError("내 마당은 신고할 수 없어요.");
        const report: Report = {
          id: newId("rp"),
          spaceId: input.spaceId,
          reporterId: u.id,
          reason: input.reason,
          detail: input.detail.trim(),
          status: "open",
          createdAt: nowISO(),
        };
        writeTable("reports", [...readTable("reports"), report]);
        return delay(report);
      },

      async list() {
        requireRole("admin");
        const { users } = buildIndexes();
        const spaces = readTable("spaces");
        return delay(
          readTable("reports")
            .sort((a, b) => (a.status === "open" ? 0 : 1) - (b.status === "open" ? 0 : 1) || newestFirst(a, b))
            .map((r) => ({
              report: r,
              space: spaces.find((s) => s.id === r.spaceId) ?? null,
              reporter: users.get(r.reporterId) ?? null,
            })),
        );
      },

      async setStatus(id, status) {
        requireRole("admin");
        const reports = readTable("reports");
        const i = reports.findIndex((r) => r.id === id);
        if (i < 0) throw new RepositoryError("신고를 찾을 수 없어요.");
        reports[i] = { ...reports[i], status, handledAt: status === "open" ? undefined : nowISO() };
        writeTable("reports", reports);
        return delay(reports[i]);
      },
    },

    /* ── 인증 요청 ── */
    verifications: {
      async request(kind, opts) {
        const u = requireUser();
        if (kind === "ownership" && u.role !== "host")
          throw new RepositoryError("토지·주택 소유 확인은 마당지기만 할 수 있어요.");
        const reqs = readTable("verifications");
        const pending = reqs.find((r) => r.userId === u.id && r.kind === kind && r.status === "pending");
        if (pending) return delay(pending);
        const req: VerificationRequest = {
          id: newId("vr"),
          userId: u.id,
          kind,
          status: "pending",
          fileName: opts.fileName,
          demoAuto: opts.demoAuto,
          requestedAt: nowISO(),
        };
        const users = readTable("users").map((x) =>
          x.id === u.id
            ? { ...x, ...(kind === "identity" ? { identityStatus: "pending" as const } : { ownershipStatus: "pending" as const }) }
            : x,
        );
        writeTable("verifications", [...reqs, req]);
        writeTable("users", users);
        return delay(req);
      },

      async listMine() {
        const u = requireUser();
        settleDemoVerifications();
        return delay(
          readTable("verifications")
            .filter((r) => r.userId === u.id)
            .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)),
        );
      },

      async list() {
        requireRole("admin");
        settleDemoVerifications();
        const { users } = buildIndexes();
        return delay(
          readTable("verifications")
            .sort(
              (a, b) =>
                (a.status === "pending" ? 0 : 1) - (b.status === "pending" ? 0 : 1) ||
                b.requestedAt.localeCompare(a.requestedAt),
            )
            .map((r) => ({ request: r, user: users.get(r.userId) ?? null })),
        );
      },

      async review(id, approve) {
        requireRole("admin");
        const reqs = readTable("verifications");
        const i = reqs.findIndex((r) => r.id === id);
        if (i < 0) throw new RepositoryError("인증 요청을 찾을 수 없어요.");
        const status = approve ? ("verified" as const) : ("rejected" as const);
        reqs[i] = { ...reqs[i], status, reviewedAt: nowISO() };
        const r = reqs[i];
        const users = readTable("users").map((x) =>
          x.id === r.userId
            ? { ...x, ...(r.kind === "identity" ? { identityStatus: status } : { ownershipStatus: status }) }
            : x,
        );
        writeTable("verifications", reqs);
        writeTable("users", users);
        return delay(r);
      },

      async settleDemo() {
        settleDemoVerifications();
        return delay(undefined, 0);
      },
    },

    subscribe,

    async resetDemoData() {
      resetAll();
      return delay(undefined);
    },
  };
}
