"use client";

/** 메인의 데이터 영역: 이번 주말 / 인증 마당지기 / 반려동물 줄 + 지역 타일 */
import Link from "next/link";
import { repo } from "@/lib/repository";
import { useRepoQuery } from "@/lib/hooks/useRepoQuery";
import { nextWeekday, formatDate } from "@/lib/domain/dates";
import { REGIONS } from "@/data/regions";
import { naturePhoto } from "@/data/images";
import { SpaceImage } from "@/components/space/SpaceImage";
import { AdSlot } from "@/components/ads/AdSlot";
import { SpaceRow } from "./SpaceRow";

const WATCH = ["spaces", "bookings", "diaries", "users"] as const;

export function HomeSections() {
  const all = useRepoQuery(() => repo.spaces.search(), [], [...WATCH]);
  const weekend = useRepoQuery(
    async () => {
      const date = nextWeekday(6);
      return { date, items: await repo.spaces.search({ date }) };
    },
    [],
    [...WATCH],
  );

  const list = all.data ?? [];
  const byRating = (a: (typeof list)[number], b: (typeof list)[number]) =>
    (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0) || b.ratingCount - a.ratingCount;
  const verified = list.filter((i) => i.hostVerified).sort(byRating);
  const pets = list.filter((i) => i.space.amenities.includes("pets")).sort(byRating);
  const counts = new Map<string, number>();
  list.forEach((i) => counts.set(i.space.regionCode, (counts.get(i.space.regionCode) ?? 0) + 1));

  return (
    <div className="space-y-14 md:space-y-20">
      <SpaceRow
        title="이번 주말 비어 있는 마당"
        subtitle={weekend.data ? `${formatDate(weekend.data.date)} 체크인 가능` : undefined}
        items={weekend.data?.items ?? []}
        loading={weekend.loading}
        moreHref={weekend.data ? `/search?date=${weekend.data.date}` : "/search"}
      />

      <SpaceRow
        title="인증 마당지기의 마당"
        subtitle="본인 인증과 토지·주택 소유 확인을 마친 마당지기예요"
        items={verified}
        loading={all.loading}
        moreHref="/search?verified=1"
      />

      <div className="mx-auto max-w-6xl px-4">
        <AdSlot slot="home-mid" />
      </div>

      {/* 지역별 둘러보기 (Nomady·Hipcamp 지역 페이지 참고) */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">강원 어디로 떠날까요?</h2>
        <p className="mt-1 text-sm text-soil-500">18개 시·군, 동네 마당을 둘러보세요</p>
        <ul className="no-scrollbar -mx-4 mt-5 flex snap-x gap-3 overflow-x-auto scroll-px-4 px-4 pb-2">
          {REGIONS.map((r, i) => (
            <li key={r.code} className="w-36 shrink-0 snap-start md:w-44">
              <Link href={`/search?region=${r.code}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-soil-100">
                  <SpaceImage
                    src={naturePhoto(i * 7 + 3, 400, 540)}
                    alt=""
                    sizes="180px"
                    className="transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  <div className="absolute inset-x-3 bottom-3 text-white">
                    <p className="text-lg font-bold">{r.shortName}</p>
                    <p className="text-xs text-white/80">마당 {counts.get(r.code) ?? 0}곳</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SpaceRow
        title="반려동물과 함께"
        subtitle="강아지와 같이 가도 되는 마당"
        items={pets}
        loading={all.loading}
        moreHref="/search?amenities=pets"
      />
    </div>
  );
}
