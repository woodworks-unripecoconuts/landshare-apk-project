"use client";

/** 관리자: 신고 목록 / 공간 관리(숨김·해제) / 인증 요청 */
import { useState } from "react";
import Link from "next/link";
import { EyeOff, Eye } from "lucide-react";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import type { Space } from "@/lib/domain/types";
import {
  REPORT_REASON_LABEL,
  REPORT_STATUS_LABEL,
  VERIFICATION_KIND_LABEL,
  VERIFICATION_STATUS_LABEL,
} from "@/lib/domain/labels";
import { formatDateTime } from "@/lib/domain/dates";
import { getRegion } from "@/data/regions";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorBox, LoadingBlock } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { HostVerifyBadge, SpaceTypeBadge } from "@/components/space/SpaceBadges";

type TabKey = "reports" | "spaces" | "verifications";

function useAction() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    setBusy(true);
    try {
      await fn();
      toast(msg);
    } catch (e) {
      toast(e instanceof Error ? e.message : "처리하지 못했어요.", "error");
    } finally {
      setBusy(false);
    }
  };
  return { busy, run };
}

/** 숨김 사유를 받아 숨김 처리하는 팝업 */
function HideModal({ space, onClose, defaultReason }: { space: Space | null; onClose: () => void; defaultReason?: string }) {
  const [reason, setReason] = useState(defaultReason ?? "신고 접수로 확인 중");
  const { busy, run } = useAction();
  return (
    <Modal open={!!space} onClose={onClose} title="공간 숨김 처리">
      <p className="text-sm text-soil-700">
        <b>{space?.title}</b> 을(를) 숨기면 찾기·상세에서 보이지 않아요. (마당지기와 관리자만 볼 수 있음)
      </p>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mt-3 h-11 w-full rounded-xl border border-soil-200 px-3 text-sm"
        aria-label="숨김 사유"
      />
      <Button
        variant="danger"
        className="mt-3 w-full"
        disabled={busy}
        onClick={() => space && run(() => repo.spaces.setHidden(space.id, true, reason), "숨김 처리했어요").then(onClose)}
      >
        숨기기
      </Button>
    </Modal>
  );
}

function ReportsTab() {
  const q = useRepoQuery(() => repo.reports.list(), [], ["reports", "spaces"]);
  const { busy, run } = useAction();
  const [hideTarget, setHideTarget] = useState<{ space: Space; reason: string } | null>(null);
  if (q.loading) return <LoadingBlock />;
  if (q.error) return <ErrorBox error={q.error} />;
  if (!q.data?.length) return <EmptyState emoji="✅" title="신고가 없어요" />;
  return (
    <>
    <ul className="space-y-3">
      {q.data.map(({ report, space, reporter }) => (
        <li key={report.id} className="rounded-2xl border border-soil-200/70 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={report.status === "open" ? "red" : report.status === "resolved" ? "grass" : "gray"}>
              {REPORT_STATUS_LABEL[report.status]}
            </Badge>
            <span className="font-semibold">{REPORT_REASON_LABEL[report.reason]}</span>
            <span className="ml-auto text-xs text-soil-500">{formatDateTime(report.createdAt)}</span>
          </div>
          <p className="mt-2 text-sm">
            대상:{" "}
            {space ? (
              <Link href={`/spaces/${space.id}`} className="font-semibold text-grass-700 underline">
                {space.title}
              </Link>
            ) : (
              "삭제된 마당"
            )}
            {space?.status === "hidden" && <Badge tone="red" className="ml-1">숨김됨</Badge>} · 신고자 {reporter?.name}
          </p>
          {report.detail && <p className="mt-1 rounded-xl bg-soil-50 p-2.5 text-sm text-soil-800">{report.detail}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {space && space.status === "active" && (
              <Button
                size="sm"
                variant="danger"
                disabled={busy}
                onClick={() => setHideTarget({ space, reason: `신고: ${REPORT_REASON_LABEL[report.reason]}` })}
              >
                <EyeOff className="size-4" /> 공간 숨김
              </Button>
            )}
            {report.status === "open" ? (
              <>
                <Button size="sm" disabled={busy} onClick={() => run(() => repo.reports.setStatus(report.id, "resolved"), "처리 완료로 바꿨어요")}>
                  처리 완료
                </Button>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => repo.reports.setStatus(report.id, "dismissed"), "기각했어요")}>
                  기각
                </Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" disabled={busy} onClick={() => run(() => repo.reports.setStatus(report.id, "open"), "다시 접수 상태로 바꿨어요")}>
                다시 열기
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
    <HideModal
      key={hideTarget?.space.id}
      space={hideTarget?.space ?? null}
      defaultReason={hideTarget?.reason}
      onClose={() => setHideTarget(null)}
    />
    </>
  );
}

function SpacesTab() {
  const q = useRepoQuery(() => repo.spaces.listAll(), [], ["spaces", "users", "diaries"]);
  const { busy, run } = useAction();
  const [hideTarget, setHideTarget] = useState<Space | null>(null);
  if (q.loading) return <LoadingBlock />;
  if (q.error) return <ErrorBox error={q.error} />;
  return (
    <>
      <ul className="divide-y divide-soil-100 overflow-hidden rounded-2xl border border-soil-200/70 bg-white">
        {q.data?.map(({ space, host, hostVerified }) => (
          <li key={space.id} className="flex flex-wrap items-center gap-2 p-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1">
                <SpaceTypeBadge type={space.type} />
                {space.status === "hidden" ? <Badge tone="red">숨김</Badge> : <Badge tone="grass">공개</Badge>}
                <HostVerifyBadge verified={hostVerified} />
              </div>
              <Link href={`/spaces/${space.id}`} className="mt-1 block truncate font-semibold hover:underline">
                {space.title}
              </Link>
              <p className="text-xs text-soil-500">
                {getRegion(space.regionCode).name} · 마당지기 {host?.name}
                {space.hiddenReason && ` · 사유: ${space.hiddenReason}`}
              </p>
            </div>
            {space.status === "active" ? (
              <Button size="sm" variant="outline" disabled={busy} onClick={() => setHideTarget(space)}>
                <EyeOff className="size-4" /> 숨기기
              </Button>
            ) : (
              <Button size="sm" disabled={busy} onClick={() => run(() => repo.spaces.setHidden(space.id, false), "다시 공개했어요")}>
                <Eye className="size-4" /> 숨김 해제
              </Button>
            )}
          </li>
        ))}
      </ul>
      <HideModal key={hideTarget?.id} space={hideTarget} onClose={() => setHideTarget(null)} />
    </>
  );
}

function VerificationsTab() {
  const q = useRepoQuery(() => repo.verifications.list(), [], ["verifications", "users"]);
  const { busy, run } = useAction();
  if (q.loading) return <LoadingBlock />;
  if (q.error) return <ErrorBox error={q.error} />;
  if (!q.data?.length) return <EmptyState emoji="📄" title="인증 요청이 없어요" />;
  return (
    <ul className="space-y-3">
      {q.data.map(({ request, user }) => (
        <li key={request.id} className="rounded-2xl border border-soil-200/70 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              tone={request.status === "pending" ? "sun" : request.status === "verified" ? "grass" : request.status === "rejected" ? "red" : "gray"}
            >
              {VERIFICATION_STATUS_LABEL[request.status]}
            </Badge>
            <span className="font-semibold">{VERIFICATION_KIND_LABEL[request.kind]}</span>
            {request.demoAuto && <Badge tone="blue">데모 자동 인증</Badge>}
            <span className="ml-auto text-xs text-soil-500">{formatDateTime(request.requestedAt)}</span>
          </div>
          <p className="mt-1 text-sm">
            {user?.name} ({user?.role === "host" ? "마당지기" : "마당손님"})
            {request.fileName && <span className="text-soil-500"> · 첨부: {request.fileName}</span>}
          </p>
          {request.status === "pending" && (
            <div className="mt-3 flex gap-2">
              <Button size="sm" disabled={busy} onClick={() => run(() => repo.verifications.review(request.id, true), "인증을 승인했어요")}>
                승인
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => repo.verifications.review(request.id, false), "인증을 반려했어요")}>
                반려
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function AdminClient() {
  const [tab, setTab] = useState<TabKey>("reports");
  const reports = useRepoQuery(() => repo.reports.list(), [], ["reports"]);
  const verifs = useRepoQuery(() => repo.verifications.list(), [], ["verifications"]);
  const openReports = reports.data?.filter((r) => r.report.status === "open").length;
  const pending = verifs.data?.filter((v) => v.request.status === "pending").length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <h1 className="text-xl font-extrabold">관리자</h1>
      <p className="mt-1 text-sm text-soil-600">신고를 확인하고, 문제가 있는 공간을 숨기고, 인증 요청을 처리해요.</p>
      <div className="mt-4">
        <Tabs
          tabs={[
            { key: "reports", label: "신고 목록", count: openReports },
            { key: "spaces", label: "공간 관리" },
            { key: "verifications", label: "인증 요청", count: pending },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>
      <div className="mt-4">
        {tab === "reports" && <ReportsTab />}
        {tab === "spaces" && <SpacesTab />}
        {tab === "verifications" && <VerificationsTab />}
      </div>
    </div>
  );
}
