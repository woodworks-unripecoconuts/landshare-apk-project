"use client";

/**
 * 마당 상세 내용(보여 주기 전용).
 * 상세 페이지와 마당 등록 7단계 '미리보기'가 같은 화면을 씁니다.
 */
import { Car, Clock, Lock, MapPin, Star, Users, Sprout, LockOpen } from "lucide-react";
import type { Space, SpacePrivate, User } from "@/lib/domain/types";
import type { DiaryWithAuthor } from "@/lib/repository";
import { getRegion } from "@/data/regions";
import { landTypeLabel } from "@/data/amenities";
import { NO_FEE_NOTICE } from "@/data/policies";
import { PhotoSlider } from "./PhotoSlider";
import { AmenityList } from "./AmenityList";
import { HostProfile } from "./HostProfile";
import { LegalSummary } from "./LegalSummary";
import { DiaryList } from "./DiaryList";
import { FireBadge, FreeBadge, HostVerifyBadge, SpaceTypeBadge } from "./SpaceBadges";
import { Calendar } from "@/components/ui/Calendar";
import { ApproxLocationMap } from "@/components/map";

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
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-soil-200/70 pt-6">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
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
}: SpaceDetailViewProps) {
  const region = getRegion(space.regionCode);

  return (
    <article>
      <PhotoSlider photos={space.photos} title={space.title} />

      <div className="space-y-6 px-4 pt-5 md:px-0">
        {/* 제목 */}
        <header>
          <div className="flex flex-wrap items-center gap-1.5">
            <SpaceTypeBadge type={space.type} />
            <FreeBadge />
            <HostVerifyBadge verified={hostVerified} />
            <FireBadge space={space} />
          </div>
          <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">{space.title}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-soil-700">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" /> 강원 {region.name} {space.neighborhood}
            </span>
            {ratingAvg != null ? (
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-sun-500 text-sun-500" /> {ratingAvg.toFixed(1)} · 마당 일기 {ratingCount}개
              </span>
            ) : (
              !preview && <span className="text-soil-500">아직 마당 일기 없음</span>
            )}
          </p>
          <p className="mt-3 rounded-xl bg-grass-50 px-3 py-2 text-sm font-semibold text-grass-800">
            이용료 0원 · {NO_FEE_NOTICE}
          </p>
        </header>

        {/* 기본 정보 */}
        <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <li className="rounded-xl bg-white p-3">
            <Users className="size-4 text-grass-600" />
            <p className="mt-1 text-soil-500">최대 인원</p>
            <p className="font-bold">{space.maxGuests}명</p>
          </li>
          <li className="rounded-xl bg-white p-3">
            <Car className="size-4 text-grass-600" />
            <p className="mt-1 text-soil-500">차량</p>
            <p className="font-bold">{space.maxVehicles}대</p>
          </li>
          <li className="rounded-xl bg-white p-3">
            <Clock className="size-4 text-grass-600" />
            <p className="mt-1 text-soil-500">{space.type === "picnic" ? "이용 시간" : "체크인 / 아웃"}</p>
            <p className="font-bold">
              {space.checkInTime} ~ {space.checkOutTime}
            </p>
          </li>
          <li className="rounded-xl bg-white p-3">
            <Sprout className="size-4 text-grass-600" />
            <p className="mt-1 text-soil-500">토지 종류</p>
            <p className="font-bold">{landTypeLabel(space.landType)}</p>
          </li>
        </ul>

        <Section title="마당 소개">
          <p className="text-[15px] leading-relaxed whitespace-pre-line text-soil-800">
            {space.description || "소개 글이 없어요."}
          </p>
        </Section>

        <Section title="편의시설">
          <AmenityList space={space} />
          {space.nearForest && (
            <p className="mt-2 text-sm text-red-700">
              이 마당은 산림 또는 산림에서 100m 이내라 불을 피울 수 없어요. (산림재난방지법)
            </p>
          )}
        </Section>

        <Section title="이용 규칙">
          <ul className="space-y-1.5">
            {space.rules.map((r, i) => (
              <li key={i} className="flex gap-2 text-[15px] text-soil-800">
                <span className="text-grass-600">•</span> {r}
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
          <div className="h-64 overflow-hidden rounded-2xl">
            <ApproxLocationMap
              approxCenter={space.approxCenter}
              radiusM={space.approxRadiusM}
              type={space.type}
              exact={privateInfo?.exactLocation}
            />
          </div>
          {privateInfo ? (
            <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-grass-50 p-3 text-sm text-grass-900">
              <LockOpen className="mt-0.5 size-4 shrink-0" />
              <span>
                <b>정확한 주소</b>: {privateInfo.address}
              </span>
            </p>
          ) : (
            <p className="mt-2 flex items-start gap-1.5 text-sm text-soil-600">
              <Lock className="mt-0.5 size-4 shrink-0" />
              {region.name} {space.neighborhood} 근처(동네 단위 원)예요. 정확한 주소는 마당 신청이 승인된 뒤에 공개돼요.
            </p>
          )}
        </Section>

        <Section title="마당지기">
          <HostProfile host={host} verified={hostVerified} />
        </Section>

        {!preview && (
          <Section title={`마당 일기${ratingCount ? ` ${ratingCount}` : ""}`}>
            {diaries ? <DiaryList items={diaries} /> : <div className="h-24 animate-pulse rounded-2xl bg-soil-100" />}
          </Section>
        )}

        <Section title="꼭 알아 두세요">
          <LegalSummary />
        </Section>
      </div>
    </article>
  );
}
