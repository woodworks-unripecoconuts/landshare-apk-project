/** 가짜 마당 일기(후기) — 이용 완료된 신청에만 있습니다. */
import type { DiaryEntry } from "@/lib/domain/types";
import { relDateTime } from "@/lib/domain/dates";
import { DEMO_GUEST_ID } from "./users";

import { naturePhoto } from "./images";

let photoIndex = 7;
const photo = () => naturePhoto(photoIndex++ * 2, 800, 600);

export const seedDiaries: DiaryEntry[] = [
  { id: "dy-07", bookingId: "bk-07", spaceId: "sp-20", authorId: "u-guest-3", rating: 5, text: "아이들이 마당에서 뛰어놀고, 아침엔 바다까지 산책했어요. 마당지기님이 수도 쓰는 법도 친절히 알려 주셨어요.", photos: [photo()], createdAt: relDateTime(-28, 19) },
  { id: "dy-17", bookingId: "bk-17", spaceId: "sp-20", authorId: DEMO_GUEST_ID, rating: 4, text: "서핑하고 돌아와 바로 씻을 수 있어서 너무 편했어요. 밤엔 조금 추우니 침낭 꼭 챙기세요.", photos: [], createdAt: relDateTime(-58, 20) },
  { id: "dy-13", bookingId: "bk-13", spaceId: "sp-13", authorId: "u-guest-2", rating: 5, text: "마당 앞이 온통 메밀꽃이라 사진이 정말 잘 나와요. 불을 못 쓰는 대신 도시락을 싸 갔어요.", photos: [photo(), photo()], createdAt: relDateTime(-33, 18) },
  { id: "dy-09", bookingId: "bk-09", spaceId: "sp-04", authorId: "u-guest-2", rating: 5, text: "파도 소리 들으며 잤어요. 화장실도 깨끗했어요.", photos: [photo()], createdAt: relDateTime(-38, 10) },
  { id: "dy-10", bookingId: "bk-10", spaceId: "sp-02", authorId: "u-guest-3", rating: 4, text: "느티나무 그늘이 정말 시원해요. 밭에 들어가지 않게 아이들 단속만 잘하면 돼요.", photos: [], createdAt: relDateTime(-14, 21) },
  { id: "dy-11", bookingId: "bk-11", spaceId: "sp-09", authorId: "u-guest-2", rating: 4, text: "땅이 살짝 기울어 있어서 매트를 두껍게 깔았어요. 사과꽃 향기가 좋았어요.", photos: [photo()], createdAt: relDateTime(-23, 9) },
  { id: "dy-12", bookingId: "bk-12", spaceId: "sp-03", authorId: "u-guest-3", rating: 5, text: "강아지와 함께 편하게 쉬었어요. 시골 할머니 댁에 온 느낌!", photos: [photo()], createdAt: relDateTime(-48, 20) },
  { id: "dy-14", bookingId: "bk-14", spaceId: "sp-12", authorId: "u-guest-2", rating: 3, text: "조용하고 좋았지만 화장실이 없어서 조금 불편했어요. 미리 알고 가면 괜찮아요.", photos: [], createdAt: relDateTime(-16, 11) },
  { id: "dy-15", bookingId: "bk-15", spaceId: "sp-17", authorId: "u-guest-3", rating: 5, text: "펀치볼 풍경이 한눈에 보여요. 여럿이 가도 넉넉했어요.", photos: [photo()], createdAt: relDateTime(-11, 19) },
  { id: "dy-16", bookingId: "bk-16", spaceId: "sp-11", authorId: "u-guest-2", rating: 5, text: "은하수가 정말 선명하게 보였어요. 별 사진 찍는 분께 강력 추천!", photos: [photo()], createdAt: relDateTime(-6, 8) },
];
