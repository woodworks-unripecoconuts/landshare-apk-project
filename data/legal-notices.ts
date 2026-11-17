/**
 * 법령 안내 — 이 파일 하나만 고치면
 *   ① 마당 등록 6단계(법령 확인)  ② 공간 상세 페이지의 요약  ③ /legal 법령 안내 페이지
 * 세 곳에 모두 반영됩니다.
 *
 * ⚠️ 참고용 안내이며 법률 자문이 아닙니다. 문구를 고칠 때는 기준일(LEGAL_BASE_DATE)도 함께 바꿔 주세요.
 */

export const LEGAL_BASE_DATE = "2026년 11월";

export const LEGAL_DISCLAIMER =
  "참고용 안내이며 법률 자문이 아닙니다. 정확한 내용은 관할 시·군청 또는 전문가에게 확인하세요.";

/** 화면 맨 위에 붙이는 한 줄: "기준일 2026년 11월 · 참고용 안내이며 …" */
export const LEGAL_HEADER = `기준일 ${LEGAL_BASE_DATE} · ${LEGAL_DISCLAIMER}`;

export type LegalNoticeId = "tourism" | "forest_fire" | "natural_park" | "water_river" | "farmland" | "safety";

export interface LegalNotice {
  id: LegalNoticeId;
  /** 짧은 제목 */
  title: string;
  /** 관련 법령명 */
  lawName: string;
  /** 상세 페이지 요약에 쓰는 한 줄 */
  summary: string;
  /** 쉬운 설명 (여러 줄) */
  details: string[];
  /** 마당지기가 등록 6단계에서 체크하는 문구 */
  checkLabel: string;
}

export const LEGAL_NOTICES: LegalNotice[] = [
  {
    id: "tourism",
    title: "돈을 받지 않는 무료 공유만 가능해요",
    lawName: "관광진흥법 (야영장업)",
    summary: "이용료·사례금을 받거나 부지 분양·회원권을 판매하면 안 돼요.",
    details: [
      "야영장을 관광객에게 이용하게 하는 영업은 시·군에 야영장업 등록이 필요합니다.",
      "마당공유는 무료 공유만 허용하며, 이용료·사례금을 받으면 안 됩니다.",
      "부지를 나눠 팔거나 회원권·지분을 판매하는 것은 불법입니다.",
    ],
    checkLabel: "이용료나 사례금을 받지 않고, 부지 분양·회원권 판매를 하지 않겠습니다.",
  },
  {
    id: "forest_fire",
    title: "산림 근처에서는 불을 피울 수 없어요",
    lawName: "산림재난방지법 (산림 근처 불 사용)",
    summary: "산림이나 산림에서 100m 이내에서는 허가 없이 불을 피우면 과태료 대상이에요.",
    details: [
      "산림이나 산림에서 100m 이내 땅에서는 허가 없이 불을 피우거나 인화물질을 가지고 들어가면 최대 200만원 과태료가 부과될 수 있습니다.",
      "등록할 때 '산림에서 100m 이내'라고 답하면 '불 사용 가능'을 고를 수 없고, 상세 페이지에 '불 사용 금지'가 표시됩니다.",
    ],
    checkLabel: "산림 인접 여부를 확인했고, 해당하면 불 사용을 허용하지 않겠습니다.",
  },
  {
    id: "natural_park",
    title: "국립·도립·군립공원 안은 안 돼요",
    lawName: "자연공원법 (국립·도립·군립공원)",
    summary: "자연공원 안에서 지정 장소 밖 야영·차박·취사는 과태료 대상이에요.",
    details: [
      "국립공원 등 자연공원 안에서 지정 장소 밖 야영·차박·취사는 과태료 대상입니다.",
      "강원에는 설악산, 오대산, 치악산, 태백산 국립공원 등이 있습니다.",
    ],
    checkLabel: "제 공간은 자연공원 구역 안에 있지 않습니다.",
  },
  {
    id: "water_river",
    title: "상수원보호구역·하천구역은 안 돼요",
    lawName: "수도법 · 하천법 (상수원보호구역, 하천구역)",
    summary: "상수원보호구역에서 야영·취사하면 형사처벌을 받을 수 있어요.",
    details: [
      "상수원보호구역에서 야영·취사를 하면 징역이나 벌금 등 형사처벌을 받을 수 있습니다.",
      "하천구역도 야영이 금지된 곳이 있습니다.",
    ],
    checkLabel: "제 공간은 상수원보호구역·하천구역이 아닙니다.",
  },
  {
    id: "farmland",
    title: "농지는 모양을 바꾸지 말고 그대로",
    lawName: "농지법 (농지)",
    summary: "농지에 자갈 깔기·데크 설치처럼 땅 모양을 바꾸면 안 돼요.",
    details: [
      "지목이 전·답·과수원인 농지를 다른 용도로 쓰려면 농지전용허가가 필요할 수 있습니다.",
      "자갈 깔기, 데크·시설 설치처럼 땅 모양을 바꾸는 행위는 하지 마세요.",
    ],
    checkLabel: "농지라면 시설 설치나 땅 형질 변경 없이 그대로 사용하겠습니다.",
  },
  {
    id: "safety",
    title: "안전과 책임은 함께 지켜요",
    lawName: "공통 안전·책임",
    summary: "쓰레기는 마당손님이 되가져가고, 소음·안전사고에 주의해요.",
    details: [
      "쓰레기는 마당손님이 모두 가져가야 합니다.",
      "밤늦은 소음으로 이웃에 피해를 주지 않도록 안내해 주세요.",
      "안전사고가 나지 않도록 위험한 곳(우물, 비탈, 농기계 등)을 미리 알려 주세요. 사고 책임에 대해서는 미리 서로 확인해 두는 것이 좋습니다.",
    ],
    checkLabel: "마당손님에게 이용 규칙과 안전 수칙을 안내하겠습니다.",
  },
];

/** 마당손님이 신청할 때 꼭 체크해야 하는 동의 문구 */
export const GUEST_AGREEMENT_LABEL = "불 사용 규칙과 쓰레기 되가져가기에 동의합니다";

/** 신청 화면에서 동의 문구 아래 보여 줄 짧은 안내 */
export const GUEST_AGREEMENT_DETAILS = [
  "불은 마당지기가 허용한 경우에만, 지정된 곳(화로대 등)에서만 사용해요.",
  "'불 사용 금지' 마당에서는 버너·숯·화로대 모두 사용할 수 없어요.",
  "쓰레기는 음식물까지 모두 되가져가요.",
];

export function getLegalNotice(id: LegalNoticeId): LegalNotice {
  return LEGAL_NOTICES.find((n) => n.id === id)!;
}
