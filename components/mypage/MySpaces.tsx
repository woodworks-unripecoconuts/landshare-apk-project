"use client";

import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { getRegion } from "@/data/regions";
import { SpaceImage } from "@/components/space/SpaceImage";
import { FireBadge, HostVerifyBadge, SpaceTypeBadge } from "@/components/space/SpaceBadges";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, ErrorBox, LoadingBlock } from "@/components/ui/EmptyState";

/** 내가 등록한 마당 (마당지기) */
export function MySpaces() {
  const q = useRepoQuery(() => repo.spaces.listMine(), [], ["spaces", "users", "diaries"]);
  if (q.loading) return <LoadingBlock />;
  if (q.error) return <ErrorBox error={q.error} />;
  return (
    <div className="space-y-3">
      <LinkButton href="/host/new" className="w-full">
        <Plus className="size-4" /> 새 마당 등록하기
      </LinkButton>
      {!q.data?.length && <EmptyState emoji="🏡" title="아직 등록한 마당이 없어요" />}
      {q.data?.map(({ space, hostVerified, ratingAvg, ratingCount }) => (
        <div key={space.id} className="flex gap-3 rounded-2xl border border-soil-200/70 bg-white p-3 shadow-soft">
          <Link href={`/spaces/${space.id}`} className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-soil-100">
            <SpaceImage src={space.photos[0]} alt={space.title} sizes="96px" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1">
              <SpaceTypeBadge type={space.type} />
              {space.status === "hidden" ? <Badge tone="red">숨김 처리됨</Badge> : <Badge tone="grass">공개 중</Badge>}
              <HostVerifyBadge verified={hostVerified} />
              <FireBadge space={space} forestOnly />
            </div>
            <p className="mt-1 truncate font-bold">{space.title}</p>
            <p className="text-xs text-soil-600">
              {getRegion(space.regionCode).name} {space.neighborhood} · 신청 가능 {space.availableDates.length}일 ·{" "}
              {ratingAvg != null ? `★ ${ratingAvg.toFixed(1)} (${ratingCount})` : "마당 일기 없음"}
            </p>
            {space.status === "hidden" && <p className="mt-1 text-xs text-red-600">사유: {space.hiddenReason}</p>}
            <div className="mt-2 flex gap-2">
              <LinkButton href={`/spaces/${space.id}`} variant="outline" size="sm">
                <Eye className="size-4" /> 보기
              </LinkButton>
              <LinkButton href={`/host/spaces/${space.id}/edit`} variant="outline" size="sm">
                <Pencil className="size-4" /> 수정
              </LinkButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
