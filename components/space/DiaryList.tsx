import type { DiaryWithAuthor } from "@/lib/repository";
import { formatDateTime } from "@/lib/domain/dates";
import { StarRating } from "@/components/ui/StarRating";
import { SpaceImage } from "./SpaceImage";

/** 마당 일기(후기) 목록 */
export function DiaryList({ items }: { items: DiaryWithAuthor[] }) {
  if (items.length === 0) {
    return <p className="rounded-2xl bg-white p-4 text-sm text-soil-500">아직 마당 일기가 없어요. 첫 마당손님이 되어 보세요!</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map(({ diary, author }) => (
        <li key={diary.id} className="rounded-2xl border border-soil-200/70 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="relative size-9 overflow-hidden rounded-full bg-soil-100">
              <SpaceImage src={author?.avatarUrl} alt="" sizes="36px" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{author?.name ?? "알 수 없음"}</p>
              <p className="text-xs text-soil-500">{formatDateTime(diary.createdAt)}</p>
            </div>
            <StarRating value={diary.rating} size={14} />
          </div>
          <p className="mt-2 text-[15px] whitespace-pre-line text-soil-800">{diary.text}</p>
          {diary.photos.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {diary.photos.map((p, i) => (
                <div key={i} className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-soil-100">
                  <SpaceImage src={p} alt={`마당 일기 사진 ${i + 1}`} sizes="96px" />
                </div>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
