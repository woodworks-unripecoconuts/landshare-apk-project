"use client";

import { Pencil } from "lucide-react";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { Space } from "@/lib/domain/types";
import { NO_FEE_NOTICE } from "@/data/policies";
import { SpaceDetailView } from "./SpaceDetailView";
import { ReportButton } from "./ReportButton";
import { AdSlot } from "@/components/ads/AdSlot";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, ErrorBox } from "@/components/ui/EmptyState";

/** 신청 버튼 (주인이면 수정 버튼) */
function MainAction({ space, isOwner, className }: { space: Space; isOwner: boolean; className?: string }) {
  return isOwner ? (
    <LinkButton href={`/host/spaces/${space.id}/edit`} variant="outline" size="lg" className={className}>
      <Pencil className="size-4" /> 내 마당 수정
    </LinkButton>
  ) : (
    <LinkButton href={`/spaces/${space.id}/apply`} size="lg" className={className}>
      마당 신청하기
    </LinkButton>
  );
}

/** 데스크톱 오른쪽 고정 카드 */
function BookingCard({ space, isOwner }: { space: Space; isOwner: boolean }) {
  const rows = [
    [space.type === "picnic" ? "시작" : "체크인", space.checkInTime],
    [space.type === "picnic" ? "끝" : "체크아웃", space.checkOutTime],
    ["최대 인원", `${space.maxGuests}명`],
    ["차량", `${space.maxVehicles}대`],
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-soil-200/80 bg-white p-6 shadow-lift">
        <p className="text-2xl font-bold">
          무료 <span className="text-base font-normal text-soil-500">· 이용료 0원</span>
        </p>
        <dl className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-soil-200">
          {rows.map(([k, v], i) => (
            <div key={k} className={`p-3 ${i % 2 ? "border-l border-soil-200" : ""} ${i >= 2 ? "border-t border-soil-200" : ""}`}>
              <dt className="text-[11px] font-bold text-ink">{k}</dt>
              <dd className="text-sm text-soil-600">{v}</dd>
            </div>
          ))}
        </dl>
        <MainAction space={space} isOwner={isOwner} className="mt-4 w-full rounded-xl" />
        <p className="mt-3 text-center text-xs text-soil-500">마당지기가 승인하면 정확한 주소가 공개돼요</p>
      </div>
      <p className="px-2 text-xs leading-relaxed text-soil-500">{NO_FEE_NOTICE}</p>
    </div>
  );
}

/**
 * 상세 페이지 — 데이터는 브라우저에서 repository로 불러옵니다.
 * 그래서 방금 등록한 마당(localStorage에만 있는 마당)도 새로고침 후 열립니다.
 */
export function SpaceDetailClient({ id }: { id: string }) {
  const { user } = useAuth();
  const item = useRepoQuery(() => repo.spaces.get(id), [id], ["spaces", "users", "diaries"]);
  const diaries = useRepoQuery(() => repo.diaries.listBySpace(id), [id], ["diaries"]);
  const priv = useRepoQuery(() => repo.spaces.getPrivate(id), [id], ["bookings", "spacePrivates"]);
  const taken = useRepoQuery(() => repo.spaces.takenDates(id), [id], ["bookings"]);

  if (item.loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 md:px-4 md:py-8">
        <div className="mx-4 h-9 w-2/3 animate-pulse rounded-lg bg-soil-100 md:mx-0" />
        <div className="aspect-[4/3] animate-pulse bg-soil-100 md:aspect-auto md:h-[440px] md:rounded-3xl" />
      </div>
    );
  }
  if (item.error) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <ErrorBox error={item.error} />
      </div>
    );
  }
  if (!item.data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <EmptyState emoji="🍂" title="마당을 찾을 수 없어요" description="삭제되었거나 숨김 처리된 마당일 수 있어요.">
          <LinkButton href="/search">다른 마당 찾기</LinkButton>
        </EmptyState>
      </div>
    );
  }

  const { space, host, hostVerified, ratingAvg, ratingCount } = item.data;
  const isOwner = user?.id === space.hostId;

  return (
    <div className="pb-28 lg:pb-0">
      {space.status === "hidden" && (
        <p className="mx-auto mt-4 max-w-6xl rounded-2xl bg-red-50 p-3 text-sm text-red-700 md:px-4">
          관리자가 숨김 처리한 마당이에요. ({space.hiddenReason}) 다른 사람에게는 보이지 않아요.
        </p>
      )}

      <SpaceDetailView
        space={space}
        host={host}
        hostVerified={hostVerified}
        ratingAvg={ratingAvg}
        ratingCount={ratingCount}
        diaries={diaries.data}
        privateInfo={priv.data}
        takenDates={taken.data}
        aside={<BookingCard space={space} isOwner={isOwner} />}
        footer={
          <>
            {!isOwner && <ReportButton spaceId={space.id} />}
            <AdSlot slot="detail-bottom" />
          </>
        }
      />

      {/* 모바일·태블릿 하단 고정 신청 바 */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-soil-200 bg-white/95 px-4 py-3 backdrop-blur md:bottom-0 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="font-bold">
              무료 <span className="text-sm font-normal text-soil-500">· 최대 {space.maxGuests}명</span>
            </p>
            <p className="text-xs text-soil-500">승인되면 정확한 주소가 공개돼요</p>
          </div>
          <MainAction space={space} isOwner={isOwner} className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}
