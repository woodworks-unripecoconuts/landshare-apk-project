import { House, Search, HousePlus, MessageCircle, CircleUserRound, type LucideIcon } from "lucide-react";

/** 헤더(데스크톱)와 하단 탭바(모바일)가 함께 쓰는 메뉴 목록 */
export const NAV_ITEMS: { href: string; label: string; short: string; icon: LucideIcon }[] = [
  { href: "/", label: "홈", short: "홈", icon: House },
  { href: "/search", label: "마당 찾기", short: "찾기", icon: Search },
  { href: "/host/new", label: "마당 등록", short: "등록", icon: HousePlus },
  { href: "/messages", label: "메시지", short: "메시지", icon: MessageCircle },
  { href: "/mypage", label: "마이페이지", short: "마이", icon: CircleUserRound },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
