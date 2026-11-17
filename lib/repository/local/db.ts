/**
 * 가짜 DB: /data 폴더의 시드 데이터를 처음 한 번 localStorage에 복사하고,
 * 그 뒤로는 localStorage에서 읽고 씁니다.
 *
 * SEED_VERSION을 올리면 모든 사용자의 데모 데이터가 새 시드로 다시 채워집니다.
 */
import { readJSON, writeJSON, clearAll } from "@/lib/storage/local-store";
import type { Collection } from "../types";
import { seedUsers } from "@/data/users";

export const SEED_VERSION = 1;

type Tables = {
  users: typeof seedUsers;
};

function buildSeed(): Tables {
  return {
    users: seedUsers,
  };
}

const TABLE_NAMES: (keyof Tables)[] = ["users"];

let seededChecked = false;

/** 처음 실행이거나 시드 버전이 바뀌었으면 시드를 다시 채웁니다. */
export function ensureSeeded(): void {
  if (seededChecked || typeof window === "undefined") return;
  const meta = readJSON<{ seedVersion: number } | null>("meta", null);
  if (!meta || meta.seedVersion !== SEED_VERSION) {
    const seed = buildSeed();
    TABLE_NAMES.forEach((t) => writeJSON(`db:${t}`, seed[t]));
    writeJSON("meta", { seedVersion: SEED_VERSION, seededAt: new Date().toISOString() });
  }
  seededChecked = true;
}

export function readTable<K extends keyof Tables>(name: K): Tables[K] {
  ensureSeeded();
  return readJSON<Tables[K]>(`db:${name}`, [] as unknown as Tables[K]);
}

export function writeTable<K extends keyof Tables>(name: K, rows: Tables[K]): void {
  writeJSON(`db:${name}`, rows);
  emit(name as Collection);
}

export function resetAll(): void {
  clearAll();
  seededChecked = false;
  ensureSeeded();
  TABLE_NAMES.forEach((t) => emit(t as Collection));
}

/* ── 변경 알림 ── */
const listeners = new Set<(c: Collection) => void>();

export function subscribe(listener: (c: Collection) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emit(c: Collection): void {
  listeners.forEach((l) => l(c));
}

/** 진짜 서버처럼 아주 짧게 기다립니다 → 로딩 화면도 확인할 수 있게 */
export const MOCK_DELAY_MS = 120;
export function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
