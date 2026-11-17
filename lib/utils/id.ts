/** 새 데이터의 id를 만듭니다. (예: 'sp-lx3k2a-9f1c') */
export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}
