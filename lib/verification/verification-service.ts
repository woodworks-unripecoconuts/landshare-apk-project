/**
 * 마당지기 인증 서비스 (데모).
 *
 * 지금: 버튼을 누르면 '심사 중' → 3초 뒤 '인증 완료(데모)'. 실제 인증은 하지 않습니다.
 * 나중: 아래 VerificationService를 구현한 실제 서비스로 바꿔 끼우면 됩니다.
 *   - 본인 인증: PASS·휴대폰 본인확인 등 (결과를 서버에서 받아 repository에 기록)
 *   - 소유 확인: 등기부등본 파일을 Supabase Storage에 올리고, 관리자가 확인 후 승인
 */
import type { VerificationKind } from "@/lib/domain/types";
import { repo } from "@/lib/repository";

export interface VerificationService {
  /** 본인 인증 시작 */
  startIdentity(): Promise<void>;
  /** 토지·주택 소유 확인 시작 (등기부등본 파일) */
  startOwnership(file: File): Promise<void>;
}

export const DEMO_VERIFY_DELAY_MS = 3000;

async function demoRequest(kind: VerificationKind, fileName?: string) {
  await repo.verifications.request(kind, { fileName, demoAuto: true });
  // 3초 뒤 자동으로 '인증 완료(데모)'로 바꿈 (페이지를 떠나도 다음에 읽을 때 반영됨)
  setTimeout(() => {
    void repo.verifications.settleDemo();
  }, DEMO_VERIFY_DELAY_MS + 50);
}

export const demoVerificationService: VerificationService = {
  startIdentity: () => demoRequest("identity"),
  startOwnership: (file) => demoRequest("ownership", file.name),
};

export const verificationService: VerificationService = demoVerificationService;
