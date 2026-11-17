import { BadgeCheck, Hourglass, CircleAlert } from "lucide-react";
import type { User, VerificationStatus } from "@/lib/domain/types";
import { VERIFICATION_STATUS_LABEL } from "@/lib/domain/labels";
import { SpaceImage } from "./SpaceImage";
import { HostVerifyBadge } from "./SpaceBadges";

function StatusRow({ label, status }: { label: string; status: VerificationStatus }) {
  const Icon = status === "verified" ? BadgeCheck : status === "pending" ? Hourglass : CircleAlert;
  return (
    <li className="flex items-center gap-1.5 text-sm">
      <Icon className={status === "verified" ? "size-4 text-grass-600" : "size-4 text-soil-400"} />
      <span className="text-soil-700">{label}</span>
      <span className={status === "verified" ? "font-semibold text-grass-700" : "text-soil-500"}>
        {VERIFICATION_STATUS_LABEL[status]}
      </span>
    </li>
  );
}

/** 마당지기 프로필 + 인증 배지 */
export function HostProfile({ host, verified }: { host: User | null; verified: boolean }) {
  if (!host) return null;
  return (
    <div className="flex gap-4 rounded-2xl border border-soil-200/70 bg-white p-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-soil-100">
        <SpaceImage src={host.avatarUrl} alt={`${host.name} 프로필`} sizes="64px" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold">마당지기 {host.name}</p>
          <HostVerifyBadge verified={verified} />
        </div>
        {host.intro && <p className="mt-1 text-sm text-soil-700">{host.intro}</p>}
        <ul className="mt-2 space-y-1">
          <StatusRow label="본인 인증" status={host.identityStatus} />
          <StatusRow label="토지·주택 소유 확인" status={host.ownershipStatus} />
        </ul>
        <p className="mt-2 text-xs text-soil-400">
          인증은 데모 표시예요. 실제 서비스에서는 본인인증(PASS 등)과 등기부등본 확인으로 바뀝니다.
        </p>
      </div>
    </div>
  );
}
