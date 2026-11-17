"use client";

import { PhotoPicker } from "@/components/ui/PhotoPicker";
import type { RegisterDraft } from "./draft";

type Props = { draft: RegisterDraft; set: (patch: Partial<RegisterDraft>) => void };

/** ③ 사진: 미리보기만 (실제 서버 업로드 없음) */
export function StepPhotos({ draft, set }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-soil-700">
        마당 전체, 텐트·차 세울 자리, 화장실·수도 위치가 보이는 사진이 좋아요. 첫 번째 사진이 대표 사진이 돼요.
      </p>
      <PhotoPicker value={draft.photos} onChange={(photos) => set({ photos })} max={5} />
      <p className="rounded-xl bg-soil-50 p-3 text-xs text-soil-600">
        프로토타입이라 사진은 서버에 올라가지 않아요. 브라우저 안에서 작게 줄여 이 기기에만 저장돼요. 사진이 없으면 기본
        그림이 보여요.
      </p>
    </div>
  );
}
