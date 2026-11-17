"use client";

/**
 * 역할이 맞을 때만 내용을 보여 줍니다.
 * 예) <RoleGate allow={["host"]}>마당 등록 폼</RoleGate>
 * 역할이 다르면 "마당지기로 보기로 전환" 버튼을 보여 줍니다. (가짜 로그인)
 */
import type { Role } from "@/lib/domain/types";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ROLE_LABEL } from "@/lib/domain/labels";
import { Button } from "@/components/ui/Button";

const SWITCH_LABEL: Record<Role, string> = {
  guest: "마당손님으로 전환하기",
  host: "마당지기로 전환하기",
  admin: "관리자로 전환하기",
};

export function RoleGate({
  allow,
  children,
  reason,
}: {
  allow: Role[];
  children: React.ReactNode;
  reason?: string;
}) {
  const { ready, role, switchRole } = useAuth();
  if (!ready) {
    return <div className="mx-auto mt-10 h-40 max-w-md animate-pulse rounded-2xl bg-soil-100" />;
  }
  if (role && allow.includes(role)) return <>{children}</>;
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="text-4xl">🔐</p>
      <h1 className="mt-3 text-lg font-bold">{allow.map((r) => ROLE_LABEL[r]).join(" 또는 ")} 화면이에요</h1>
      <p className="mt-2 text-sm text-soil-600">
        {reason ?? "지금은 다른 역할로 보고 있어요."} 아래 버튼으로 바꿔 볼 수 있어요. (가짜 로그인)
      </p>
      <div className="mt-5 flex flex-col gap-2">
        {allow.map((r) => (
          <Button key={r} onClick={() => switchRole(r)}>
            {SWITCH_LABEL[r]}
          </Button>
        ))}
      </div>
    </div>
  );
}
