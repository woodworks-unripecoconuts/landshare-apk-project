/**
 * 화면 꾸밈용 사진 목록 (무료 placeholder: picsum.photos의 자연·풍경 사진 번호)
 *
 * - 가짜 마당 사진, 메인 큰 사진, 지역 타일 등에서 같이 씁니다.
 * - 실제 서비스에서는 마당지기가 올린 사진(Supabase Storage 등)으로 바뀝니다.
 * - 사진을 못 불러오면 SpaceImage가 로컬 그림(/placeholder-yard.svg)으로 바꿔 보여 줍니다.
 */
export const NATURE_PHOTO_IDS = [10, 11, 13, 15, 16, 17, 18, 19, 28, 29, 1011, 1015, 1016, 1018, 1036, 1039, 12, 14];

export function photoUrl(id: number, width = 960, height = 640): string {
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}

/** 순서(index)에 따라 자연 사진을 하나 고릅니다. */
export function naturePhoto(index: number, width = 960, height = 640): string {
  const id = NATURE_PHOTO_IDS[((index % NATURE_PHOTO_IDS.length) + NATURE_PHOTO_IDS.length) % NATURE_PHOTO_IDS.length];
  return photoUrl(id, width, height);
}

/** 메인 첫 화면 큰 사진 */
export const HERO_IMAGE = photoUrl(1018, 1920, 1080);
/** 마당지기 이야기 사진 */
export const HOST_STORY_IMAGE = photoUrl(17, 1200, 900);
/** 마당지기 모집 배너 사진 */
export const HOST_CTA_IMAGE = photoUrl(1015, 1600, 700);
