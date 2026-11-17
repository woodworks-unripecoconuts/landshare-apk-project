/**
 * 공간(마당)에 관한 규칙 — 화면과 저장소가 같은 규칙을 쓰도록 한 곳에 모았습니다.
 * (React/Next 의존 없음 → 앱에서도 재사용)
 */
import type { AmenityKey, LandType, LatLng, Space, User } from "./types";

/** 임야(산림)를 고르면 '산림 100m 이내'는 자동으로 '예' */
export function forcesNearForest(landType: LandType): boolean {
  return landType === "forest";
}

/** 농지·임야면 농지법 안내를 강조 */
export function needsFarmlandEmphasis(landType: LandType): boolean {
  return landType === "farmland" || landType === "forest";
}

/** 산림 인접이면 '불 사용 가능'을 뺀 편의시설 목록 */
export function sanitizeAmenities(amenities: AmenityKey[], nearForest: boolean): AmenityKey[] {
  const unique = Array.from(new Set(amenities));
  return nearForest ? unique.filter((a) => a !== "fire") : unique;
}

/** 이 마당에서 불을 써도 되는지 */
export function isFireAllowed(space: Pick<Space, "amenities" | "nearForest">): boolean {
  return !space.nearForest && space.amenities.includes("fire");
}

/** 본인 인증 + 소유 확인이 모두 끝난 마당지기인지 */
export function isHostVerified(user: Pick<User, "identityStatus" | "ownershipStatus"> | null | undefined): boolean {
  return !!user && user.identityStatus === "verified" && user.ownershipStatus === "verified";
}

/** 동네 단위 원의 기본 반지름(m) */
export const APPROX_RADIUS_M = 1000;

/**
 * 정확한 위치에서 300~700m 떨어진 '대략적 위치'를 만듭니다.
 * seed 문자열이 같으면 항상 같은 결과(시드 데이터가 매번 바뀌지 않게).
 */
export function makeApproxCenter(exact: LatLng, seed: string): LatLng {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const angle = ((h % 360) * Math.PI) / 180;
  const dist = 300 + (h % 400); // m
  const dLat = (dist * Math.cos(angle)) / 111_000;
  const dLng = (dist * Math.sin(angle)) / (111_000 * Math.cos((exact.lat * Math.PI) / 180));
  return { lat: +(exact.lat + dLat).toFixed(5), lng: +(exact.lng + dLng).toFixed(5) };
}

/** 등록 화면에서 골라 쓸 수 있는 이용 규칙 예시 */
export const RULE_SUGGESTIONS = [
  "쓰레기는 음식물까지 모두 되가져가 주세요",
  "밤 10시 이후에는 조용히 해 주세요",
  "불은 지정된 화로대에서만 사용해 주세요",
  "마당 밖 밭·작물에는 들어가지 말아 주세요",
  "반려동물 배변은 꼭 치워 주세요",
  "차는 안내한 자리에만 세워 주세요",
  "흡연은 마당 밖 지정된 곳에서만 해 주세요",
];
