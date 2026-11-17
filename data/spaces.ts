/**
 * 가짜 마당(공간) 20개 — 강원 18개 시·군에 골고루 (춘천·강릉은 2개씩)
 *
 * - 주소는 모두 "(가상 주소)"이며 실제 사람·집과 관계없습니다.
 * - 사진은 무료 placeholder 자연 사진(picsum.photos, data/images.ts)이라 실제 마당 사진과 다릅니다.
 * - 신청 가능 날짜는 "오늘 기준"으로 만들어져 언제 열어도 데모가 동작합니다.
 */
import type { AmenityKey, LandType, LatLng, RegionCode, Space, SpacePrivate, SpaceType } from "@/lib/domain/types";
import { relDateTime, upcomingDates } from "@/lib/domain/dates";
import { APPROX_RADIUS_M, makeApproxCenter, sanitizeAmenities } from "@/lib/domain/space-rules";
import { LEGAL_NOTICES } from "./legal-notices";
import { getRegion } from "./regions";
import { DEMO_HOST_ID } from "./users";
import { naturePhoto } from "./images";

type Availability = "weekends" | "everyday" | "weekdays" | "alternate";

interface SpaceSeedInput {
  id: string;
  hostId: string;
  title: string;
  description: string;
  type: SpaceType;
  regionCode: RegionCode;
  neighborhood: string;
  exact: LatLng;
  landType: LandType;
  nearForest: boolean;
  maxGuests: number;
  maxVehicles: number;
  amenities: AmenityKey[];
  rules: string[];
  availability: Availability;
  photoCount: number;
  createdDaysAgo: number;
}

const TIMES: Record<SpaceType, { checkInTime: string; checkOutTime: string }> = {
  camping: { checkInTime: "14:00", checkOutTime: "11:00" },
  carcamp: { checkInTime: "17:00", checkOutTime: "10:00" },
  picnic: { checkInTime: "10:00", checkOutTime: "18:00" },
};

function availableDatesFor(a: Availability) {
  switch (a) {
    case "weekends":
      return upcomingDates(75, (wd) => wd === 5 || wd === 6 || wd === 0, 1);
    case "everyday":
      return upcomingDates(60, () => true, 1);
    case "weekdays":
      return upcomingDates(60, (wd) => wd >= 1 && wd <= 4, 1);
    case "alternate":
      return upcomingDates(70, (_wd, i) => i % 2 === 0, 1);
  }
}

/** 마당마다 서로 다른 자연 사진을 n장 고릅니다. */
const photos = (spaceIndex: number, n: number) =>
  Array.from({ length: n }, (_, i) => naturePhoto(spaceIndex * 3 + i * 5));

const BASE_RULES = ["쓰레기는 음식물까지 모두 되가져가 주세요", "밤 10시 이후에는 조용히 해 주세요"];

const INPUTS: SpaceSeedInput[] = [
  {
    id: "sp-01", hostId: DEMO_HOST_ID, type: "camping", regionCode: "chuncheon", neighborhood: "동산면 원창리",
    title: "동산면 잔디 마당 캠핑", exact: { lat: 37.8012, lng: 127.8195 }, landType: "house_yard", nearForest: false,
    description: "춘천 시내에서 차로 20분, 손질한 잔디 마당에 텐트 한 동을 칠 수 있어요. 저녁엔 마당 끝에서 노을이 잘 보입니다. 화장실과 개수대는 집 옆 별채를 써 주세요.",
    maxGuests: 4, maxVehicles: 1, amenities: ["toilet", "water", "electricity", "parking", "fire", "shade"],
    rules: [...BASE_RULES, "불은 지정된 화로대에서만 사용해 주세요"], availability: "weekends", photoCount: 4, createdDaysAgo: 150,
  },
  {
    id: "sp-02", hostId: "u-host-1", type: "picnic", regionCode: "chuncheon", neighborhood: "신북읍 유포리",
    title: "신북 감자밭 옆 나들이 쉼터", exact: { lat: 37.9351, lng: 127.7648 }, landType: "farmland", nearForest: false,
    description: "감자밭 옆 평평한 풀밭이에요. 돗자리 펴고 도시락 먹기 좋아요. 땅은 그대로 두고 쓰는 농지라 시설은 없지만, 큰 느티나무 그늘이 있어요.",
    maxGuests: 6, maxVehicles: 2, amenities: ["water", "parking", "shade", "pets"],
    rules: [...BASE_RULES, "마당 밖 밭·작물에는 들어가지 말아 주세요"], availability: "everyday", photoCount: 3, createdDaysAgo: 120,
  },
  {
    id: "sp-03", hostId: "u-host-2", type: "camping", regionCode: "wonju", neighborhood: "귀래면 운남리",
    title: "귀래 시골집 앞마당 캠핑", exact: { lat: 37.2248, lng: 127.8851 }, landType: "house_yard", nearForest: false,
    description: "할머니 댁 같은 시골집 앞마당이에요. 텐트 한 동 자리와 평상이 있고, 아침엔 닭 우는 소리에 깨요. 반려견도 함께 와도 됩니다.",
    maxGuests: 4, maxVehicles: 1, amenities: ["toilet", "water", "electricity", "parking", "fire", "pets"],
    rules: [...BASE_RULES, "불은 지정된 화로대에서만 사용해 주세요", "반려동물 배변은 꼭 치워 주세요"], availability: "weekends", photoCount: 4, createdDaysAgo: 200,
  },
  {
    id: "sp-04", hostId: "u-host-3", type: "carcamp", regionCode: "gangneung", neighborhood: "사천면 사천진리",
    title: "사천 바닷가 마을 차박 마당", exact: { lat: 37.8352, lng: 128.8603 }, landType: "house_yard", nearForest: false,
    description: "바다까지 걸어서 5분인 마을 안 주택 마당이에요. 차 한 대가 평평하게 설 수 있고, 아침에 파도 소리가 들려요. 화장실은 현관 옆을 써 주세요.",
    maxGuests: 2, maxVehicles: 1, amenities: ["toilet", "water", "parking"],
    rules: [...BASE_RULES, "차는 안내한 자리에만 세워 주세요"], availability: "everyday", photoCount: 3, createdDaysAgo: 180,
  },
  {
    id: "sp-05", hostId: "u-host-4", type: "camping", regionCode: "gangneung", neighborhood: "왕산면 대기리",
    title: "왕산 숲속 텐트 한 동 자리", exact: { lat: 37.6203, lng: 128.7998 }, landType: "forest", nearForest: true,
    description: "산자락 아래 숲 그늘에 텐트 한 동 자리가 있어요. 여름에도 서늘하고 밤하늘이 맑아요. 산림이라 불은 절대 사용할 수 없어요(버너 포함).",
    maxGuests: 3, maxVehicles: 1, amenities: ["toilet", "water", "parking", "shade", "pets"],
    rules: [...BASE_RULES, "불 사용 금지 — 버너·숯·화로대 모두 안 돼요"], availability: "alternate", photoCount: 3, createdDaysAgo: 60,
  },
  {
    id: "sp-06", hostId: "u-host-3", type: "carcamp", regionCode: "donghae", neighborhood: "망상동",
    title: "망상 해변 가까운 공터 차박", exact: { lat: 37.5881, lng: 129.0852 }, landType: "other", nearForest: false,
    description: "망상 해변에서 차로 3분, 집 옆 넓은 공터예요. 차 두 대까지 설 수 있어요. 화장실은 없으니 근처 공중화장실(도보 4분)을 써 주세요.",
    maxGuests: 4, maxVehicles: 2, amenities: ["parking", "water"],
    rules: [...BASE_RULES], availability: "weekends", photoCount: 3, createdDaysAgo: 140,
  },
  {
    id: "sp-07", hostId: "u-host-5", type: "picnic", regionCode: "taebaek", neighborhood: "삼수동",
    title: "태백 고원 마당 피크닉", exact: { lat: 37.2049, lng: 128.9652 }, landType: "house_yard", nearForest: true,
    description: "해발 700m 고원 마을의 넓은 마당이에요. 한여름에도 시원해서 낮 나들이에 좋아요. 뒤가 바로 산이라 불은 쓸 수 없어요.",
    maxGuests: 6, maxVehicles: 2, amenities: ["toilet", "water", "parking", "shade"],
    rules: [...BASE_RULES, "불 사용 금지 — 버너·숯·화로대 모두 안 돼요"], availability: "everyday", photoCount: 3, createdDaysAgo: 100,
  },
  {
    id: "sp-08", hostId: "u-host-6", type: "picnic", regionCode: "sokcho", neighborhood: "조양동",
    title: "속초 주택가 작은 마당 나들이", exact: { lat: 38.1898, lng: 128.5981 }, landType: "house_yard", nearForest: false,
    description: "속초 시내 주택가의 아담한 마당이에요. 해변·시장 구경 사이에 잠깐 쉬어 가기 좋아요. 콘센트가 있어 휴대폰 충전도 돼요.",
    maxGuests: 4, maxVehicles: 1, amenities: ["toilet", "water", "electricity", "shade"],
    rules: [...BASE_RULES], availability: "weekdays", photoCount: 3, createdDaysAgo: 25,
  },
  {
    id: "sp-09", hostId: "u-host-5", type: "camping", regionCode: "samcheok", neighborhood: "근덕면 교가리",
    title: "근덕 과수원 옆 캠핑 마당", exact: { lat: 37.3604, lng: 129.2251 }, landType: "farmland", nearForest: false,
    description: "사과 과수원 옆 빈 밭자리예요. 땅 모양은 그대로 두고 쓰는 농지라 평평하진 않지만, 봄엔 사과꽃이 예뻐요. 화로대는 가져오시면 지정된 자리에서만 써 주세요.",
    maxGuests: 5, maxVehicles: 2, amenities: ["toilet", "water", "parking", "fire", "pets"],
    rules: [...BASE_RULES, "마당 밖 밭·작물에는 들어가지 말아 주세요", "불은 지정된 화로대에서만 사용해 주세요"], availability: "weekends", photoCount: 4, createdDaysAgo: 130,
  },
  {
    id: "sp-10", hostId: "u-host-7", type: "camping", regionCode: "hongcheon", neighborhood: "서석면 풍암리",
    title: "서석 산골 마당 캠핑", exact: { lat: 37.7012, lng: 128.1803 }, landType: "house_yard", nearForest: false,
    description: "홍천 서석면 산골 마을의 넓은 마당이에요. 텐트 한 동과 차 한 대 자리, 전기·수도 모두 있어 처음 캠핑하는 분께 추천해요.",
    maxGuests: 4, maxVehicles: 1, amenities: ["toilet", "water", "electricity", "parking", "fire", "shade"],
    rules: [...BASE_RULES, "불은 지정된 화로대에서만 사용해 주세요"], availability: "everyday", photoCount: 4, createdDaysAgo: 110,
  },
  {
    id: "sp-11", hostId: "u-host-1", type: "carcamp", regionCode: "hoengseong", neighborhood: "갑천면 매일리",
    title: "갑천 별 보기 좋은 차박 공터", exact: { lat: 37.5502, lng: 128.0799 }, landType: "other", nearForest: false,
    description: "주변에 불빛이 거의 없어 별이 정말 잘 보여요. 차 두 대까지 설 수 있는 자갈 없는 맨땅 공터예요.",
    maxGuests: 3, maxVehicles: 2, amenities: ["parking", "toilet"],
    rules: [...BASE_RULES, "차는 안내한 자리에만 세워 주세요"], availability: "alternate", photoCount: 3, createdDaysAgo: 90,
  },
  {
    id: "sp-12", hostId: "u-host-2", type: "camping", regionCode: "yeongwol", neighborhood: "주천면 주천리",
    title: "주천 들깨밭 옆 캠핑 자리", exact: { lat: 37.2701, lng: 128.2702 }, landType: "farmland", nearForest: false,
    description: "들깨밭 옆 풀밭이에요. 시설은 수도뿐이지만 넓고 조용해요. 땅은 그대로 쓰는 농지라 말뚝은 짧은 것만 써 주세요.",
    maxGuests: 4, maxVehicles: 1, amenities: ["water", "parking", "fire", "pets"],
    rules: [...BASE_RULES, "마당 밖 밭·작물에는 들어가지 말아 주세요"], availability: "weekends", photoCount: 3, createdDaysAgo: 75,
  },
  {
    id: "sp-13", hostId: DEMO_HOST_ID, type: "camping", regionCode: "pyeongchang", neighborhood: "봉평면 무이리",
    title: "봉평 메밀꽃 마을 주택 마당", exact: { lat: 37.6198, lng: 128.3601 }, landType: "house_yard", nearForest: true,
    description: "메밀꽃 마을 안쪽의 주택 마당이에요. 가을이면 하얀 메밀꽃이 마당 앞까지 펼쳐져요. 집 뒤가 바로 숲이라 불은 쓸 수 없어요.",
    maxGuests: 4, maxVehicles: 2, amenities: ["toilet", "water", "electricity", "parking", "shade", "pets"],
    rules: [...BASE_RULES, "불 사용 금지 — 버너·숯·화로대 모두 안 돼요"], availability: "everyday", photoCount: 4, createdDaysAgo: 170,
  },
  {
    id: "sp-14", hostId: "u-host-4", type: "picnic", regionCode: "jeongseon", neighborhood: "북평면 나전리",
    title: "북평 돌담집 마당 나들이", exact: { lat: 37.4552, lng: 128.6601 }, landType: "house_yard", nearForest: true,
    description: "오래된 돌담집 마당이에요. 정선 아리랑시장 가는 길에 쉬어 가기 좋아요. 산 아래라 불은 쓸 수 없어요.",
    maxGuests: 6, maxVehicles: 2, amenities: ["toilet", "water", "shade"],
    rules: [...BASE_RULES], availability: "weekdays", photoCount: 3, createdDaysAgo: 50,
  },
  {
    id: "sp-15", hostId: "u-host-7", type: "carcamp", regionCode: "cheorwon", neighborhood: "동송읍 오덕리",
    title: "동송 들판 옆 차박 자리", exact: { lat: 38.2051, lng: 127.2149 }, landType: "farmland", nearForest: false,
    description: "끝없이 펼쳐진 철원 들판 옆이에요. 겨울엔 철새가 날아와요. 차 한 대 자리, 땅 모양은 그대로 둔 농지예요.",
    maxGuests: 2, maxVehicles: 1, amenities: ["parking", "water"],
    rules: [...BASE_RULES, "마당 밖 밭·작물에는 들어가지 말아 주세요"], availability: "everyday", photoCount: 3, createdDaysAgo: 85,
  },
  {
    id: "sp-16", hostId: "u-host-1", type: "camping", regionCode: "hwacheon", neighborhood: "사내면 광덕리",
    title: "사내 산 아래 조용한 마당", exact: { lat: 38.0701, lng: 127.5352 }, landType: "house_yard", nearForest: true,
    description: "산 아래 조용한 집 마당이에요. 새소리 말고는 들리는 게 없어요. 숲이 가까워 불은 쓸 수 없어요.",
    maxGuests: 4, maxVehicles: 1, amenities: ["toilet", "water", "electricity", "parking", "shade"],
    rules: [...BASE_RULES, "불 사용 금지 — 버너·숯·화로대 모두 안 돼요"], availability: "weekends", photoCount: 3, createdDaysAgo: 65,
  },
  {
    id: "sp-17", hostId: "u-host-2", type: "picnic", regionCode: "yanggu", neighborhood: "해안면 현리",
    title: "해안면 펀치볼 들녘 나들이", exact: { lat: 38.2848, lng: 128.1203 }, landType: "farmland", nearForest: false,
    description: "분지 지형이 한눈에 보이는 들녘 옆 풀밭이에요. 단체 나들이도 가능해요. 시설은 없고 땅은 그대로 둔 농지예요.",
    maxGuests: 8, maxVehicles: 3, amenities: ["parking", "shade", "water", "pets"],
    rules: [...BASE_RULES, "마당 밖 밭·작물에는 들어가지 말아 주세요"], availability: "everyday", photoCount: 3, createdDaysAgo: 40,
  },
  {
    id: "sp-18", hostId: "u-host-5", type: "camping", regionCode: "inje", neighborhood: "기린면 현리",
    title: "기린 숲가 텐트 마당", exact: { lat: 37.9502, lng: 128.3201 }, landType: "forest", nearForest: true,
    description: "숲 가장자리의 평평한 자리예요. 텐트 한 동만 받아요. 임야라 불은 절대 안 되고, 나무를 꺾거나 땅을 파면 안 돼요.",
    maxGuests: 3, maxVehicles: 1, amenities: ["toilet", "water", "parking", "shade"],
    rules: [...BASE_RULES, "불 사용 금지 — 버너·숯·화로대 모두 안 돼요"], availability: "alternate", photoCount: 3, createdDaysAgo: 70,
  },
  {
    id: "sp-19", hostId: "u-host-6", type: "carcamp", regionCode: "goseong", neighborhood: "거진읍 거진리",
    title: "거진 항구 마을 차박 마당", exact: { lat: 38.4452, lng: 128.4551 }, landType: "house_yard", nearForest: false,
    description: "작은 항구 마을의 주택 마당이에요. 새벽 항구 풍경이 좋아요. 전기 콘센트를 쓸 수 있어요.",
    maxGuests: 2, maxVehicles: 1, amenities: ["toilet", "water", "parking", "electricity"],
    rules: [...BASE_RULES], availability: "weekends", photoCount: 3, createdDaysAgo: 20,
  },
  {
    id: "sp-20", hostId: DEMO_HOST_ID, type: "camping", regionCode: "yangyang", neighborhood: "현남면 인구리",
    title: "현남 서핑 마을 뒷마당 캠핑", exact: { lat: 37.9701, lng: 128.7502 }, landType: "house_yard", nearForest: false,
    description: "서핑 마을 뒤편 주택 뒷마당이에요. 바다까지 걸어서 7분. 서핑하고 돌아와 씻을 수 있는 야외 수도가 있어요.",
    maxGuests: 4, maxVehicles: 2, amenities: ["toilet", "water", "electricity", "parking", "fire", "pets", "shade"],
    rules: [...BASE_RULES, "불은 지정된 화로대에서만 사용해 주세요"], availability: "weekends", photoCount: 4, createdDaysAgo: 160,
  },
];

const ALL_LEGAL_IDS = LEGAL_NOTICES.map((n) => n.id);

export const seedSpaces: Space[] = INPUTS.map((s, index) => {
  const created = relDateTime(-s.createdDaysAgo);
  return {
    id: s.id,
    hostId: s.hostId,
    title: s.title,
    description: s.description,
    type: s.type,
    regionCode: s.regionCode,
    neighborhood: s.neighborhood,
    approxCenter: makeApproxCenter(s.exact, s.id),
    approxRadiusM: APPROX_RADIUS_M,
    landType: s.landType,
    nearForest: s.nearForest,
    maxGuests: s.maxGuests,
    maxVehicles: s.maxVehicles,
    amenities: sanitizeAmenities(s.amenities, s.nearForest),
    rules: s.rules,
    ...TIMES[s.type],
    availableDates: availableDatesFor(s.availability),
    photos: photos(index, s.photoCount),
    status: "active",
    legalCheckedIds: ALL_LEGAL_IDS,
    createdAt: created,
    updatedAt: created,
  };
});

export const seedSpacePrivates: SpacePrivate[] = INPUTS.map((s, i) => ({
  spaceId: s.id,
  address: `강원특별자치도 ${getRegion(s.regionCode).name} ${s.neighborhood} ${100 + i * 7}-${(i % 5) + 1} (가상 주소)`,
  exactLocation: s.exact,
}));
