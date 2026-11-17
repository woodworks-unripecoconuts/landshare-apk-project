"use client";

import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";
import type { LatLng, SpaceType } from "@/lib/domain/types";
import { spaceMarkerIcon, TILE_ATTRIBUTION, TILE_URL } from "./leaflet-helpers";

export interface ApproxLocationMapProps {
  approxCenter: LatLng;
  radiusM: number;
  type: SpaceType;
  /** 승인된 경우에만 정확한 위치를 넘깁니다. */
  exact?: LatLng | null;
}

/** 상세 화면 지도: 승인 전에는 동네 단위 원만, 승인 후에는 정확한 위치 마커 */
export default function ApproxLocationMapInner({ approxCenter, radiusM, type, exact }: ApproxLocationMapProps) {
  return (
    <MapContainer
      center={exact ?? approxCenter}
      zoom={exact ? 15 : 13}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {exact ? (
        <Marker position={exact} icon={spaceMarkerIcon(type, true)} />
      ) : (
        <Circle
          center={approxCenter}
          radius={radiusM}
          pathOptions={{ color: "#2f5d3a", fillColor: "#5f9068", fillOpacity: 0.25, weight: 2 }}
        />
      )}
    </MapContainer>
  );
}
