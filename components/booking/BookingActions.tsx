"use client";

/** 신청 상태 바꾸기 버튼: 마당지기(승인·거절·이용 완료), 마당손님(취소) */
import { useState } from "react";
import type { Booking, BookingStatus } from "@/lib/domain/types";
import { availableActions } from "@/lib/domain/booking-rules";
import { repo } from "@/lib/repository";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { BOOKING_STATUS_LABEL } from "@/lib/domain/labels";

const MEMO_PROMPT: Partial<Record<BookingStatus, string>> = {
  rejected: "거절 이유를 짧게 남겨 주세요 (선택)",
  cancelled: "취소 이유를 짧게 남겨 주세요 (선택)",
};

export function BookingActions({ booking, size = "md" }: { booking: Booking; size?: "sm" | "md" }) {
  const { user, role } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [memoFor, setMemoFor] = useState<BookingStatus | null>(null);
  const [memo, setMemo] = useState("");
  const actions = availableActions(booking, user?.id ?? null, role);
  if (actions.length === 0) return null;

  async function change(to: BookingStatus, m?: string) {
    setBusy(true);
    try {
      await repo.bookings.changeStatus(booking.id, to, m);
      toast(`'${BOOKING_STATUS_LABEL[to]}'(으)로 바꿨어요`);
      setMemoFor(null);
      setMemo("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "바꾸지 못했어요.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <Button
            key={a.to}
            size={size}
            variant={a.tone === "primary" ? "primary" : a.tone === "danger" ? "outline" : "secondary"}
            className={a.tone === "danger" ? "border-red-300 text-red-700 hover:bg-red-50" : undefined}
            disabled={busy}
            onClick={() => (MEMO_PROMPT[a.to] ? setMemoFor(a.to) : change(a.to))}
          >
            {a.label}
          </Button>
        ))}
      </div>
      {booking.status === "approved" && actions.some((a) => a.to === "completed") && (
        <p className="mt-1 text-xs text-soil-500">데모: 날짜와 상관없이 바로 &lsquo;이용 완료&rsquo;로 바꿔 볼 수 있어요.</p>
      )}
      <Modal
        open={!!memoFor}
        onClose={() => setMemoFor(null)}
        title={memoFor === "rejected" ? "신청 거절" : "신청 취소"}
      >
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder={memoFor ? MEMO_PROMPT[memoFor] : ""}
          className="w-full rounded-xl border border-soil-200 p-3 text-sm"
        />
        <Button
          className="mt-3 w-full"
          variant="danger"
          disabled={busy}
          onClick={() => memoFor && change(memoFor, memo)}
        >
          {memoFor === "rejected" ? "거절하기" : "취소하기"}
        </Button>
      </Modal>
    </>
  );
}
