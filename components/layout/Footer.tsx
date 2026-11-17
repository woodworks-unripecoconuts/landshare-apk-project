"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { repo } from "@/lib/repository";
import { useToast } from "@/components/ui/Toast";
import { LogoIcon } from "./Logo";
import { FREE_POLICY_SHORT, NO_FEE_NOTICE, PROTOTYPE_NOTICE, SERVICE_NAME, SLOGAN } from "@/data/policies";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "둘러보기",
    links: [
      { href: "/search", label: "마당 찾기" },
      { href: "/search?type=camping", label: "마당캠핑" },
      { href: "/search?type=carcamp", label: "마당차박" },
      { href: "/search?type=picnic", label: "마당나들이" },
    ],
  },
  {
    title: "마당지기",
    links: [
      { href: "/host/new", label: "마당 등록하기" },
      { href: "/mypage?tab=received", label: "받은 신청 관리" },
      { href: "/mypage?tab=verify", label: "마당지기 인증" },
    ],
  },
  {
    title: "정책",
    links: [
      { href: "/terms", label: "이용약관" },
      { href: "/privacy", label: "개인정보처리방침" },
      { href: "/legal", label: "법령 안내" },
    ],
  },
];

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
    <footer className="bg-cream pb-24 md:pb-10">
      <div className="mx-auto max-w-6xl px-4 pt-12 text-sm text-soil-600">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoIcon size={32} />
              <div>
                <p className="font-bold text-ink">{SERVICE_NAME}</p>
                <p className="text-xs text-soil-500">{SLOGAN}</p>
              </div>
            </div>
            <p className="mt-4 leading-relaxed">{FREE_POLICY_SHORT}</p>
            <p className="mt-1 font-semibold text-soil-800">{NO_FEE_NOTICE}</p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-bold text-ink">{col.title}</p>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-ink hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-soil-200 pt-5 text-xs text-soil-500">
          <p>
            © 2026 {SERVICE_NAME} · {PROTOTYPE_NOTICE} · 모든 데이터는 가짜(데모)이며 이 브라우저에만 저장됩니다.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-soil-300 px-3.5 py-1.5 font-semibold text-soil-700 hover:bg-white"
          >
            데모 데이터 초기화
          </button>
        </div>
      </div>
    </footer>
  );
}
