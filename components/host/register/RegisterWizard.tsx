"use client";

/**
 * 마당 등록(또는 수정) 7단계 마법사.
 *  ① 기본 정보 ② 위치 ③ 사진 ④ 편의시설 ⑤ 규칙·날짜 ⑥ 법령 확인 ⑦ 미리보기 후 등록
 *
 * 새로 등록할 때는 작성 중인 내용을 이 기기에 임시 저장해서, 새로고침해도 이어서 쓸 수 있어요.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { repo } from "@/lib/repository";
import { readJSON, removeKey, writeJSON } from "@/lib/storage/local-store";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";
import { draftToInput, emptyDraft, STEP_TITLES, stepProblems, type RegisterDraft } from "./draft";
import { StepBasic } from "./StepBasic";
import { StepLocation } from "./StepLocation";
import { StepPhotos } from "./StepPhotos";
import { StepAmenities } from "./StepAmenities";
import { StepRules } from "./StepRules";
import { StepLegal } from "./StepLegal";
import { StepPreview } from "./StepPreview";

const DRAFT_KEY = "draft:new-space";

type Props = { mode: "new" } | { mode: "edit"; spaceId: string; initial: RegisterDraft };

export function RegisterWizard(props: Props) {
  const router = useRouter();
  const toast = useToast();
  const [draft, setDraft] = useState<RegisterDraft>(() =>
    props.mode === "edit" ? props.initial : { ...emptyDraft(), ...readJSON<Partial<RegisterDraft>>(DRAFT_KEY, {}) },
  );
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 새 등록: 작성 중인 내용 임시 저장 (사진이 커서 저장 공간이 부족하면 조용히 건너뜀)
  useEffect(() => {
    if (props.mode !== "new") return;
    try {
      writeJSON(DRAFT_KEY, draft);
    } catch {
      /* 임시 저장 실패는 무시 */
    }
  }, [draft, props.mode]);

  const set = (patch: Partial<RegisterDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const problems = stepProblems(step, draft);
  const last = STEP_TITLES.length - 1;

  const go = (next: number) => {
    setStep(next);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function submit() {
    // 모든 단계를 다시 한 번 검사
    for (let i = 0; i < last; i++) {
      if (stepProblems(i, draft).length) {
        go(i);
        return;
      }
    }
    setBusy(true);
    setSubmitError(null);
    try {
      const input = draftToInput(draft);
      if (props.mode === "new") {
        const space = await repo.spaces.create(input);
        removeKey(DRAFT_KEY);
        toast("마당을 등록했어요! 🎉");
        router.push(`/spaces/${space.id}`);
      } else {
        await repo.spaces.update(props.spaceId, input);
        toast("마당 정보를 고쳤어요");
        router.push(`/spaces/${props.spaceId}`);
      }
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "저장하지 못했어요.");
      setBusy(false);
    }
  }

  function resetDraft() {
    if (!confirm("작성 중인 내용을 모두 지울까요?")) return;
    removeKey(DRAFT_KEY);
    setDraft(emptyDraft());
    go(0);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 pb-40 md:pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold">{props.mode === "new" ? "마당 등록" : "마당 수정"}</h1>
        {props.mode === "new" && (
          <button type="button" onClick={resetDraft} className="text-sm text-soil-500 underline">
            처음부터 다시
          </button>
        )}
      </div>

      {/* 단계 표시 */}
      <ol className="mt-4 grid grid-cols-7 gap-1" aria-label="진행 단계">
        {STEP_TITLES.map((t, i) => (
          <li key={t}>
            <button
              type="button"
              disabled={i > step}
              onClick={() => go(i)}
              className="flex w-full flex-col items-center gap-1 disabled:cursor-default"
              aria-current={i === step ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-bold",
                  i < step && "bg-grass-600 text-white",
                  i === step && "bg-grass-700 text-white ring-4 ring-grass-200",
                  i > step && "bg-soil-100 text-soil-400",
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={cn("hidden text-[11px] sm:block", i === step ? "font-bold text-grass-800" : "text-soil-500")}>
                {t}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <h2 className="mt-5 mb-4 text-lg font-bold">
        {step + 1}단계 · {STEP_TITLES[step]}
      </h2>

      {step === 0 && <StepBasic draft={draft} set={set} />}
      {step === 1 && <StepLocation draft={draft} set={set} />}
      {step === 2 && <StepPhotos draft={draft} set={set} />}
      {step === 3 && <StepAmenities draft={draft} set={set} />}
      {step === 4 && <StepRules draft={draft} set={set} />}
      {step === 5 && <StepLegal draft={draft} set={set} />}
      {step === 6 && <StepPreview draft={draft} />}

      {submitError && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      {/* 아래 고정 버튼 */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-soil-200 bg-white/95 px-4 py-3 backdrop-blur md:static md:mt-8 md:rounded-2xl md:border">
        <div className="mx-auto max-w-2xl">
          {problems.length > 0 && (
            <p className="mb-2 text-xs text-soil-600">
              남은 할 일: {problems[0]}
              {problems.length > 1 && ` 외 ${problems.length - 1}개`}
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => go(step - 1)} disabled={step === 0} className="flex-1">
              <ArrowLeft className="size-4" /> 이전
            </Button>
            {step < last ? (
              <Button onClick={() => go(step + 1)} disabled={problems.length > 0} className="flex-[2]">
                다음 <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={busy} className="flex-[2]">
                {busy ? "저장 중…" : props.mode === "new" ? "이대로 등록하기" : "수정 내용 저장"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
