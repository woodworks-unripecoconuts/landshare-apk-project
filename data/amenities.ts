import type { AmenityKey, LandType } from "@/lib/domain/types";

/** 편의시설 7가지 */
export const AMENITIES: { key: AmenityKey; label: string; description: string }[] = [
  { key: "toilet", label: "화장실", description: "손님이 쓸 수 있는 화장실" },
  { key: "water", label: "수도", description: "개수대·수돗물 사용 가능" },
  { key: "electricity", label: "전기", description: "콘센트 사용 가능" },
  { key: "parking", label: "주차", description: "마당 안 또는 바로 옆 주차" },
  { key: "fire", label: "불 사용 가능", description: "화로대 등 지정된 곳에서만" },
  { key: "pets", label: "반려동물", description: "반려동물과 함께 와도 돼요" },
  { key: "shade", label: "그늘", description: "나무·차양 그늘이 있어요" },
];

export function amenityLabel(k: AmenityKey): string {
  return AMENITIES.find((a) => a.key === k)?.label ?? k;
}

/** 토지 종류 */
export const LAND_TYPES: { key: LandType; label: string; description: string }[] = [
  { key: "house_yard", label: "주택 마당", description: "집에 딸린 마당·잔디밭" },
  { key: "farmland", label: "농지", description: "지목이 전·답·과수원인 땅" },
  { key: "forest", label: "임야", description: "지목이 임야인 땅(산림)" },
  { key: "other", label: "기타", description: "공터·대지 등 그 밖의 땅" },
];

export function landTypeLabel(k: LandType): string {
  return LAND_TYPES.find((a) => a.key === k)?.label ?? k;
}
