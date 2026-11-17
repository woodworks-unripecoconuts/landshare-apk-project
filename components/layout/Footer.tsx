"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { repo } from "@/lib/repository";
import { useToast } from "@/components/ui/Toast";
import { LogoIcon } from "./Logo";
import { FREE_POLICY_SHORT, NO_FEE_NOTICE, PROTOTYPE_NOTICE, SERVICE_NAME, SLOGAN } from "@/data/policies";

export function Footer() {
  const toast = useToast();
  const router = useRouter();

  async function reset() {
    if (!confirm("데모 데이터를 처음 상태로 되돌릴까요?\n직접 등록한 마당·신청·메시지가 모두 지워져요.")) return;
    await repo.resetDemoData();
    toast("데모 데이터를 초기화했어요");
    router.push("/");
  }

  return (
    <footer className="mt-16 border-t border-soil-200 bg-soil-50 pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-soil-700">
        <div className="flex items-center gap-2">
          <LogoIcon size={28} />
          <div>
            <p className="font-bold text-soil-900">{SERVICE_NAME}</p>
            <p className="text-xs text-soil-500">{SLOGAN}</p>
          </div>
        </div>

        <p className="mt-4">{FREE_POLICY_SHORT}</p>
        <p className="mt-1 font-semibold text-soil-800">{NO_FEE_NOTICE}</p>

        <nav className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-semibold" aria-label="정책 링크">
          <Link href="/terms" className="hover:underline">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:underline">
            개인정보처리방침
          </Link>
          <Link href="/legal" className="hover:underline">
            법령 안내
          </Link>
        </nav>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-soil-200 pt-4 text-xs text-soil-500">
          <p>
            © 2026 {SERVICE_NAME} · {PROTOTYPE_NOTICE} · 모든 데이터는 가짜(데모)이며 이 브라우저에만 저장됩니다.
          </p>
          <button type="button" onClick={reset} className="rounded-lg border border-soil-300 px-3 py-1.5 font-semibold hover:bg-white">
            데모 데이터 초기화
          </button>
        </div>
      </div>
    </footer>
  );
}
