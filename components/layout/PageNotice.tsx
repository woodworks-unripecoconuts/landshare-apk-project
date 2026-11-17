import { PROTOTYPE_NOTICE, REGION_NOTICE } from "@/data/policies";

/** 모든 페이지 아래(푸터 바로 위)의 얇은 안내 띠: 프로토타입 표시 + 강원 한정 안내 */
export function PageNotice() {
  return (
    <div className="mt-20 bg-grass-900 text-[11px] text-grass-100 sm:text-xs">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-center">
        <span className="rounded-full bg-sun-500 px-2 py-0.5 font-bold text-white">{PROTOTYPE_NOTICE}</span>
        <span aria-hidden="true">·</span>
        <span>📍 {REGION_NOTICE}</span>
      </div>
    </div>
  );
}
