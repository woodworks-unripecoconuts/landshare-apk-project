import Link from "next/link";
import { Scale } from "lucide-react";
import { LEGAL_HEADER, LEGAL_NOTICES } from "@/data/legal-notices";

/** 상세 페이지의 법령 안내 요약 (내용은 data/legal-notices.ts) */
export function LegalSummary() {
  return (
    <div className="rounded-2xl border border-soil-200 bg-soil-50 p-4">
      <p className="flex items-center gap-1.5 font-bold text-soil-900">
        <Scale className="size-4" /> 법령 안내 요약
      </p>
      <p className="mt-1 text-xs text-soil-500">{LEGAL_HEADER}</p>
      <ul className="mt-3 space-y-2">
        {LEGAL_NOTICES.map((n) => (
          <li key={n.id}>
            <details className="group rounded-xl bg-white px-3 py-2">
              <summary className="cursor-pointer list-none text-sm font-semibold text-soil-800">
                <span className="mr-1 text-soil-400 group-open:hidden">＋</span>
                <span className="mr-1 hidden text-soil-400 group-open:inline">－</span>
                {n.title} <span className="font-normal text-soil-500">· {n.lawName}</span>
              </summary>
              <p className="mt-1 pl-4 text-sm text-soil-700">{n.summary}</p>
            </details>
          </li>
        ))}
      </ul>
      <Link href="/legal" className="mt-3 inline-block text-sm font-semibold text-grass-700">
        법령 안내 전체 보기 →
      </Link>
    </div>
  );
}
