/**
 * Leaflet(지도) 공통 설정 — 브라우저에서만 불러오는 파일입니다.
 * OpenStreetMap 타일은 API 키 없이 쓸 수 있고, 지도 오른쪽 아래 출처 표시가 꼭 필요합니다.
 */
import L from "leaflet";
import type { SpaceType } from "@/lib/domain/types";

export const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 기여자';

const TYPE_EMOJI: Record<SpaceType, string> = { camping: "⛺", carcamp: "🚙", picnic: "🧺" };

/** 마당 마커 (이미지 파일 없이 HTML로 그려서 배포 후에도 아이콘이 깨지지 않음) */
export function spaceMarkerIcon(type: SpaceType, active = false): L.DivIcon {
  const bg = active ? "#3f6230" : "#ffffff";
  const border = active ? "#3f6230" : "#4f7a3a";
  const size = active ? 40 : 34;
  return L.divIcon({
    className: "madang-marker",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${bg};border:2px solid ${border};box-shadow:0 2px 6px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:${active ? 18 : 15}px">${TYPE_EMOJI[type]}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

/** 등록 화면에서 찍는 핀 */
export function pickerIcon(): L.DivIcon {
  return L.divIcon({
    className: "madang-marker",
    html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#b9862b;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}
