"use client";

/** 메인 화면 검색창: 시·군 / 날짜 / 인원 → 찾기 화면으로 이동 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { REGIONS } from "@/data/regions";
import type { RegionCode } from "@/lib/domain/types";
import { relDate } from "@/lib/domain/dates";
import { filterToQuery } from "@/lib/utils/search-query";
import { Button } from "@/components/ui/Button";

export function SearchBar() {
  const router = useRouter();
  const [region, setRegion] = useState<RegionCode | "">("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      "/search" + filterToQuery({ regionCode: region || undefined, date: date || undefined, guests: guests || undefined }),
    );
  }

  const field = "flex items-center gap-2 rounded-xl border border-soil-200 bg-white px-3 h-12";
  return (
    <form onSubmit={submit} className="grid gap-2 rounded-2xl bg-white/80 p-3 shadow-soft backdrop-blur sm:grid-cols-[1.2fr_1fr_0.8fr_auto]">
      <label className={field}>
        <MapPin className="size-5 shrink-0 text-grass-600" />
        <span className="sr-only">시·군</span>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as RegionCode | "")}
          className="w-full bg-transparent text-[15px] outline-none"
        >
          <option value="">강원 전체</option>
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      <label className={field}>
        <CalendarDays className="size-5 shrink-0 text-grass-600" />
        <span className="sr-only">날짜</span>
        <input
          type="date"
          value={date}
          min={relDate(1)}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-transparent text-[15px] outline-none"
        />
      </label>
      <label className={field}>
        <Users className="size-5 shrink-0 text-grass-600" />
        <span className="sr-only">인원</span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full bg-transparent text-[15px] outline-none"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}명
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" size="lg" className="h-12">
        <Search className="size-5" /> 마당 찾기
      </Button>
    </form>
  );
}
