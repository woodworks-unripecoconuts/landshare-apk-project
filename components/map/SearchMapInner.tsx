"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { SpaceListItem } from "@/lib/repository";
import { spaceTypeLabel } from "@/data/space-types";
import { GANGWON_CENTER, GANGWON_ZOOM } from "@/data/regions";
import type { LatLng } from "@/lib/domain/types";
import { spaceMarkerIcon, TILE_ATTRIBUTION, TILE_URL } from "./leaflet-helpers";

export interface SearchMapProps {
  items: SpaceListItem[];
  activeId?: string | null;
  onSelect?: (id: string | null) => void;
  /** 결과가 없을 때 보여 줄 중심 (예: 선택한 시·군) */
  fallbackCenter?: LatLng;
  fallbackZoom?: number;
}

function FitToItems({ items, fallbackCenter, fallbackZoom }: Omit<SearchMapProps, "activeId" | "onSelect">) {
  const map = useMap();
  const key = items.map((i) => i.space.id).join(",");
  useEffect(() => {
    if (items.length === 0) {
      map.setView(fallbackCenter ?? GANGWON_CENTER, fallbackZoom ?? GANGWON_ZOOM, { animate: false });
    } else if (items.length === 1) {
      map.setView(items[0].space.approxCenter, 12, { animate: false });
    } else {
      const bounds = L.latLngBounds(items.map((i) => [i.space.approxCenter.lat, i.space.approxCenter.lng]));
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 12, animate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 결과 목록(key)이 바뀔 때만 다시 맞춤
  }, [key, map]);
  return null;
}

/** 찾기 화면의 지도: 각 마당의 '대략적 위치'에 마커 표시 */
export default function SearchMapInner({ items, activeId, onSelect, fallbackCenter, fallbackZoom }: SearchMapProps) {
  return (
    <MapContainer
      center={GANGWON_CENTER}
      zoom={GANGWON_ZOOM}
      scrollWheelZoom
      className="h-full w-full rounded-2xl"
      aria-label="마당 지도"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <FitToItems items={items} fallbackCenter={fallbackCenter} fallbackZoom={fallbackZoom} />
      {items.map(({ space, ratingAvg }) => (
        <Marker
          key={space.id}
          position={space.approxCenter}
          icon={spaceMarkerIcon(space.type, space.id === activeId)}
          zIndexOffset={space.id === activeId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect?.(space.id) }}
        >
          <Popup>
            <div className="min-w-40">
              <p className="text-xs text-soil-600">{spaceTypeLabel(space.type)}</p>
              <p className="font-bold">{space.title}</p>
              <p className="text-xs text-soil-600">
                최대 {space.maxGuests}명{ratingAvg != null ? ` · ★ ${ratingAvg.toFixed(1)}` : ""}
              </p>
              <Link href={`/spaces/${space.id}`} className="mt-1 inline-block font-semibold text-grass-700">
                자세히 보기 →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
