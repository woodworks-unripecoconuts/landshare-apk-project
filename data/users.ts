import type { User } from "@/lib/domain/types";
import { relDateTime } from "@/lib/domain/dates";

/**
 * 가짜 사용자 목록. 이름은 모두 지어낸 별명입니다.
 *
 * 가짜 로그인 버튼으로 전환되는 데모 계정 3개:
 *  - DEMO_GUEST_ID  : 마당손님으로 보기
 *  - DEMO_HOST_ID   : 마당지기로 보기
 *  - DEMO_ADMIN_ID  : 관리자로 보기
 */
export const DEMO_GUEST_ID = "u-guest-demo";
export const DEMO_HOST_ID = "u-host-demo";
export const DEMO_ADMIN_ID = "u-admin";

const avatar = (seed: string) => `https://picsum.photos/seed/madang-avatar-${seed}/160/160`;

export const seedUsers: User[] = [
  // ── 데모 계정 ──
  {
    id: DEMO_GUEST_ID,
    name: "김하늘",
    role: "guest",
    avatarUrl: avatar("guest"),
    intro: "주말마다 강원도로 떠나는 초보 캠퍼예요.",
    hometown: "서울",
    joinedAt: relDateTime(-120),
    identityStatus: "none",
    ownershipStatus: "none",
  },
  {
    id: DEMO_HOST_ID,
    name: "박산들",
    role: "host",
    avatarUrl: avatar("host"),
    intro: "춘천·평창·양양에 남는 마당이 있어 함께 나누고 싶어요.",
    hometown: "춘천시",
    joinedAt: relDateTime(-200),
    identityStatus: "none",
    ownershipStatus: "none",
  },
  {
    id: DEMO_ADMIN_ID,
    name: "마당공유 운영자",
    role: "admin",
    joinedAt: relDateTime(-365),
    identityStatus: "verified",
    ownershipStatus: "none",
  },

  // ── 다른 마당지기 ──
  { id: "u-host-1", name: "김솔바람", role: "host", avatarUrl: avatar("h1"), intro: "홍천·춘천에서 농사짓고 있어요.", hometown: "홍천군", joinedAt: relDateTime(-300), identityStatus: "verified", ownershipStatus: "verified" },
  { id: "u-host-2", name: "이들꽃", role: "host", avatarUrl: avatar("h2"), intro: "원주 시골집 마당을 가꾸는 게 취미예요.", hometown: "원주시", joinedAt: relDateTime(-280), identityStatus: "verified", ownershipStatus: "verified" },
  { id: "u-host-3", name: "최바다", role: "host", avatarUrl: avatar("h3"), intro: "동해 바다가 보이는 마당이 자랑이에요.", hometown: "강릉시", joinedAt: relDateTime(-250), identityStatus: "verified", ownershipStatus: "verified" },
  { id: "u-host-4", name: "정숲길", role: "host", avatarUrl: avatar("h4"), intro: "산 아래 조용한 집에 살아요.", hometown: "정선군", joinedAt: relDateTime(-90), identityStatus: "verified", ownershipStatus: "pending" },
  { id: "u-host-5", name: "한햇살", role: "host", avatarUrl: avatar("h5"), intro: "태백·삼척을 오가며 지내요.", hometown: "삼척시", joinedAt: relDateTime(-220), identityStatus: "verified", ownershipStatus: "verified" },
  { id: "u-host-6", name: "윤마루", role: "host", avatarUrl: avatar("h6"), intro: "막 시작한 새내기 마당지기예요.", hometown: "속초시", joinedAt: relDateTime(-30), identityStatus: "pending", ownershipStatus: "none" },
  { id: "u-host-7", name: "서느티", role: "host", avatarUrl: avatar("h7"), intro: "철원 들판 옆 작은 집에 살아요.", hometown: "철원군", joinedAt: relDateTime(-160), identityStatus: "verified", ownershipStatus: "verified" },

  // ── 다른 마당손님 (후기·신청 예시용) ──
  { id: "u-guest-2", name: "이별빛", role: "guest", avatarUrl: avatar("g2"), intro: "별 보러 다니는 차박러", joinedAt: relDateTime(-100), identityStatus: "verified", ownershipStatus: "none" },
  { id: "u-guest-3", name: "조캠퍼", role: "guest", avatarUrl: avatar("g3"), intro: "아이 둘과 함께 캠핑해요", joinedAt: relDateTime(-80), identityStatus: "verified", ownershipStatus: "none" },
];
