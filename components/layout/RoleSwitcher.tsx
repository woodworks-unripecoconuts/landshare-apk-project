"use client";

/**
 * 가짜 로그인 전환 버튼.
 * "마당손님으로 보기 / 마당지기로 보기 / 관리자로 보기" 중 하나를 고르면
 * 해당 데모 계정으로 화면이 바뀝니다.
 */
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ROLE_LABEL } from "@/lib/domain/labels";
import type { Role } from "@/lib/domain/types";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

const OPTIONS: { role: Role; emoji: string; label: string; desc: string }[] = [
  { role: "guest", emoji: "🎒", label: "마당손님으로 보기", desc: "마당을 찾고 신청해요" },
  { role: "host", emoji: "🏡", label: "마당지기로 보기", desc: "마당을 등록하고 신청을 받아요" },
  { role: "admin", emoji: "🛠️", label: "관리자로 보기", desc: "신고·숨김·인증을 관리해요" },
];

export function RoleSwitcher() {
  const { ready, user, role, switchRole } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!ready) {
    return <div className="h-9 w-32 animate-pulse rounded-full bg-soil-100" aria-hidden="true" />;
  }

  const current = OPTIONS.find((o) => o.role === role);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-full border border-soil-200 bg-white pr-2.5 pl-2 text-sm font-semibold text-soil-800 shadow-soft hover:bg-soil-50"
      >
        <span aria-hidden="true">{current?.emoji}</span>
        <span className="max-w-[9rem] truncate">
          {role ? ROLE_LABEL[role] : "보기 전환"}
          <span className="hidden font-normal text-soil-500 sm:inline"> · {user?.name}</span>
        </span>
        <ChevronDown className="size-4 text-soil-500" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-soil-200 bg-white shadow-xl"
        >
          <p className="border-b border-soil-100 bg-soil-50 px-4 py-2 text-xs text-soil-600">
            가짜 로그인 · 데모 계정으로 전환
          </p>
          {OPTIONS.map((o) => (
            <button
              key={o.role}
              role="menuitem"
              type="button"
              onClick={() => {
                switchRole(o.role);
                setOpen(false);
                toast(`이제 ${o.label.replace(" 보기", "")} 보는 중이에요`);
              }}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-grass-50",
                o.role === role && "bg-grass-50",
              )}
            >
              <span className="text-xl" aria-hidden="true">
                {o.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{o.label}</span>
                <span className="block text-xs text-soil-500">{o.desc}</span>
              </span>
              {o.role === role && <Check className="size-4 text-grass-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
