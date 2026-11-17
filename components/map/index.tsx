"use client";

/**
 * 지도 컴포넌트 모음 — Leaflet은 브라우저에서만 동작하므로 ssr: false 로 불러옵니다.
 * 화면에서는 여기서 export 한 것만 사용하세요.
 */
import dynamic from "next/dynamic";

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-grass-50 text-sm text-soil-500">
      지도를 불러오는 중…
    </div>
  );
}

export const SearchMap = dynamic(() => import("./SearchMapInner"), { ssr: false, loading: MapLoading });
export const ApproxLocationMap = dynamic(() => import("./ApproxLocationMapInner"), {
  ssr: false,
  loading: MapLoading,
});
export const LocationPicker = dynamic(() => import("./LocationPickerInner"), { ssr: false, loading: MapLoading });
