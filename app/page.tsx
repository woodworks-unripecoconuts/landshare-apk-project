import { Check, HandHeart, Lock, MapPinned } from "lucide-react";
import { NO_FEE_NOTICE } from "@/data/policies";
import { HOST_CTA_IMAGE, HOST_STORY_IMAGE } from "@/data/images";
import { HeroSearch } from "@/components/home/HeroSearch";
import { CategoryRail } from "@/components/home/CategoryRail";
import { HomeSections } from "@/components/home/HomeSections";
import { LinkButton } from "@/components/ui/Button";
import { SpaceImage } from "@/components/space/SpaceImage";

const TRUST = [
  { icon: HandHeart, title: "이용료 0원", desc: "모든 마당은 무료, 광고로 운영돼요" },
  { icon: MapPinned, title: "강원 18개 시·군", desc: "춘천부터 양양까지 동네 마당" },
  { icon: Lock, title: "승인 후 주소 공개", desc: "그 전엔 동네 단위로만 보여요" },
];

const STEPS = [
  { title: "마당 찾기", desc: "지역·날짜·인원으로 마음에 드는 마당을 골라요." },
  { title: "마당 신청", desc: "인사말과 함께 신청하면 마당지기가 확인해요." },
  { title: "승인 후 출발", desc: "정확한 주소를 받고, 다녀와서 마당 일기를 남겨요." },
];

export default function HomePage() {
  return (
    <div>
      <HeroSearch />
      <CategoryRail />

      {/* 신뢰 포인트 (Campspace 첫 화면 아래 구성 참고) */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-3">
        {TRUST.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-grass-50 text-grass-700">
              <Icon className="size-5" />
            </span>
            <span>
              <span className="block font-bold">{title}</span>
              <span className="block text-sm text-soil-500">{desc}</span>
            </span>
          </div>
        ))}
      </section>

      <div className="mt-6 md:mt-10">
        <HomeSections />
      </div>

      {/* 마당지기 이야기 (Campspace 에디토리얼 구성 참고) */}
      <section className="mx-auto mt-20 grid max-w-6xl items-center gap-8 px-4 md:mt-28 md:grid-cols-2 md:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-soil-100">
          <SpaceImage src={HOST_STORY_IMAGE} alt="마당 풍경" sizes="(max-width: 768px) 100vw, 560px" />
        </div>
        <div>
          <p className="text-sm font-bold text-sun-600">마당지기 이야기 · 데모</p>
          <blockquote className="mt-3 text-2xl leading-snug font-bold tracking-tight md:text-3xl">
            &ldquo;쓰지 않던 마당에 텐트 한 동.
            <br />
            주말마다 새로운 이웃이 생겼어요.&rdquo;
          </blockquote>
          <p className="mt-4 text-soil-600">
            마당공유는 돈을 주고받지 않아요. 남는 공간을 나누고, 손님은 깨끗이 쓰고 쓰레기를 가져가요. 그 약속만으로
            충분한 쉼터가 됩니다.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-soil-700">
            {["가격 입력 없이 무료로 등록", "승인한 손님에게만 정확한 주소 공개", "등록 전 법령 안내로 안전하게"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-4 text-grass-600" /> {t}
              </li>
            ))}
          </ul>
          <LinkButton href="/host/new" className="mt-7 rounded-full px-6">
            마당지기 되기
          </LinkButton>
        </div>
      </section>

      {/* 이용 방법 */}
      <section className="mt-20 bg-cream py-16 md:mt-28">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">이렇게 이용해요</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-t-2 border-ink pt-5">
                <p className="text-sm font-bold text-soil-400">0{i + 1}</p>
                <p className="mt-1 text-lg font-bold">{s.title}</p>
                <p className="mt-1 text-soil-600">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 마당지기 모집 배너 */}
      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-grass-800">
          <SpaceImage src={HOST_CTA_IMAGE} alt="" sizes="100vw" className="opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-grass-900/90 via-grass-900/60 to-transparent" />
          <div className="relative max-w-lg px-6 py-12 text-white md:px-12 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">남는 마당이 있나요?</h2>
            <p className="mt-2 text-white/85">텐트 한 동 자리면 충분해요. 마당지기가 되어 쉼터를 나눠 주세요.</p>
            <p className="mt-2 text-sm font-semibold text-sun-200">{NO_FEE_NOTICE}</p>
            <LinkButton href="/host/new" variant="secondary" size="lg" className="mt-6 rounded-full bg-white px-6 text-ink hover:bg-soil-100">
              마당 등록하기
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
