/**
 * Repository(저장소) 인터페이스 — "데이터를 어떻게 읽고 쓰는가"의 약속입니다.
 *
 * 화면 코드는 이 인터페이스만 알고, 데이터가 실제로 어디에 저장되는지
 * (지금: 가짜 데이터 + localStorage / 나중: Supabase)는 모릅니다.
 * 그래서 저장 방식을 바꿀 때 화면 코드는 고치지 않아도 됩니다.
 *
 * 모든 메서드는 Promise를 돌려줍니다. 지금은 브라우저 안에서 바로 끝나지만,
 * 나중에 네트워크 요청으로 바뀌어도 화면 코드는 똑같이 await 하면 됩니다.
 */
import type { User } from "@/lib/domain/types";

/** 데이터 묶음 이름 — 변경 알림에 사용 */
export type Collection = "users";

export interface UsersRepository {
  get(id: string): Promise<User | null>;
  list(): Promise<User[]>;
}

export interface Repository {
  users: UsersRepository;
  /** 데이터가 바뀌면 알려 줍니다. 반환된 함수를 부르면 구독 해제. */
  subscribe(listener: (collection: Collection) => void): () => void;
  /** 데모 데이터를 처음 상태로 되돌립니다. (프로토타입 전용) */
  resetDemoData(): Promise<void>;
}
