/**
 * 광고 설정 — 마당공유의 유일한 수익원은 광고입니다. (이용은 완전 무료)
 *
 * 지금은 provider가 "placeholder"라서 점선 상자("광고 자리")만 보입니다.
 *
 * ▶ 구글 애드센스로 바꾸려면
 *   1) provider: "adsense", adsense.client 에 "ca-pub-XXXXXXXX" 입력
 *   2) 각 slot 의 adsenseSlot 에 애드센스에서 만든 광고 단위 번호 입력
 *   3) components/ads/AdSlot.tsx 의 "adsense" 부분 주석을 참고해 스크립트를 켭니다.
 *
 * ▶ 카카오 애드핏으로 바꾸려면
 *   1) provider: "adfit"
 *   2) 각 slot 의 adfitUnit 에 애드핏 광고 단위 ID("DAN-xxxx") 입력
 */
export type AdProvider = "placeholder" | "adsense" | "adfit";

export type AdSlotKey = "home-mid" | "search-list" | "detail-bottom";

export interface AdSlotConfig {
  /** 화면에 보이는 설명 (placeholder일 때) */
  label: string;
  /** 권장 크기 */
  width: number;
  height: number;
  adsenseSlot?: string;
  adfitUnit?: string;
}

export const AD_CONFIG: {
  provider: AdProvider;
  adsense: { client: string };
  slots: Record<AdSlotKey, AdSlotConfig>;
  /** 찾기 목록에서 몇 개마다 광고를 넣을지 */
  searchListEvery: number;
} = {
  provider: "placeholder",
  adsense: { client: "" },
  slots: {
    "home-mid": { label: "메인 배너 광고", width: 728, height: 90 },
    "search-list": { label: "목록 중간 광고", width: 320, height: 100 },
    "detail-bottom": { label: "상세 하단 광고", width: 320, height: 100 },
  },
  searchListEvery: 6,
};
