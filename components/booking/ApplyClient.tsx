"use client";

/** 마당 신청: 날짜·인원 선택 → 동의 체크 → 신청 → 대화방으로 이동 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ban, Flame, Trash2 } from "lucide-react";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { validateDates } from "@/lib/domain/booking-rules";
import { formatRange } from "@/lib/domain/dates";
import { isFireAllowed } from "@/lib/domain/space-rules";
import { GUEST_AGREEMENT_DETAILS, GUEST_AGREEMENT_LABEL } from "@/data/legal-notices";
import { getRegion } from "@/data/regions";
import { Calendar } from "@/components/ui/Calendar";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingBlock } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { SpaceImage } from "@/components/space/SpaceImage";
import { SpaceTypeBadge } from "@/components/space/SpaceBadges";
import { NumberStepper, Field } from "@/components/host/register/fields";

export function ApplyClient({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const item = useRepoQuery(() => repo.spaces.get(id), [id], ["spaces"]);
  const taken = useRepoQuery(() => repo.spaces.takenDates(id), [id], ["bookings"]);

  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [vehicles, setVehicles] = useState(1);
  const [note, setNote] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (item.loading || taken.loading) return <div className="mx-auto max-w-xl p-4"><LoadingBlock /></div>;
  if (!item.data || item.data.space.status !== "active") {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <EmptyState emoji="🍂" title="신청할 수 없는 마당이에요">
          <Link href="/search" className="font-semibold text-grass-700">
            다른 마당 찾기
          </Link>
        </EmptyState>
      </div>
    );
  }

  const space = item.data.space;
  const picnic = space.type === "picnic";
  const fireOk = isFireAllowed(space);
  const g = Math.min(guests, space.maxGuests);
  const v = Math.min(vehicles, space.maxVehicles);
  const dateError = validateDates(space, start, picnic ? start : end, taken.data ?? []);

  async function submit() {
    setError(null);
    if (dateError) return setError(dateError);
    if (!agreed) return setError(`'${GUEST_AGREEMENT_LABEL}'에 체크해 주세요.`);
    setBusy(true);
    try {
      const b = await repo.bookings.create({
        spaceId: space.id,
        startDate: start!,
        endDate: picnic ? start! : end!,
        guests: g,
        vehicles: v,
        note,
        agreedFireAndTrash: agreed,
      });
      toast("마당 신청을 보냈어요! 마당지기의 답을 기다려 주세요.");
      router.push(`/messages/${b.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "신청하지 못했어요.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-5 pb-40 md:pb-12">
      <h1 className="text-xl font-extrabold">마당 신청</h1>

      <Link href={`/spaces/${space.id}`} className="flex gap-3 rounded-2xl bg-white p-3 shadow-soft">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-soil-100">
          <SpaceImage src={space.photos[0]} alt={space.title} sizes="80px" />
        </div>
        <div className="min-w-0">
          <SpaceTypeBadge type={space.type} />
          <p className="mt-1 truncate font-bold">{space.title}</p>
          <p className="text-sm text-soil-600">
            {getRegion(space.regionCode).name} {space.neighborhood} · 최대 {space.maxGuests}명
          </p>
        </div>
      </Link>

      <Field
        label={picnic ? "나들이 날짜" : "체크인 → 체크아웃 날짜"}
        hint={picnic ? "하루를 골라 주세요." : "체크인 날짜를 누른 뒤 체크아웃 날짜를 눌러 주세요. (최대 3박)"}
      >
        <Calendar
          mode="range"
          available={space.availableDates}
          taken={taken.data}
          start={start}
          end={picnic ? start : end}
          singleDay={picnic}
          onChange={(s, e) => {
            setStart(s);
            setEnd(e);
          }}
        />
        {start && (
          <p className="text-sm font-semibold text-grass-800">
            선택: {formatRange(start, picnic ? start : (end ?? start))}
            {!picnic && !end && " — 체크아웃 날짜를 눌러 주세요"}
          </p>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="인원">
          <NumberStepper value={g} onChange={setGuests} min={1} max={space.maxGuests} unit="명" />
        </Field>
        <Field label="차량">
          <NumberStepper value={v} onChange={setVehicles} min={0} max={space.maxVehicles} unit="대" />
        </Field>
      </div>

      <Field label="마당지기에게 인사말" hint="누구와 오는지, 도착 시간 등을 알려 주면 승인에 도움이 돼요.">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="안녕하세요! 주말에 가족 셋이 조용히 쉬다 가고 싶어요."
          className="w-full rounded-xl border border-soil-200 bg-white p-3 text-[15px]"
        />
      </Field>

      {/* 불 사용·쓰레기 규칙 동의 */}
      <section className="rounded-2xl border border-soil-200 bg-white p-4">
        <p
          className={
            fireOk
              ? "flex items-center gap-1.5 font-bold text-soil-900"
              : "flex items-center gap-1.5 font-bold text-red-700"
          }
        >
          {fireOk ? <Flame className="size-4" /> : <Ban className="size-4" />}
          {fireOk ? "이 마당은 지정된 곳에서만 불을 쓸 수 있어요" : "이 마당은 불 사용 금지예요"}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-soil-700">
          {GUEST_AGREEMENT_DETAILS.map((d) => (
            <li key={d} className="flex gap-2">
              <span className="text-soil-400">•</span>
              {d}
            </li>
          ))}
          <li className="flex gap-2">
            <Trash2 className="mt-0.5 size-3.5 text-soil-400" /> 이 마당의 규칙: {space.rules.join(" / ")}
          </li>
        </ul>
        <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-grass-300 bg-grass-50 p-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-grass-600"
          />
          <span className="text-sm font-bold">{GUEST_AGREEMENT_LABEL} (필수)</span>
        </label>
      </section>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-soil-200 bg-white/95 px-4 py-3 backdrop-blur md:static md:rounded-2xl md:border">
        <div className="mx-auto max-w-xl">
          <Button className="w-full" size="lg" onClick={submit} disabled={busy || !agreed || !!dateError}>
            {busy ? "보내는 중…" : "무료로 마당 신청하기"}
          </Button>
          {dateError && start && <p className="mt-1 text-center text-xs text-red-600">{dateError}</p>}
        </div>
      </div>
    </div>
  );
}
