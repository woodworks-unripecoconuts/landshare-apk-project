"use client";

/**
 * 상단 헤더 — 흰 바탕 + 가운데 검색 알약(메인 제외) + 오른쪽 '마당 등록하기'·역할 전환
 * (Hipcamp 헤더 구성을 참고)
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { RoleSwitcher } from "./RoleSwitcher";
import { isActive } from "./nav-items";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/search", label: "마당 찾기" },
  { href: "/messages", label: "메시지" },
  { href: "/mypage", label: "마이페이지" },
];

export function Header() {
  const pathname = usePathname();
  const { role } = useAuth();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-soil-200/60 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:h-[72px]">
        <Logo />

        {!isHome && (
          <Link
            href="/search"
            className="ml-4 hidden h-12 items-center gap-3 rounded-full border border-soil-200 bg-white pr-1.5 pl-5 text-sm shadow-soft transition hover:shadow-lift md:flex"
          >
            <span className="font-semibold text-ink">어디로 갈까요?</span>
            <span className="h-5 w-px bg-soil-200" aria-hidden="true" />
            <span className="text-soil-500">강원 18개 시·군</span>
            <span className="hidden h-5 w-px bg-soil-200 lg:block" aria-hidden="true" />
            <span className="hidden text-soil-500 lg:inline">날짜 · 인원</span>
            <span className="flex size-9 items-center justify-center rounded-full bg-grass-600 text-white">
              <Search className="size-4" />
            </span>
          </Link>
        )}

        <div className="ml-auto flex items-center gap-1">
          <nav className="mr-1 hidden items-center gap-0.5 lg:flex" aria-label="주요 메뉴">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold text-soil-700 transition hover:bg-soil-100",
                  isActive(pathname, l.href) && "text-ink underline decoration-2 underline-offset-8",
                )}
              >
                {l.label}
              </Link>
            ))}
            {role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-soil-700 hover:bg-soil-100"
              >
                <ShieldCheck className="size-4" /> 관리자
              </Link>
            )}
          </nav>
          <Link
            href="/host/new"
            className="mr-1 hidden h-10 items-center rounded-full px-4 text-sm font-semibold text-ink transition hover:bg-soil-100 md:inline-flex"
          >
            마당 등록하기
          </Link>
          {role === "admin" && (
            <Link
              href="/admin"
              aria-label="관리자 화면"
              className="mr-1 flex size-9 items-center justify-center rounded-full border border-soil-200 text-soil-700 lg:hidden"
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
