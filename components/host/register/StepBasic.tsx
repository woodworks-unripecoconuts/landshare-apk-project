"use client";

import { SPACE_TYPES } from "@/data/space-types";
import { NO_FEE_NOTICE } from "@/data/policies";
import type { RegisterDraft } from "./draft";
import { ChoiceCard, Field, inputClass, NumberStepper } from "./fields";

type Props = { draft: RegisterDraft; set: (patch: Partial<RegisterDraft>) => void };

/** ① 기본 정보: 제목, 설명, 유형, 수용 인원·차량 대수 (가격 입력란은 없음) */
export function StepBasic({ draft, set }: Props) {
  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-sun-100 px-3 py-2 text-sm font-semibold text-soil-800">
        💛 마당공유의 모든 마당은 무료예요. {NO_FEE_NOTICE}
      </p>

      <Field label="마당 유형">
        <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
          {SPACE_TYPES.map((t) => (
            <ChoiceCard
              key={t.key}
              selected={draft.type === t.key}
              onClick={() =>
                set({
                  type: t.key,
                  ...(t.key === "picnic"
                    ? { checkInTime: "10:00", checkOutTime: "18:00" }
                    : t.key === "carcamp"
                      ? { checkInTime: "17:00", checkOutTime: "10:00" }
                      : { checkInTime: "14:00", checkOutTime: "11:00" }),
                })
              }
              title={t.label}
              description={t.description}
              emoji={t.emoji}
            />
          ))}
        </div>
      </Field>

      <Field label="제목" hint={`${draft.title.trim().length}/40자 · 예) 봉평 메밀꽃 마을 주택 마당`}>
        <input
          className={inputClass}
          value={draft.title}
          maxLength={40}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="마당을 한 줄로 소개해 주세요"
        />
      </Field>

      <Field label="마당 소개" hint={`${draft.description.trim().length}자 (20자 이상) · 분위기, 주변 풍경, 화장실·수도 위치 등을 알려 주세요`}>
        <textarea
          className={`${inputClass} h-36 py-3`}
          value={draft.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="예) 텐트 한 동 칠 수 있는 잔디 마당이에요. 저녁엔 노을이 예뻐요."
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="수용 인원">
          <NumberStepper value={draft.maxGuests} onChange={(v) => set({ maxGuests: v })} min={1} max={20} unit="명" />
        </Field>
        <Field label="주차 가능 차량">
          <NumberStepper value={draft.maxVehicles} onChange={(v) => set({ maxVehicles: v })} min={0} max={10} unit="대" />
        </Field>
      </div>
    </div>
  );
}
