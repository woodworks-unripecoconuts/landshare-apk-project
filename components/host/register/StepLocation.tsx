"use client";

import { Lock, TriangleAlert } from "lucide-react";
import { REGIONS, getRegion, GANGWON_CENTER, GANGWON_ZOOM } from "@/data/regions";
import { LAND_TYPES } from "@/data/amenities";
import type { RegionCode } from "@/lib/domain/types";
import { forcesNearForest, needsFarmlandEmphasis } from "@/lib/domain/space-rules";
import { LocationPicker } from "@/components/map";
import { regionDistanceWarning, type RegisterDraft } from "./draft";
import { ChoiceCard, Field, inputClass } from "./fields";

type Props = { draft: RegisterDraft; set: (patch: Partial<RegisterDraft>) => void };

/** ② 위치: 시·군(강원 18곳만) + 지도에서 위치 찍기 + 토지 종류 + 산림 인접 여부 */
export function StepLocation({ draft, set }: Props) {
  const region = draft.regionCode ? getRegion(draft.regionCode) : null;
  const forestLocked = draft.landType !== "" && forcesNearForest(draft.landType);
  const warn = regionDistanceWarning(draft);

  return (
    <div className="space-y-5">
      <Field label="시·군" hint="현재 강원특별자치도 18개 시·군만 등록할 수 있어요.">
        <select
          className={inputClass}
          value={draft.regionCode}
          onChange={(e) => set({ regionCode: e.target.value as RegionCode | "" })}
        >
          <option value="">시·군을 골라 주세요</option>
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              강원 {r.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="동네 이름" hint="상세 페이지에 공개돼요. 읍·면·동·리까지만 써 주세요.">
        <input
          className={inputClass}
          value={draft.neighborhood}
          onChange={(e) => set({ neighborhood: e.target.value })}
          placeholder="예) 봉평면 무이리"
        />
      </Field>

      <Field label="지도에서 마당 위치 찍기" hint="지도를 누르면 핀이 꽂혀요. 핀을 끌어서 옮길 수도 있어요.">
        <div className="h-72 overflow-hidden rounded-2xl border border-soil-200">
          <LocationPicker
            center={region?.center ?? GANGWON_CENTER}
            zoom={region?.zoom ?? GANGWON_ZOOM}
            value={draft.exactLocation}
            onChange={(v) => set({ exactLocation: v })}
          />
        </div>
        <p className="flex items-center gap-1 text-xs text-soil-600">
          <Lock className="size-3.5" />
          정확한 위치는 공개되지 않아요. 마당손님에게는 약 1km 반경의 동네 원으로만 보여요.
          {draft.exactLocation && ` (찍은 위치: ${draft.exactLocation.lat}, ${draft.exactLocation.lng})`}
        </p>
        {warn && (
          <p className="flex items-center gap-1 text-sm text-sun-600">
            <TriangleAlert className="size-4" /> {warn}
          </p>
        )}
      </Field>

      <Field label="상세 주소 (비공개)" hint="마당 신청이 승인된 마당손님에게만 공개돼요.">
        <input
          className={inputClass}
          value={draft.address}
          onChange={(e) => set({ address: e.target.value })}
          placeholder="예) 강원특별자치도 평창군 봉평면 무이리 123-4"
        />
      </Field>

      <Field label="토지 종류">
        <div role="radiogroup" className="grid grid-cols-2 gap-2">
          {LAND_TYPES.map((l) => (
            <ChoiceCard
              key={l.key}
              selected={draft.landType === l.key}
              onClick={() => set({ landType: l.key, ...(forcesNearForest(l.key) ? { nearForest: true } : {}) })}
              title={l.label}
              description={l.description}
            />
          ))}
        </div>
        {draft.landType !== "" && needsFarmlandEmphasis(draft.landType) && (
          <p className="rounded-xl bg-sun-100 p-3 text-sm text-soil-800">
            🌾 <b>농지·임야</b>는 다른 용도로 쓰려면 허가가 필요할 수 있어요. 자갈 깔기·데크 설치처럼 땅 모양을 바꾸지 말고
            그대로 써 주세요. (6단계 법령 확인에서 다시 안내해요)
          </p>
        )}
      </Field>

      <Field label="산림에서 100m 이내인가요?" hint="산이나 숲 가장자리에서 100m 안이면 '예'를 골라 주세요.">
        <div role="radiogroup" className="grid grid-cols-2 gap-2">
          <ChoiceCard
            selected={draft.nearForest === true}
            onClick={() => set({ nearForest: true })}
            title="예"
            description="불 사용이 금지돼요"
          />
          <ChoiceCard
            selected={draft.nearForest === false}
            onClick={() => set({ nearForest: false })}
            title="아니요"
            description="산림에서 100m 넘게 떨어져 있어요"
            disabled={forestLocked}
          />
        </div>
        {forestLocked && <p className="text-sm text-red-700">임야(산림)는 산림에 해당해 자동으로 &lsquo;예&rsquo;로 정해져요.</p>}
        {draft.nearForest === true && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            🔥 산림이나 산림에서 100m 이내 땅에서는 허가 없이 불을 피우면 최대 200만원 과태료가 부과될 수 있어요. 이
            마당은 &lsquo;불 사용 가능&rsquo;을 고를 수 없고, 상세 페이지에 &lsquo;불 사용 금지&rsquo;가 표시돼요.
          </p>
        )}
      </Field>
    </div>
  );
}
