/**
 * 광고 자리 컴포넌트 — 화면에서는 <AdSlot slot="home-mid" /> 처럼만 씁니다.
 * 실제 광고(애드센스·애드핏)로 바꿀 때는 이 파일과 lib/ads/config.ts만 고치면 됩니다.
 */
import { AD_CONFIG, type AdSlotKey } from "@/lib/ads/config";
import { cn } from "@/lib/utils/cn";

export function AdSlot({ slot, className }: { slot: AdSlotKey; className?: string }) {
  const cfg = AD_CONFIG.slots[slot];

  if (AD_CONFIG.provider === "adsense") {
    // 애드센스 사용 시:
    // 1) app/layout.tsx <head>에 next/script로
    //    https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX 추가
    // 2) 아래 <ins>를 렌더링한 뒤 (window.adsbygoogle = window.adsbygoogle || []).push({}) 호출
    return (
      <ins
        className={cn("adsbygoogle block", className)}
        style={{ display: "block", minHeight: cfg.height }}
        data-ad-client={AD_CONFIG.adsense.client}
        data-ad-slot={cfg.adsenseSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }

  if (AD_CONFIG.provider === "adfit") {
    // 카카오 애드핏 사용 시: //t1.daumcdn.net/kas/static/ba.min.js 스크립트를 한 번 불러와야 합니다.
    return (
      <ins
        className={cn("kakao_ad_area block", className)}
        style={{ display: "none" }}
        data-ad-unit={cfg.adfitUnit}
        data-ad-width={String(cfg.width)}
        data-ad-height={String(cfg.height)}
      />
    );
  }

  // 지금(프로토타입): 광고 자리 표시만
  return (
    <aside
      aria-label="광고"
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-soil-300 bg-soil-50 text-center text-soil-500",
        className,
      )}
      style={{ minHeight: Math.min(cfg.height, 120) }}
    >
      <span className="text-[11px] font-bold tracking-wider text-soil-400">AD · 광고 자리</span>
      <span className="text-xs">
        {cfg.label} ({cfg.width}×{cfg.height}) — 마당공유는 광고로 무료 운영돼요
      </span>
    </aside>
  );
}
