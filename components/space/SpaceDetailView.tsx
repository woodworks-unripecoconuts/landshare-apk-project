"use client";

/**
 * 마당 상세 내용(보여 주기 전용).
 * 상세 페이지와 마당 등록 7단계 '미리보기'가 같은 화면을 씁니다.
 * 데스크톱: 제목 → 사진 격자 → [본문 | 오른쪽 고정 카드(aside)]
 * 모바일: 사진 슬라이드 → 제목 → 본문
 */
import { Car, Clock, Lock, LockOpen, Sprout, Star, Users } from "lucide-react";
import type { Space, SpacePrivate, User } from "@/lib/domain/types";
import type { DiaryWithAuthor } from "@/lib/repository";
import { getRegion } from "@/data/regions";
import { landTypeLabel } from "@/data/amenities";
import { spaceTypeLabel } from "@/data/space-types";
import { NO_FEE_NOTICE } from "@/data/policies";
import { PhotoSlider } from "./PhotoSlider";
import { PhotoGallery } from "./PhotoGallery";
import { AmenityList } from "./AmenityList";
import { HostProfile } from "./HostProfile";
import { LegalSummary } from "./LegalSummary";
import { DiaryList } from "./DiaryList";
import { FireBadge, FreeBadge, HostVerifyBadge, SpaceTypeBadge } from "./SpaceBadges";
import { Calendar } from "@/components/ui/Calendar";
import { ApproxLocationMap } from "@/components/map";
import { cn } from "@/lib/utils/cn";

export interface SpaceDetailViewProps {
  space: Space;
  host: User | null;
  hostVerified: boolean;
  ratingAvg: number | null;
  ratingCount: number;
  diaries?: DiaryWithAuthor[];
  privateInfo?: SpacePrivate | null;
  takenDates?: string[];
  preview?: boolean;
  /** 데스크톱 오른쪽에 고정되는 카드 (신청 버튼 등) */
  aside?: React.ReactNode;
  /** 본문 맨 아래에 붙일 내용 (광고, 신고 등) */
  footer?: React.ReactNode;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-soil-200/80 py-8">
      <h2 className="mb-4 text-xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function SpaceDetailView({
  space,
  host,
  hostVerified,
  ratingAvg,
  ratingCount,
  diaries,
  privateInfo,
  takenDates = [],
  preview,
  aside,
  footer,
}: SpaceDetailViewProps) {
  const region = getRegion(space.regionCode);

  const facts = [
    { icon: Users, label: "최대 인원", value: `${space.maxGuests}명` },
    { icon: Car, label: "차량", value: `${space.maxVehicles}대` },
    {
      icon: Clock,
      label: space.type === "picnic" ? "이용 시간" : "체크인 / 아웃",
      value: `${space.checkInTime} ~ ${space.checkOutTime}`,
    },
    { icon: Sprout, label: "토지 종류", value: landTypeLabel(space.landType) },
  ];

  return (
    <article>
      {/* 모바일: 사진 슬라이드 */}
      <div className="md:hidden">
        <PhotoSlider photos={space.photos} title={space.title} />
      </div>

      <div className={cn("mx-auto px-4", !preview && "max-w-6xl")}>
        {/* 제목 */}
        <header className="pt-5 md:pt-8">
          <div className="flex flex-wrap items-center gap-1.5">
            <SpaceTypeBadge type={space.type} />
            <FreeBadge />
            <HostVerifyBadge verified={hostVerified} />
            <FireBadge space={space} />
          </div>
          <h1 className="mt-3 text-[26px] leading-tight font-bold tracking-tight md:text-[34px]">{space.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-soil-600">
            {ratingAvg != null ? (
              <span className="flex items-center gap-1 font-semibold text-ink">
                <Star className="size-4 fill-ink text-ink" /> {ratingAvg.toFixed(1)}
                <span className="font-normal text-soil-500 underline underline-offset-2">마당 일기 {ratingCount}개</span>
              </span>
            ) : (
              !preview && <span>아직 마당 일기 없음</span>
            )}
            <span aria-hidden="true">·</span>
            <span>
              강원 {region.name} {space.neighborhood}
            </span>
            <span aria-hidden="true">·</span>
            <span>{spaceTypeLabel(space.type)}</span>
          </p>
        </header>

        {/* 데스크톱: 사진 격자 */}
        <div className="mt-6 hidden md:block">
          <PhotoGallery photos={space.photos} title={space.title} />
        </div>

        <div className={cn("mt-6 md:mt-10", !!aside && "lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16")}>
          <div className="min-w-0">
            {/* 한눈에 보기 */}
            <ul className="grid grid-cols-2 overflow-hidden rounded-2xl border border-soil-200/80 sm:grid-cols-4">
              {facts.map(({ icon: Icon, label, value }, i) => (
                <li
                  key={label}
                  className={cn(
                    "p-4",
                    i % 2 === 1 && "border-l border-soil-200/80",
                    i >= 2 && "border-t border-soil-200/80 sm:border-t-0",
                    i === 2 && "sm:border-l",
                  )}
                >
                  <Icon className="size-5 text-grass-600" />
                  <p className="mt-2 text-xs text-soil-500">{label}</p>
                  <p className="font-semibold">{value}</p>
                </li>
              ))}
            </ul>

            <p className="mt-5 rounded-2xl bg-grass-50 px-4 py-3 text-sm font-semibold text-grass-800">
              이용료 0원 · {NO_FEE_NOTICE}
            </p>

            <div className="mt-8">
              <Section title="마당 소개">
                <p className="text-[15px] leading-7 whitespace-pre-line text-soil-800">
                  {space.description || "소개 글이 없어요."}
                </p>
              </Section>

              <Section title="마당지기">
                <HostProfile host={host} verified={hostVerified} />
              </Section>

              <Section title="편의시설">
                <AmenityList space={space} />
                {space.nearForest && (
                  <p className="mt-3 text-sm text-red-700">
                    이 마당은 산림 또는 산림에서 100m 이내라 불을 피울 수 없어요. (산림재난방지법)
                  </p>
                )}
              </Section>

              <Section title="이용 규칙">
                <ul className="space-y-2.5">
                  {space.rules.map((r, i) => (
                    <li key={i} className="flex gap-3 text-[15px] text-soil-800">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-grass-600" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="신청 가능 날짜">
                <div className="max-w-sm">
                  <Calendar mode="view" available={space.availableDates} taken={takenDates} />
                </div>
              </Section>

              <Section title="위치">
                <div className="h-72 overflow-hidden rounded-3xl">
                  <ApproxLocationMap
                    approxCenter={space.approxCenter}
                    radiusM={space.approxRadiusM}
                    type={space.type}
                    exact={privateInfo?.exactLocation}
                  />
                </div>
                {privateInfo ? (
                  <p className="mt-3 flex items-start gap-2 rounded-2xl bg-grass-50 p-3 text-sm text-grass-900">
                    <LockOpen className="mt-0.5 size-4 shrink-0" />
                    <span>
                      <b>정확한 주소</b>: {privateInfo.address}
                    </span>
                  </p>
                ) : (
                  <p className="mt-3 flex items-start gap-2 text-sm text-soil-600">
                    <Lock className="mt-0.5 size-4 shrink-0" />
                    {region.name} {space.neighborhood} 근처(동네 단위 원)예요. 정확한 주소는 마당 신청이 승인된 뒤에
                    공개돼요.
                  </p>
                )}
              </Section>

              {!preview && (
                <Section title={ratingAvg != null ? `★ ${ratingAvg.toFixed(1)} · 마당 일기 ${ratingCount}개` : "마당 일기"}>
                  {diaries ? <DiaryList items={diaries} /> : <div className="h-24 animate-pulse rounded-2xl bg-soil-100" />}
                </Section>
              )}

              <Section title="꼭 알아 두세요">
                <LegalSummary />
              </Section>

              {footer && <div className="space-y-6 border-t border-soil-200/80 pt-8">{footer}</div>}
            </div>
          </div>

          {aside && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">{aside}</div>
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
