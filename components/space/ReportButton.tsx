"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import type { ReportReason } from "@/lib/domain/types";
import { REPORT_REASON_LABEL } from "@/lib/domain/labels";
import { repo } from "@/lib/repository";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

/** 신고하기 — 신고는 관리자 화면 '신고 목록'에 쌓입니다. */
export function ReportButton({ spaceId }: { spaceId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("fee");
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function submit() {
    setBusy(true);
    try {
      await repo.reports.create({ spaceId, reason, detail });
      toast("신고가 접수됐어요. 관리자가 확인할게요.");
      setOpen(false);
      setDetail("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "신고하지 못했어요.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-sm text-soil-500 underline-offset-2 hover:underline"
      >
        <Flag className="size-4" /> 이 마당 신고하기
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="마당 신고하기">
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm text-soil-600">어떤 문제가 있었나요?</legend>
          {(Object.keys(REPORT_REASON_LABEL) as ReportReason[]).map((r) => (
            <label key={r} className="flex items-center gap-2 rounded-xl border border-soil-200 px-3 py-2.5">
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="accent-grass-600" />
              <span className="text-sm">{REPORT_REASON_LABEL[r]}</span>
            </label>
          ))}
        </fieldset>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="자세한 내용을 적어 주세요 (선택)"
          rows={3}
          className="mt-3 w-full rounded-xl border border-soil-200 p-3 text-sm"
        />
        <Button className="mt-3 w-full" onClick={submit} disabled={busy}>
          신고 접수
        </Button>
      </Modal>
    </>
  );
}
