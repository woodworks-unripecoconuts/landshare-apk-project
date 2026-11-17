"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ROLE_LABEL } from "@/lib/domain/labels";
import { isHostVerified } from "@/lib/domain/space-rules";
import { formatDateTime } from "@/lib/domain/dates";
import { Tabs } from "@/components/ui/Tabs";
import { LinkButton } from "@/components/ui/Button";
import { SpaceImage } from "@/components/space/SpaceImage";
import { HostVerifyBadge } from "@/components/space/SpaceBadges";
import { BookingList } from "./BookingList";
import { MySpaces } from "./MySpaces";
import { MyDiaries } from "./MyDiaries";
import { VerificationPanel } from "./VerificationPanel";

type TabKey = "bookings" | "diaries" | "spaces" | "received" | "verify";

const GUEST_TABS: { key: TabKey; label: string }[] = [
  { key: "bookings", label: "내 신청 내역" },
  { key: "diaries", label: "내 마당 일기" },
  { key: "verify", label: "인증 상태" },
];
const HOST_TABS: { key: TabKey; label: string }[] = [
  { key: "received", label: "받은 신청 관리" },
  { key: "spaces", label: "내가 등록한 마당" },
  { key: "verify", label: "인증 상태" },
];

export function MyPageClient() {
  const { ready, user, role } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  if (!ready || !user) return <div className="mx-auto mt-6 h-40 max-w-2xl animate-pulse rounded-2xl bg-soil-100" />;

  const tabs = role === "host" ? HOST_TABS : role === "guest" ? GUEST_TABS : [];
  const requested = params.get("tab") as TabKey | null;
  const tab = tabs.find((t) => t.key === requested)?.key ?? tabs[0]?.key;

  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      {/* 프로필 */}
      <section className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-soil-100">
          <SpaceImage src={user.avatarUrl} alt="" sizes="64px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-grass-700">{role && ROLE_LABEL[role]}</p>
          <p className="text-lg font-extrabold">{user.name}</p>
          <p className="text-xs text-soil-500">가입 {formatDateTime(user.joinedAt).split(" ").slice(0, 2).join(" ")} · 데모 계정</p>
        </div>
        {role === "host" && <HostVerifyBadge verified={isHostVerified(user)} />}
      </section>

      {role === "admin" ? (
        <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-soft">
          <ShieldCheck className="mx-auto size-10 text-grass-600" />
          <p className="mt-2 font-bold">관리자 계정이에요</p>
          <p className="mt-1 text-sm text-soil-600">신고·숨김·인증 요청은 관리자 화면에서 처리해요.</p>
          <LinkButton href="/admin" className="mt-4">
            관리자 화면으로
          </LinkButton>
        </div>
      ) : (
        <>
          <div className="mt-5">
            <Tabs tabs={tabs} value={tab!} onChange={(k) => router.replace(`${pathname}?tab=${k}`, { scroll: false })} />
          </div>
          <div className="mt-4">
            {tab === "bookings" && <BookingList perspective="guest" />}
            {tab === "received" && <BookingList perspective="host" />}
            {tab === "spaces" && <MySpaces />}
            {tab === "diaries" && <MyDiaries />}
            {tab === "verify" && <VerificationPanel />}
          </div>
        </>
      )}
    </div>
  );
}
