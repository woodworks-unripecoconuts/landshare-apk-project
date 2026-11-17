/**
 * 마당 등록 폼의 '작성 중' 데이터 모양과 단계별 검사 규칙.
 */
import type { AmenityKey, DateString, LandType, LatLng, RegionCode, Space, SpacePrivate, SpaceType } from "@/lib/domain/types";
import type { SpaceInput } from "@/lib/repository";
import { LEGAL_NOTICES, type LegalNoticeId } from "@/data/legal-notices";
import { getRegion, isInsideGangwon } from "@/data/regions";
import { forcesNearForest, sanitizeAmenities } from "@/lib/domain/space-rules";

export interface RegisterDraft {
  // ① 기본 정보
  title: string;
  description: string;
  type: SpaceType;
  maxGuests: number;
  maxVehicles: number;
  // ② 위치
  regionCode: RegionCode | "";
  neighborhood: string;
  address: string;
  exactLocation: LatLng | null;
  landType: LandType | "";
  /** 산림에서 100m 이내인지 (null = 아직 답 안 함) */
  nearForest: boolean | null;
  // ③ 사진
  photos: string[];
  // ④ 편의시설
  amenities: AmenityKey[];
  // ⑤ 규칙·시간·날짜
  rules: string[];
  checkInTime: string;
  checkOutTime: string;
  availableDates: DateString[];
  // ⑥ 법령 확인
  legalChecks: Partial<Record<LegalNoticeId, boolean>>;
}

export const STEP_TITLES = ["기본 정보", "위치", "사진", "편의시설", "규칙·날짜", "법령 확인", "미리보기"] as const;

export function emptyDraft(): RegisterDraft {
  return {
    title: "",
    description: "",
    type: "camping",
    maxGuests: 4,
    maxVehicles: 1,
    regionCode: "",
    neighborhood: "",
    address: "",
    exactLocation: null,
    landType: "",
    nearForest: null,
    photos: [],
    amenities: [],
    rules: ["쓰레기는 음식물까지 모두 되가져가 주세요", "밤 10시 이후에는 조용히 해 주세요"],
    checkInTime: "14:00",
    checkOutTime: "11:00",
    availableDates: [],
    legalChecks: {},
  };
}

/** 이미 등록한 마당을 고칠 때: 저장된 값으로 채우고, 법령 확인은 다시 받습니다. */
export function draftFromSpace(space: Space, priv: SpacePrivate | null): RegisterDraft {
  return {
    title: space.title,
    description: space.description,
    type: space.type,
    maxGuests: space.maxGuests,
    maxVehicles: space.maxVehicles,
    regionCode: space.regionCode,
    neighborhood: space.neighborhood,
    address: priv?.address ?? "",
    exactLocation: priv?.exactLocation ?? null,
    landType: space.landType,
    nearForest: space.nearForest,
    photos: space.photos,
    amenities: space.amenities,
    rules: space.rules,
    checkInTime: space.checkInTime,
    checkOutTime: space.checkOutTime,
    availableDates: space.availableDates,
    legalChecks: {},
  };
}

/** 두 좌표 사이 거리(km) — 대략 계산 */
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** 각 단계에서 아직 안 된 것들 (비어 있으면 다음으로 갈 수 있음) */
export function stepProblems(step: number, d: RegisterDraft): string[] {
  const p: string[] = [];
  switch (step) {
    case 0:
      if (d.title.trim().length < 4) p.push("제목을 4자 이상 써 주세요.");
      if (d.title.trim().length > 40) p.push("제목은 40자까지 쓸 수 있어요.");
      if (d.description.trim().length < 20) p.push("마당 소개를 20자 이상 써 주세요.");
      if (d.maxGuests < 1 || d.maxGuests > 20) p.push("수용 인원은 1~20명이에요.");
      if (d.maxVehicles < 0 || d.maxVehicles > 10) p.push("차량은 0~10대예요.");
      break;
    case 1:
      if (!d.regionCode) p.push("시·군을 골라 주세요.");
      if (!d.neighborhood.trim()) p.push("동네 이름(읍·면·동·리)을 써 주세요.");
      if (!d.address.trim()) p.push("상세 주소를 써 주세요. (승인된 마당손님에게만 공개)");
      if (!d.exactLocation) p.push("지도를 눌러 마당 위치를 찍어 주세요.");
      else if (!isInsideGangwon(d.exactLocation.lat, d.exactLocation.lng)) p.push("강원 지역 안을 찍어 주세요.");
      if (!d.landType) p.push("토지 종류를 골라 주세요.");
      if (d.nearForest === null) p.push("산림에서 100m 이내인지 골라 주세요.");
      break;
    case 4:
      if (d.rules.filter((r) => r.trim()).length === 0) p.push("이용 규칙을 1개 이상 넣어 주세요.");
      if (!d.checkInTime || !d.checkOutTime) p.push("체크인·체크아웃 시간을 정해 주세요.");
      if (d.availableDates.length === 0) p.push("신청 가능한 날짜를 달력에서 1개 이상 골라 주세요.");
      break;
    case 5:
      if (LEGAL_NOTICES.some((n) => !d.legalChecks[n.id])) p.push("법령 안내 항목을 모두 확인하고 체크해 주세요.");
      break;
  }
  return p;
}

/** 위치가 고른 시·군 중심에서 너무 멀면 알려 주기 (막지는 않음) */
export function regionDistanceWarning(d: RegisterDraft): string | null {
  if (!d.regionCode || !d.exactLocation) return null;
  const km = distanceKm(getRegion(d.regionCode).center, d.exactLocation);
  return km > 35 ? `고른 시·군(${getRegion(d.regionCode).name}) 중심에서 ${Math.round(km)}km 떨어져 있어요. 위치가 맞는지 확인해 주세요.` : null;
}

export function effectiveNearForest(d: RegisterDraft): boolean {
  return d.landType !== "" && forcesNearForest(d.landType) ? true : !!d.nearForest;
}

/** 완성된 작성 내용 → 저장소에 넘길 입력 */
export function draftToInput(d: RegisterDraft): SpaceInput {
  const nearForest = effectiveNearForest(d);
  return {
    title: d.title,
    description: d.description,
    type: d.type,
    regionCode: d.regionCode as RegionCode,
    neighborhood: d.neighborhood,
    landType: (d.landType || "other") as LandType,
    nearForest,
    maxGuests: d.maxGuests,
    maxVehicles: d.maxVehicles,
    amenities: sanitizeAmenities(d.amenities, nearForest),
    rules: d.rules,
    checkInTime: d.checkInTime,
    checkOutTime: d.checkOutTime,
    availableDates: d.availableDates,
    photos: d.photos,
    legalCheckedIds: LEGAL_NOTICES.filter((n) => d.legalChecks[n.id]).map((n) => n.id),
    address: d.address,
    exactLocation: d.exactLocation!,
  };
}
