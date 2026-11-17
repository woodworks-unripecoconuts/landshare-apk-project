"use client";

import { Scale, Check } from "lucide-react";
import { LEGAL_HEADER, LEGAL_NOTICES } from "@/data/legal-notices";
import { landTypeLabel } from "@/data/amenities";
import { NO_FEE_NOTICE } from "@/data/policies";
import { needsFarmlandEmphasis } from "@/lib/domain/space-rules";
import { effectiveNearForest, type RegisterDraft } from "./draft";
import { cn } from "@/lib/utils/cn";

type Props = { draft: RegisterDraft; set: (patch: Partial<RegisterDraft>) => void };

/** ⑥ 법령 확인 — 항목마다 체크해야 다음으로 갈 수 있어요. (문구: data/legal-notices.ts) */
export function StepLegal({ draft, set }: Props) {
  const nearForest = effectiveNearForest(draft);
  const farmEmphasis = draft.landType !== "" && needsFarmlandEmphasis(draft.landType);
  const checkedCount = LEGAL_NOTICES.filter((n) => draft.legalChecks[n.id]).length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-soil-800 p-4 text-soil-50">
        <p className="flex items-center gap-1.5 font-bold">
          <Scale className="size-4" /> 등록 전에 꼭 확인해 주세요
        </p>
        <p className="mt-1 text-xs text-soil-200">{LEGAL_HEADER}</p>
        <p className="mt-2 text-sm font-semibold text-sun-200">{NO_FEE_NOTICE}</p>
      </div>

      <p className="text-sm font-semibold text-soil-700">
        확인한 항목 {checkedCount} / {LEGAL_NOTICES.length}
      </p>

      {LEGAL_NOTICES.map((n, i) => {
        const checked = !!draft.legalChecks[n.id];
        const emphasize = n.id === "farmland" && farmEmphasis;
        return (
          <section
            key={n.id}
            className={cn(
              "rounded-2xl border bg-white p-4",
              emphasize ? "border-sun-500 ring-2 ring-sun-200" : checked ? "border-grass-300" : "border-soil-200",
            )}
          >
            {emphasize && (
              <p className="mb-2 inline-block rounded-full bg-sun-500 px-2.5 py-0.5 text-xs font-bold text-soil-900">
                내 토지 종류: {landTypeLabel(draft.landType as "farmland")} — 꼭 확인!
              </p>
            )}
            <p className="text-xs font-semibold text-soil-500">
              {i + 1}. {n.lawName}
            </p>
            <h3 className="mt-0.5 font-bold">{n.title}</h3>
            <ul className="mt-2 space-y-1">
              {n.details.map((d, j) => (
                <li key={j} className="flex gap-2 text-sm text-soil-700">
                  <span className="text-soil-400">•</span>
                  {d}
                </li>
              ))}
            </ul>
            {n.id === "forest_fire" && (
              <p
                className={cn(
                  "mt-2 rounded-xl p-2.5 text-sm font-semibold",
                  nearForest ? "bg-red-50 text-red-700" : "bg-grass-50 text-grass-800",
                )}
              >
                내 답: 산림 100m 이내 — {nearForest ? "예 → '불 사용 가능'이 꺼지고 '불 사용 금지'로 표시돼요." : "아니요"}
              </p>
            )}
            <label
              className={cn(
                "mt-3 flex cursor-pointer items-start gap-3 rounded-xl border p-3",
                checked ? "border-grass-600 bg-grass-50" : "border-soil-200 bg-soil-50",
              )}
            >
              <input
                type="checkbox"
                className="mt-0.5 size-5 shrink-0 accent-grass-600"
                checked={checked}
                onChange={(e) => set({ legalChecks: { ...draft.legalChecks, [n.id]: e.target.checked } })}
              />
              <span className="text-sm font-semibold text-soil-900">{n.checkLabel}</span>
              {checked && <Check className="ml-auto size-5 shrink-0 text-grass-600" />}
            </label>
          </section>
        );
      })}
    </div>
  );
}
