"use client";

/**
 * 메인 첫 화면: 큰 풍경 사진 + 슬로건 + 알약 모양 검색창 (Hipcamp 첫 화면 구성 참고)
 */
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { REGIONS } from "@/data/regions";
import { HERO_IMAGE } from "@/data/images";
import { SLOGAN } from "@/data/policies";
import type { RegionCode } from "@/lib/domain/types";
import { nextWeekday, relDate } from "@/lib/domain/dates";
import { filterToQuery } from "@/lib/utils/search-query";

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full px-5 py-2.5 transition hover:bg-soil-50">
      <span className="text-grass-600">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold text-ink">{label}</span>
        {children}
      </span>
    </label>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const [region, setRegion] = useState<RegionCode | "">("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [imgOk, setImgOk] = useState(true);

  const go = (d?: string) =>
    router.push(
      "/search" + filterToQuery({ regionCode: region || undefined, date: (d ?? date) || undefined, guests: guests || undefined }),
    );

  const control = "w-full bg-transparent text-[15px] text-soil-700 outline-none";

  return (
    <section className="px-0 md:px-4 md:pt-4">
      <div className="relative overflow-hidden bg-grass-800 md:mx-auto md:max-w-[1400px] md:rounded-[32px]">
        {imgOk && (
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onError={() => setImgOk(false)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[480px] max-w-6xl flex-col justify-end px-4 pt-14 pb-8 md:min-h-[600px] md:pt-24 md:pb-12">
          <p className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            강원의 남는 마당 · 이용료 0원
          </p>
          <h1 className="mt-4 max-w-2xl text-[40px] leading-[1.1] font-extrabold tracking-tight text-white md:text-6xl">
            {SLOGAN.split(", ").map((part, i) => (
              <span key={i} className="block">
                {part}
                {i === 0 ? "," : ""}
              </span>
            ))}
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
            쓰지 않는 주택 마당과 농지를 이웃과 나눠요. 텐트 한 동, 차 한 대면 충분해요.
          </p>

          {/* 검색: 데스크톱은 알약 한 줄, 모바일은 카드 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go();
            }}
            className="mt-7 grid gap-1 rounded-3xl bg-white p-2 shadow-lift md:flex md:items-center md:rounded-full"
          >
            <Field icon={<MapPin className="size-5" />} label="어디로">
              <select value={region} onChange={(e) => setRegion(e.target.value as RegionCode | "")} className={control}>
                <option value="">강원 전체</option>
                {REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>
            <span className="hidden h-8 w-px bg-soil-200 md:block" aria-hidden="true" />
            <Field icon={<CalendarDays className="size-5" />} label="언제">
              <input type="date" value={date} min={relDate(1)} onChange={(e) => setDate(e.target.value)} className={control} />
            </Field>
            <span className="hidden h-8 w-px bg-soil-200 md:block" aria-hidden="true" />
            <Field icon={<Users className="size-5" />} label="몇 명">
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={control}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}명
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-grass-600 px-6 font-semibold text-white transition hover:bg-grass-700 md:size-14 md:px-0"
              aria-label="마당 찾기"
            >
              <Search className="size-5" />
              <span className="md:sr-only">마당 찾기</span>
            </button>
          </form>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => go(nextWeekday(6))}
              className="rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
            >
              이번 주말 빈 마당
            </button>
            <button
              type="button"
              onClick={() => router.push("/search?verified=1")}
              className="rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
            >
              인증 마당지기만
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
