import Link from "next/link";
import { SERVICE_NAME, SERVICE_NAME_EN } from "@/data/policies";

/** 임시 로고 아이콘: 지붕 + 마당(땅) + 새싹 */
export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#4f7a3a" />
      <path
        d="M8.5 20.5 20 11l11.5 9.5"
        fill="none"
        stroke="#f7f1e6"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 30.5h24" stroke="#d9a441" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M20 28.5c0-4.6 2.8-7.6 7-8.3 0 4.6-2.8 7.6-7 8.3Z" fill="#e2edd6" />
      <path d="M20 28.5c0-3.2-1.9-5.3-4.8-5.8 0 3.2 1.9 5.3 4.8 5.8Z" fill="#c6dbb0" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${SERVICE_NAME} 홈`}>
      <LogoIcon />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-grass-800">{SERVICE_NAME}</span>
        <span className="text-[10px] font-semibold tracking-wider text-soil-500">{SERVICE_NAME_EN}</span>
      </span>
    </Link>
  );
}
