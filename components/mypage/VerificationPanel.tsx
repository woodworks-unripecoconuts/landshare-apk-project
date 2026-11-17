"use client";

/** 인증 상태 + 데모 인증 버튼 (본인 인증 / 토지·주택 소유 확인) */
import { useRef, useState } from "react";
import { BadgeCheck, FileUp, Hourglass, ShieldCheck } from "lucide-react";
import type { VerificationStatus } from "@/lib/domain/types";
import { useAuth } from "@/lib/auth/AuthProvider";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { verificationService } from "@/lib/verification/verification-service";
import { VERIFICATION_KIND_LABEL, VERIFICATION_STATUS_LABEL } from "@/lib/domain/labels";
import { formatDateTime } from "@/lib/domain/dates";
import { isHostVerified } from "@/lib/domain/space-rules";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HostVerifyBadge } from "@/components/space/SpaceBadges";
import { useToast } from "@/components/ui/Toast";

function StatusBadge({ status }: { status: VerificationStatus }) {
  const tone = status === "verified" ? "grass" : status === "pending" ? "sun" : status === "rejected" ? "red" : "gray";
  return (
    <Badge tone={tone}>
      {status === "pending" && <Hourglass className="size-3.5 animate-pulse" />}
      {status === "verified" && <BadgeCheck className="size-3.5" />}
      {VERIFICATION_STATUS_LABEL[status]}
    </Badge>
  );
}

export function VerificationPanel() {
  const { user } = useAuth();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const history = useRepoQuery(() => repo.verifications.listMine(), [], ["verifications"]);
  if (!user) return null;
  const isHost = user.role === "host";

  async function run(fn: () => Promise<void>, msg: string) {
    setBusy(true);
    try {
      await fn();
      toast(msg);
    } catch (e) {
      toast(e instanceof Error ? e.message : "요청하지 못했어요.", "error");
    } finally {
      setBusy(false);
    }
  }

  const canStart = (s: VerificationStatus) => s === "none" || s === "rejected";

  return (
    <div className="space-y-4">
      {isHost && (
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
          <div>
            <p className="font-bold">내 마당에 보이는 표시</p>
            <p className="text-sm text-soil-600">본인 인증과 소유 확인을 모두 마치면 &lsquo;인증 마당지기&rsquo;가 돼요.</p>
          </div>
          <HostVerifyBadge verified={isHostVerified(user)} />
        </div>
      )}

      <section className="rounded-2xl border border-soil-200/70 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="size-5 text-grass-600" /> 본인 인증
          </p>
          <StatusBadge status={user.identityStatus} />
        </div>
        <p className="mt-1 text-sm text-soil-600">휴대폰 본인확인으로 실제 사람인지 확인해요.</p>
        {canStart(user.identityStatus) && (
          <Button
            className="mt-3"
            disabled={busy}
            onClick={() => run(() => verificationService.startIdentity(), "본인 인증 요청 — 3초 뒤 완료돼요(데모)")}
          >
            본인 인증하기 (데모)
          </Button>
        )}
        {user.identityStatus === "pending" && <p className="mt-2 text-sm text-sun-600">심사 중이에요… 잠시만 기다려 주세요.</p>}
      </section>

      {isHost && (
        <section className="rounded-2xl border border-soil-200/70 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 font-bold">
              <FileUp className="size-5 text-grass-600" /> 토지·주택 소유 확인
            </p>
            <StatusBadge status={user.ownershipStatus} />
          </div>
          <p className="mt-1 text-sm text-soil-600">
            등기부등본을 올리면 마당의 주인(또는 사용 권한이 있는 사람)인지 확인해요.
          </p>
          {canStart(user.ownershipStatus) && (
            <>
              <Button className="mt-3" variant="outline" disabled={busy} onClick={() => fileRef.current?.click()}>
                등기부등본 업로드 (데모)
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) run(() => verificationService.startOwnership(f), `'${f.name}' 접수 — 3초 뒤 완료돼요(데모)`);
                  e.target.value = "";
                }}
              />
              <p className="mt-1 text-xs text-soil-500">데모라서 파일 내용은 어디에도 저장되지 않고 파일 이름만 기록돼요.</p>
            </>
          )}
          {user.ownershipStatus === "pending" && <p className="mt-2 text-sm text-sun-600">심사 중이에요… 잠시만 기다려 주세요.</p>}
        </section>
      )}

      <p className="rounded-xl bg-soil-50 p-3 text-xs text-soil-600">
        지금은 화면 흐름 확인용 데모예요. 실제 서비스에서는 PASS 등 본인인증과 등기부등본 확인(관리자 검토)으로 바뀌어요.
      </p>

      {!!history.data?.length && (
        <div>
          <p className="mb-2 text-sm font-bold text-soil-700">요청 기록</p>
          <ul className="space-y-1.5 text-sm">
            {history.data.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-2">
                <span className="font-semibold">{VERIFICATION_KIND_LABEL[r.kind]}</span>
                <StatusBadge status={r.status} />
                {r.fileName && <span className="text-xs text-soil-500">{r.fileName}</span>}
                <span className="ml-auto text-xs text-soil-400">{formatDateTime(r.requestedAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
