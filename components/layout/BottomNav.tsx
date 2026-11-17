"use client";

/** 모바일 하단 탭바 (앱처럼 보이게) — 화면이 넓으면(md 이상) 숨깁니다. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "./nav-items";
import { cn } from "@/lib/utils/cn";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="하단 메뉴"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-soil-200 bg-white/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {NAV_ITEMS.map(({ href, short, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                  active ? "text-grass-700" : "text-soil-500",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("size-[22px]", active && "stroke-[2.4]")} />
                {short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
