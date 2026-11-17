"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SpaceDetailView } from "./SpaceDetailView";
import { ReportButton } from "./ReportButton";
import { AdSlot } from "@/components/ads/AdSlot";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, ErrorBox } from "@/components/ui/EmptyState";

/**
 * 상세 페이지 — 데이터는 브라우저에서 repository로 불러옵니다.
 * 그래서 방금 등록한 마당(localStorage에만 있는 마당)도 새로고침 후 열립니다.
 */
export function SpaceDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const item = useRepoQuery(() => repo.spaces.get(id), [id], ["spaces", "users", "diaries"]);
  const diaries = useRepoQuery(() => repo.diaries.listBySpace(id), [id], ["diaries"]);
  const priv = useRepoQuery(() => repo.spaces.getPrivate(id), [id], ["bookings", "spacePrivates"]);
  const taken = useRepoQuery(() => repo.spaces.takenDates(id), [id], ["bookings"]);

  if (item.loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 md:px-4 md:py-6">
        <div className="aspect-[4/3] animate-pulse bg-soil-100 md:aspect-[16/9] md:rounded-3xl" />
        <div className="mx-4 h-8 w-2/3 animate-pulse rounded bg-soil-100 md:mx-0" />
      </div>
    );
  }
  if (item.error) return <div className="mx-auto max-w-4xl p-4"><ErrorBox error={item.error} /></div>;
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
    <div className="mx-auto max-w-4xl pb-28 md:px-4 md:py-6 md:pb-10">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-3 hidden items-center gap-1 text-sm font-semibold text-soil-600 md:flex"
      >
        <ArrowLeft className="size-4" /> 뒤로
      </button>

      {space.status === "hidden" && (
        <p className="mx-4 mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700 md:mx-0">
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
      />

      <div className="space-y-6 px-4 pt-6 md:px-0">
        {!isOwner && <ReportButton spaceId={space.id} />}
        <AdSlot slot="detail-bottom" />
      </div>

      {/* 하단 고정 신청 버튼 */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-soil-200 bg-white/95 px-4 py-3 backdrop-blur md:static md:mt-6 md:rounded-2xl md:border md:bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <div>
            <p className="font-extrabold text-grass-800">무료 · 이용료 0원</p>
            <p className="text-xs text-soil-500">마당지기가 승인하면 정확한 주소가 공개돼요</p>
          </div>
          {isOwner ? (
            <LinkButton href={`/host/spaces/${space.id}/edit`} variant="outline">
              <Pencil className="size-4" /> 내 마당 수정
            </LinkButton>
          ) : (
            <LinkButton href={`/spaces/${space.id}/apply`} size="lg" aria-disabled={space.status === "hidden"}>
              마당 신청하기
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
}
