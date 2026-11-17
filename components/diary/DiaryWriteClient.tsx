"use client";

/** 마당 일기 쓰기: 이용 완료된 내 신청에만, 별점 + 글 + 사진 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatRange } from "@/lib/domain/dates";
import { StarRating } from "@/components/ui/StarRating";
import { PhotoPicker } from "@/components/ui/PhotoPicker";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState, LoadingBlock } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

export function DiaryWriteClient({ bookingId }: { bookingId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const q = useRepoQuery(() => repo.bookings.get(bookingId), [bookingId], ["bookings", "diaries"]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (q.loading) return <div className="mx-auto max-w-xl p-4"><LoadingBlock /></div>;
  const d = q.data;
  const blocked = !d
    ? "신청을 찾을 수 없어요."
    : d.booking.guestId !== user?.id
      ? "내 신청에만 마당 일기를 쓸 수 있어요."
      : d.booking.status !== "completed"
        ? "이용 완료된 신청에만 마당 일기를 쓸 수 있어요."
        : d.hasDiary
          ? "이미 마당 일기를 썼어요."
          : null;
  if (blocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <EmptyState emoji="📔" title={blocked}>
          <LinkButton href="/mypage?tab=diaries">내 마당 일기</LinkButton>
        </EmptyState>
      </div>
    );
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await repo.diaries.create({ bookingId, rating, text, photos });
      toast("마당 일기를 남겼어요. 고마워요! 🌿");
      router.push(`/spaces/${d!.booking.spaceId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장하지 못했어요.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-5 pb-24">
      <div>
        <h1 className="text-xl font-extrabold">마당 일기 쓰기</h1>
        <p className="mt-1 text-sm text-soil-600">
          {d!.space?.title} · {formatRange(d!.booking.startDate, d!.booking.endDate)}
        </p>
      </div>
      <section className="rounded-2xl bg-white p-4 text-center shadow-soft">
        <p className="font-bold">마당은 어땠나요?</p>
        <div className="mt-2 flex justify-center">
          <StarRating value={rating} onChange={setRating} size={32} />
        </div>
      </section>
      <div className="space-y-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          maxLength={1000}
          placeholder="마당의 분위기, 좋았던 점, 다음 마당손님에게 알려 주고 싶은 점을 적어 주세요. (10자 이상)"
          className="w-full rounded-xl border border-soil-200 bg-white p-3 text-[15px]"
        />
        <p className="text-right text-xs text-soil-500">{text.trim().length}자</p>
      </div>
      <div>
        <p className="mb-2 text-sm font-bold">사진 (선택, 최대 3장)</p>
        <PhotoPicker value={photos} onChange={setPhotos} max={3} />
      </div>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Button className="w-full" size="lg" onClick={submit} disabled={busy || text.trim().length < 10}>
        마당 일기 남기기
      </Button>
    </div>
  );
}
