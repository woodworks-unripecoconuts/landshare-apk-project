"use client";

/**
 * repository에서 데이터를 불러오는 공통 훅.
 *
 *   const { data, loading, error, reload } = useRepoQuery(() => repo.spaces.get(id), [id], ["spaces"]);
 *
 * - deps가 바뀌면 다시 불러옵니다.
 * - watch에 적은 데이터 묶음이 바뀌거나(예: 누군가 신청을 승인) 로그인 전환이 일어나면 자동으로 다시 불러옵니다.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { repo, type Collection } from "@/lib/repository";
import { authService } from "@/lib/auth/auth-service";

interface QueryState<T> {
  key: string;
  data: T | undefined;
  error: Error | null;
  done: boolean;
}

export function useRepoQuery<T>(fetcher: () => Promise<T>, deps: unknown[], watch?: Collection[]) {
  const key = JSON.stringify(deps);
  const watchKey = watch?.join(",") ?? "*";
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<QueryState<T>>({ key: "", data: undefined, error: null, done: false });
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  // 데이터 변경·로그인 전환 알림 구독
  useEffect(() => {
    const watched = watchKey === "*" ? null : watchKey.split(",");
    const offRepo = repo.subscribe((c) => {
      if (!watched || watched.includes(c)) setVersion((v) => v + 1);
    });
    const offAuth = authService.subscribe(() => setVersion((v) => v + 1));
    return () => {
      offRepo();
      offAuth();
    };
  }, [watchKey]);

  // 불러오기
  useEffect(() => {
    let alive = true;
    fetcherRef.current().then(
      (data) => alive && setState({ key, data, error: null, done: true }),
      (error: unknown) =>
        alive &&
        setState({ key, data: undefined, error: error instanceof Error ? error : new Error(String(error)), done: true }),
    );
    return () => {
      alive = false;
    };
  }, [key, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  const sameKey = state.key === key;
  return {
    data: sameKey ? state.data : undefined,
    error: sameKey ? state.error : null,
    /** 처음 불러오는 중(또는 조건이 바뀌어 다시 불러오는 중) */
    loading: !sameKey || !state.done,
    reload,
  };
}
