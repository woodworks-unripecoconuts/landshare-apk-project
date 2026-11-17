import type { Metadata } from "next";
import { Scale } from "lucide-react";
import { DocPage } from "@/components/layout/DocPage";
import {
  GUEST_AGREEMENT_DETAILS,
  GUEST_AGREEMENT_LABEL,
  LEGAL_BASE_DATE,
  LEGAL_DISCLAIMER,
  LEGAL_NOTICES,
} from "@/data/legal-notices";
import { NO_FEE_NOTICE } from "@/data/policies";

export const metadata: Metadata = { title: "법령 안내" };

/** 법령 안내 전체 — 내용은 data/legal-notices.ts 한 파일에서 고칩니다. */
export default function LegalPage() {
  return (
    <DocPage
      title="법령 안내"
      subtitle={
        <p className="rounded-xl bg-soil-800 p-3 text-soil-50">
          <b>기준일 {LEGAL_BASE_DATE}</b> · {LEGAL_DISCLAIMER}
        </p>
      }
    >
      <p className="font-semibold text-grass-800">{NO_FEE_NOTICE}</p>

      {LEGAL_NOTICES.map((n, i) => (
        <section key={n.id} className="rounded-2xl border border-soil-200 bg-white p-5">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-soil-500">
            <Scale className="size-4" /> {i + 1}. {n.lawName}
          </p>
          <h2 className="mt-1">{n.title}</h2>
          <ul className="space-y-1">
            {n.details.map((d, j) => (
              <li key={j}>{d}</li>
            ))}
          </ul>
          <p className="mt-3 rounded-xl bg-grass-50 p-3 text-sm">
            <b>마당지기 확인 문구</b>: &ldquo;{n.checkLabel}&rdquo;
          </p>
        </section>
      ))}

      <section className="rounded-2xl border border-soil-200 bg-white p-5">
        <h2>마당손님 동의 사항</h2>
        <p className="font-semibold">&ldquo;{GUEST_AGREEMENT_LABEL}&rdquo;</p>
        <ul className="mt-2 space-y-1">
          {GUEST_AGREEMENT_DETAILS.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>
    </DocPage>
  );
}
