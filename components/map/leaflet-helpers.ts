/**
 * Leaflet(지도) 공통 설정 — 브라우저에서만 불러오는 파일입니다.
 * OpenStreetMap 타일은 API 키 없이 쓸 수 있고, 지도 오른쪽 아래 출처 표시가 꼭 필요합니다.
 */
import L from "leaflet";
import type { SpaceType } from "@/lib/domain/types";

export const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 기여자';

const TYPE_EMOJI: Record<SpaceType, string> = { camping: "⛺", carcamp: "🚙", picnic: "🧺" };

/** 마당 마커: 알약 모양 라벨 (이미지 파일 없이 HTML로 그려서 배포 후에도 깨지지 않음) */
const TYPE_SHORT: Record<SpaceType, string> = { camping: "캠핑", carcamp: "차박", picnic: "나들이" };

export function spaceMarkerIcon(type: SpaceType, active = false): L.DivIcon {
  const label = `${TYPE_EMOJI[type]} ${TYPE_SHORT[type]}`;
  const width = type === "picnic" ? 78 : 66;
  const bg = active ? "#1f2420" : "#ffffff";
  const color = active ? "#ffffff" : "#1f2420";
  return L.divIcon({
    className: "madang-marker",
    html: `<div style="display:flex;align-items:center;justify-content:center;height:30px;width:${width}px;border-radius:999px;background:${bg};color:${color};font-weight:700;font-size:12.5px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.06);transform:${active ? "scale(1.08)" : "none"};transition:transform .15s">${label}</div>`,
    iconSize: [width, 30],
    iconAnchor: [width / 2, 15],
    popupAnchor: [0, -18],
  });
}

/** 등록 화면에서 찍는 핀 */
export function pickerIcon(): L.DivIcon {
  return L.divIcon({
    className: "madang-marker",
    html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#d2803f;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}
