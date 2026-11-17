/**
 * 로그인(인증) 서비스의 약속(인터페이스)과 데모 구현입니다.
 *
 * 지금은 "가짜 로그인": 버튼으로 마당손님/마당지기/관리자 데모 계정을 바꿔 가며 봅니다.
 * 나중에 Supabase Auth(카카오·네이버 로그인 등)로 바꿀 때는
 * AuthService를 구현한 새 객체를 만들어 아래 authService만 바꾸면 됩니다.
 */
import type { Role } from "@/lib/domain/types";
import { readJSON, writeJSON } from "@/lib/storage/local-store";
import { DEMO_ADMIN_ID, DEMO_GUEST_ID, DEMO_HOST_ID } from "@/data/users";

export interface AuthService {
  /** 지금 로그인한 사용자 id (없으면 null) */
  getCurrentUserId(): string | null;
  /** 데모 전용: 역할을 골라 그 데모 계정으로 전환 */
  signInAsRole(role: Role): string;
  subscribe(listener: () => void): () => void;
}

const DEMO_ACCOUNTS: Record<Role, string> = {
  guest: DEMO_GUEST_ID,
  host: DEMO_HOST_ID,
  admin: DEMO_ADMIN_ID,
};

const listeners = new Set<() => void>();

export const demoAuthService: AuthService = {
  getCurrentUserId() {
    // 처음 방문하면 '마당손님으로 보기' 상태로 시작합니다.
    return readJSON<string>("session", DEMO_GUEST_ID);
  },
  signInAsRole(role) {
    const id = DEMO_ACCOUNTS[role];
    writeJSON("session", id);
    listeners.forEach((l) => l());
    return id;
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const authService: AuthService = demoAuthService;
