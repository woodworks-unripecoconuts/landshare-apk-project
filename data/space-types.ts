import type { SpaceType } from "@/lib/domain/types";

/** 공간 유형 3가지 */
export const SPACE_TYPES: { key: SpaceType; label: string; short: string; description: string; emoji: string }[] = [
  { key: "camping", label: "마당캠핑", short: "캠핑", description: "텐트를 치고 하룻밤 머물러요", emoji: "⛺" },
  { key: "carcamp", label: "마당차박", short: "차박", description: "차에서 자며 조용히 쉬어요", emoji: "🚙" },
  { key: "picnic", label: "마당나들이", short: "나들이", description: "자고 가지 않는 낮 나들이", emoji: "🧺" },
];

export function spaceTypeLabel(t: SpaceType): string {
  return SPACE_TYPES.find((s) => s.key === t)?.label ?? t;
}
