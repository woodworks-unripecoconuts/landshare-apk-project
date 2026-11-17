import type { Region, RegionCode } from "@/lib/domain/types";

/**
 * 마당공유 서비스 지역: 강원특별자치도 18개 시·군
 * 공간 등록·검색에서 고를 수 있는 지역은 이 목록뿐입니다.
 * center = 시·군청 근처 대략 좌표 (지도 처음 위치용)
 */
export const SERVICE_PROVINCE = "강원특별자치도";

export const REGIONS: Region[] = [
  { code: "chuncheon", name: "춘천시", shortName: "춘천", center: { lat: 37.8813, lng: 127.7298 }, zoom: 11 },
  { code: "wonju", name: "원주시", shortName: "원주", center: { lat: 37.3422, lng: 127.9202 }, zoom: 11 },
  { code: "gangneung", name: "강릉시", shortName: "강릉", center: { lat: 37.7519, lng: 128.8761 }, zoom: 11 },
  { code: "donghae", name: "동해시", shortName: "동해", center: { lat: 37.5247, lng: 129.1143 }, zoom: 12 },
  { code: "taebaek", name: "태백시", shortName: "태백", center: { lat: 37.1641, lng: 128.9856 }, zoom: 12 },
  { code: "sokcho", name: "속초시", shortName: "속초", center: { lat: 38.207, lng: 128.5918 }, zoom: 12 },
  { code: "samcheok", name: "삼척시", shortName: "삼척", center: { lat: 37.45, lng: 129.165 }, zoom: 11 },
  { code: "hongcheon", name: "홍천군", shortName: "홍천", center: { lat: 37.697, lng: 127.8886 }, zoom: 10 },
  { code: "hoengseong", name: "횡성군", shortName: "횡성", center: { lat: 37.4917, lng: 127.985 }, zoom: 11 },
  { code: "yeongwol", name: "영월군", shortName: "영월", center: { lat: 37.1837, lng: 128.4617 }, zoom: 11 },
  { code: "pyeongchang", name: "평창군", shortName: "평창", center: { lat: 37.3707, lng: 128.39 }, zoom: 10 },
  { code: "jeongseon", name: "정선군", shortName: "정선", center: { lat: 37.3807, lng: 128.6608 }, zoom: 11 },
  { code: "cheorwon", name: "철원군", shortName: "철원", center: { lat: 38.1466, lng: 127.3132 }, zoom: 11 },
  { code: "hwacheon", name: "화천군", shortName: "화천", center: { lat: 38.1062, lng: 127.7082 }, zoom: 11 },
  { code: "yanggu", name: "양구군", shortName: "양구", center: { lat: 38.11, lng: 127.9898 }, zoom: 11 },
  { code: "inje", name: "인제군", shortName: "인제", center: { lat: 38.0697, lng: 128.1707 }, zoom: 10 },
  { code: "goseong", name: "고성군", shortName: "고성", center: { lat: 38.3806, lng: 128.4679 }, zoom: 11 },
  { code: "yangyang", name: "양양군", shortName: "양양", center: { lat: 38.0754, lng: 128.619 }, zoom: 11 },
];

/** 강원 전체를 보여줄 때의 지도 중심/줌 */
export const GANGWON_CENTER = { lat: 37.75, lng: 128.25 };
export const GANGWON_ZOOM = 8;

/** 강원 대략 범위 — 등록 시 지도에서 찍은 위치가 강원 안인지 확인할 때 사용 */
export const GANGWON_BOUNDS = { south: 36.95, north: 38.65, west: 127.0, east: 129.4 };

const REGION_MAP = new Map(REGIONS.map((r) => [r.code, r]));

export function getRegion(code: RegionCode): Region {
  return REGION_MAP.get(code)!;
}

export function isRegionCode(v: string | null | undefined): v is RegionCode {
  return !!v && REGION_MAP.has(v as RegionCode);
}

export function isInsideGangwon(lat: number, lng: number): boolean {
  const b = GANGWON_BOUNDS;
  return lat >= b.south && lat <= b.north && lng >= b.west && lng <= b.east;
}
