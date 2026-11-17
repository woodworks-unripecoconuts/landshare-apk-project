/**
 * 브라우저 localStorage를 안전하게 쓰기 위한 작은 도우미입니다.
 *
 * 규칙: 앱 전체에서 localStorage는 이 파일을 통해서만 사용합니다.
 *  - 서버에서 렌더링될 때(window 없음)에도 에러가 나지 않습니다.
 *  - 모든 키 앞에 'madang:' 을 붙여 다른 사이트 데이터와 섞이지 않게 합니다.
 *  - 저장 공간(보통 5MB)이 가득 차면 StorageFullError를 던집니다.
 */
const PREFIX = "madang:";

export class StorageFullError extends Error {
  constructor() {
    super("브라우저 저장 공간이 가득 찼어요. 사진 수를 줄이거나 '데모 데이터 초기화'를 해 주세요.");
    this.name = "StorageFullError";
  }
}

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    if (e instanceof DOMException && (e.name === "QuotaExceededError" || e.code === 22)) {
      throw new StorageFullError();
    }
    throw e;
  }
}

export function removeKey(key: string): void {
  if (!hasStorage()) return;
  window.localStorage.removeItem(PREFIX + key);
}

/** 'madang:'으로 시작하는 키를 모두 지웁니다 (데모 데이터 초기화). */
export function clearAll(): void {
  if (!hasStorage()) return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
}
