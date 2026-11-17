/** className 여러 개를 합쳐 주는 작은 도우미. 거짓 값은 무시합니다. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
