"use client";

import type { Space } from "@/lib/domain/types";
import { useAuth } from "@/lib/auth/AuthProvider";
import { APPROX_RADIUS_M, isHostVerified, makeApproxCenter } from "@/lib/domain/space-rules";
import { NO_FEE_NOTICE } from "@/data/policies";
import { SpaceDetailView } from "@/components/space/SpaceDetailView";
import { draftToInput, type RegisterDraft } from "./draft";

/** ⑦ 미리보기: 마당손님에게 보일 상세 화면 그대로 */
export function StepPreview({ draft }: { draft: RegisterDraft }) {
  const { user } = useAuth();
  const input = draftToInput(draft);
  const space: Space = {
    ...input,
    id: "preview",
    hostId: user?.id ?? "",
    approxCenter: makeApproxCenter(input.exactLocation, "preview"),
    approxRadiusM: APPROX_RADIUS_M,
    status: "active",
    createdAt: "",
    updatedAt: "",
  };
  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-grass-50 p-3 text-sm text-grass-900">
        👀 마당손님에게 이렇게 보여요. 정확한 주소는 숨겨지고 동네 단위 원으로만 표시돼요. 고칠 곳이 있으면 &lsquo;이전&rsquo;을
        눌러 돌아가세요.
      </p>
      <div className="overflow-hidden rounded-3xl border border-soil-200 bg-white pb-6">
        <SpaceDetailView space={space} host={user} hostVerified={isHostVerified(user)} ratingAvg={null} ratingCount={0} preview />
      </div>
      <p className="rounded-xl bg-sun-100 p-3 text-sm font-semibold text-soil-800">{NO_FEE_NOTICE}</p>
    </div>
  );
}
