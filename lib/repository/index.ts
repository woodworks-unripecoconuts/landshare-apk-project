/**
 * 앱 전체가 쓰는 단 하나의 데이터 창구입니다.
 *
 * 나중에 Supabase로 바꿀 때는 아래 한 줄만 바꾸면 됩니다.
 *   export const repo: Repository = createSupabaseRepository();
 * (자세한 방법: lib/repository/supabase/README.md)
 */
import type { Repository } from "./types";
import { createLocalRepository } from "./local";

export const repo: Repository = createLocalRepository();
export type * from "./types";
