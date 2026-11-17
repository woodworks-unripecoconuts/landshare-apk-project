import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SLOGAN, NO_FEE_NOTICE } from "@/data/policies";
import { SPACE_TYPES } from "@/data/space-types";
import { SearchBar } from "@/components/search/SearchBar";
import { FeaturedSpaces } from "@/components/home/FeaturedSpaces";
import { AdSlot } from "@/components/ads/AdSlot";
import { LinkButton } from "@/components/ui/Button";

const STEPS = [
  { emoji: "🏡", title: "마당지기가 마당을 올려요", desc: "남는 마당·농지를 무료로 나눠요. 돈은 받지 않아요." },
  { emoji: "🎒", title: "마당손님이 마당 신청", desc: "날짜와 인원을 골라 신청하고 인사말을 남겨요." },
  { emoji: "🤝", title: "승인되면 정확한 주소 공개", desc: "메시지로 이야기 나누고, 다녀와서 마당 일기를 남겨요." },
];

export default function HomePage() {
  return (
    <div>
      {/* 첫 화면: 슬로건 + 검색 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-grass-100 via-grass-50 to-cream">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full bg-sun-200/50 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-10 md:pt-16 md:pb-14">
          <p className="text-sm font-semibold text-grass-700">강원의 남는 마당 · 무료 캠핑·차박·나들이</p>
          <h1 className="mt-2 text-[32px] leading-tight font-extrabold text-grass-900 md:text-5xl">{SLOGAN}</h1>
          <p className="mt-3 max-w-xl text-soil-700 md:text-lg">
            쓰지 않는 주택 마당과 농지를 이웃과 나눠요. 이용료는 0원, 마당공유는 광고로 운영돼요.
          </p>
          <div className="mt-6">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8">
        {/* 공간 유형 바로가기 */}
        <section aria-labelledby="types-title">
          <h2 id="types-title" className="text-xl font-bold">
            어떻게 쉬고 싶나요?
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {SPACE_TYPES.map((t) => (
              <Link
                key={t.key}
                href={`/search?type=${t.key}`}
                className="flex flex-col items-center gap-1 rounded-2xl border border-soil-200/70 bg-white p-4 text-center shadow-soft hover:border-grass-400 sm:flex-row sm:gap-3 sm:text-left"
              >
                <span className="text-3xl" aria-hidden="true">
                  {t.emoji}
                </span>
                <span>
                  <span className="block font-bold text-grass-800">{t.label}</span>
                  <span className="hidden text-sm text-soil-600 sm:block">{t.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 추천 마당 */}
        <section aria-labelledby="featured-title">
          <div className="flex items-end justify-between">
            <h2 id="featured-title" className="text-xl font-bold">
              추천 마당
            </h2>
            <Link href="/search" className="flex items-center gap-1 text-sm font-semibold text-grass-700">
              전체 보기 <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-4">
            <FeaturedSpaces />
          </div>
        </section>

        <AdSlot slot="home-mid" />

        {/* 이용 방법 */}
        <section aria-labelledby="how-title">
          <h2 id="how-title" className="text-xl font-bold">
            이렇게 이용해요
          </h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl bg-white p-5 shadow-soft">
                <p className="text-3xl" aria-hidden="true">
                  {s.emoji}
                </p>
                <p className="mt-2 font-bold">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1 text-sm text-soil-600">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 마당지기 모집 */}
        <section className="rounded-3xl bg-grass-700 px-6 py-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">남는 마당이 있나요?</h2>
            <p className="mt-1 text-grass-100">텐트 한 동 자리면 충분해요. 마당지기가 되어 쉼터를 나눠 주세요.</p>
            <p className="mt-2 text-sm font-semibold text-sun-200">{NO_FEE_NOTICE}</p>
          </div>
          <LinkButton href="/host/new" variant="secondary" size="lg" className="mt-4 md:mt-0">
            마당 등록하기
          </LinkButton>
        </section>
      </div>
    </div>
  );
}
