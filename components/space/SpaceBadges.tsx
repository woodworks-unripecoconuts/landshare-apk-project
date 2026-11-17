import { BadgeCheck, CircleAlert, Ban } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { spaceTypeLabel, SPACE_TYPES } from "@/data/space-types";
import type { Space } from "@/lib/domain/types";
import { isFireAllowed } from "@/lib/domain/space-rules";

/** 마당지기 인증 배지: 인증(데모) / 미인증 */
export function HostVerifyBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge tone="grass">
      <BadgeCheck className="size-3.5" /> 인증 마당지기
    </Badge>
  ) : (
    <Badge tone="gray">
      <CircleAlert className="size-3.5" /> 미인증
    </Badge>
  );
}

export function SpaceTypeBadge({ type }: { type: Space["type"] }) {
  const t = SPACE_TYPES.find((s) => s.key === type);
  return (
    <Badge tone="sun">
      <span aria-hidden="true">{t?.emoji}</span> {spaceTypeLabel(type)}
    </Badge>
  );
}

/**
 * 불 사용 금지 표시 (산림 인접이거나 마당지기가 불 사용을 허용하지 않은 곳)
 * forestOnly: 목록 카드에서는 법적 이유(산림 100m 이내)가 있는 곳만 표시
 */
export function FireBadge({
  space,
  forestOnly,
}: {
  space: Pick<Space, "amenities" | "nearForest">;
  forestOnly?: boolean;
}) {
  if (isFireAllowed(space)) return null;
  if (forestOnly && !space.nearForest) return null;
  return (
    <Badge tone="red">
      <Ban className="size-3.5" /> 불 사용 금지
    </Badge>
  );
}

export function FreeBadge() {
  return <Badge tone="grass">무료</Badge>;
}
