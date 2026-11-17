import Link from "next/link";
import { BadgeCheck, CarFront, Flame, PawPrint, Sun, Tent, Toilet, Zap, type LucideIcon } from "lucide-react";

/** 아이콘 카테고리 줄 — 눌러서 바로 찾기 (Hipcamp 카테고리 줄 참고) */
const ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/search?type=camping", label: "마당캠핑", icon: Tent },
  { href: "/search?type=carcamp", label: "마당차박", icon: CarFront },
  { href: "/search?type=picnic", label: "마당나들이", icon: Sun },
  { href: "/search?amenities=pets", label: "반려동물 OK", icon: PawPrint },
  { href: "/search?amenities=fire", label: "불멍 가능", icon: Flame },
  { href: "/search?amenities=toilet", label: "화장실 있음", icon: Toilet },
  { href: "/search?amenities=electricity", label: "전기 사용", icon: Zap },
  { href: "/search?verified=1", label: "인증 마당지기", icon: BadgeCheck },
];

export function CategoryRail() {
  return (
    <nav aria-label="카테고리" className="border-b border-soil-200/70">
      <ul className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 md:justify-between md:gap-4">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              className="group flex min-w-[76px] flex-col items-center gap-1.5 border-b-2 border-transparent px-1 pt-5 pb-3 text-xs font-semibold text-soil-600 transition hover:border-soil-300 hover:text-ink"
            >
              <Icon className="size-6 stroke-[1.6] transition group-hover:scale-110" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
