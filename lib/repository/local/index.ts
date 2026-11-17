/**
 * 가짜 데이터 + localStorage로 동작하는 Repository 구현입니다.
 */
import type { Repository } from "../types";
import type { User } from "@/lib/domain/types";
import { delay, readTable, resetAll, subscribe } from "./db";

export function createLocalRepository(): Repository {
  return {
    users: {
      async get(id) {
        return delay(readTable("users").find((u: User) => u.id === id) ?? null);
      },
      async list() {
        return delay(readTable("users"));
      },
    },
    subscribe,
    async resetDemoData() {
      resetAll();
      return delay(undefined);
    },
  };
}
