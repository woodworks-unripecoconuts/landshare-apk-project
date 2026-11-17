"use client";

/**
 * 화면 어디서든 "지금 누구로 보고 있는지"를 알 수 있게 해 주는 React 컨텍스트입니다.
 * 사용법: const { user, role, switchRole } = useAuth();
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Role, User } from "@/lib/domain/types";
import { repo } from "@/lib/repository";
import { authService } from "./auth-service";

interface AuthState {
  /** 브라우저에서 로그인 정보를 다 읽었는지 (서버 렌더링 중에는 false) */
  ready: boolean;
  user: User | null;
  role: Role | null;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthState>({
  ready: false,
  user: null,
  role: null,
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const id = authService.getCurrentUserId();
    const u = id ? await repo.users.get(id) : null;
    setUser(u);
    setReady(true);
  }, []);

  useEffect(() => {
    // 처음 한 번 + 로그인 전환/사용자 정보(인증 상태 등)가 바뀔 때마다 다시 읽기
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 브라우저 저장소에서 읽어 오는 비동기 작업
    load();
    const offAuth = authService.subscribe(load);
    const offRepo = repo.subscribe((c) => {
      if (c === "users") load();
    });
    return () => {
      offAuth();
      offRepo();
    };
  }, [load]);

  const switchRole = useCallback((role: Role) => {
    authService.signInAsRole(role);
  }, []);

  return (
    <AuthContext.Provider value={{ ready, user, role: user?.role ?? null, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
