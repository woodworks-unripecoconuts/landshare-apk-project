"use client";

import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { useAuth } from "@/lib/auth/AuthProvider";
import { EmptyState, LoadingBlock } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { RegisterWizard } from "./RegisterWizard";
import { draftFromSpace } from "./draft";

/** 내 마당 수정: 저장된 내용을 불러와 같은 7단계 폼으로 고칩니다. */
export function EditSpaceClient({ id }: { id: string }) {
  const { user } = useAuth();
  const q = useRepoQuery(
    async () => {
      const item = await repo.spaces.get(id);
      const priv = item ? await repo.spaces.getPrivate(id) : null;
      return item ? { item, priv } : null;
    },
    [id],
    [],
  );

  if (q.loading) return <div className="mx-auto max-w-2xl p-4"><LoadingBlock /></div>;
  if (!q.data || q.data.item.space.hostId !== user?.id) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <EmptyState emoji="🔒" title="고칠 수 없는 마당이에요" description="내가 등록한 마당만 고칠 수 있어요.">
          <LinkButton href="/mypage?tab=spaces">내가 등록한 마당 보기</LinkButton>
        </EmptyState>
      </div>
    );
  }
  return <RegisterWizard mode="edit" spaceId={id} initial={draftFromSpace(q.data.item.space, q.data.priv)} />;
}
