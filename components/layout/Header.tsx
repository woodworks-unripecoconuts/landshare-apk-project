"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { RoleSwitcher } from "./RoleSwitcher";
import { NAV_ITEMS, isActive } from "./nav-items";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-soil-200/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:h-16">
        <Logo />

        {/* 데스크톱 메뉴 (모바일에서는 하단 탭바 사용) */}
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
          {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-[15px] font-semibold text-soil-700 hover:bg-soil-100",
                isActive(pathname, item.href) && "bg-grass-100 text-grass-800",
              )}
            >
              {item.label}
            </Link>
          ))}
          {role === "admin" && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-semibold text-soil-700 hover:bg-soil-100",
                isActive(pathname, "/admin") && "bg-grass-100 text-grass-800",
              )}
            >
              <ShieldCheck className="size-4" /> 관리자
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {role === "admin" && (
            <Link
              href="/admin"
              aria-label="관리자 화면"
              className="flex size-9 items-center justify-center rounded-full bg-white text-soil-700 shadow-soft md:hidden"
            >
              <ShieldCheck className="size-5" />
            </Link>
          )}
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
