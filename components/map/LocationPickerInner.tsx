"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLng } from "@/lib/domain/types";
import { pickerIcon, TILE_ATTRIBUTION, TILE_URL } from "./leaflet-helpers";

export interface LocationPickerProps {
  center: LatLng;
  zoom: number;
  value: LatLng | null;
  onChange: (v: LatLng) => void;
}

function ClickHandler({ onChange }: { onChange: (v: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: +e.latlng.lat.toFixed(5), lng: +e.latlng.lng.toFixed(5) });
    },
  });
  return null;
}

function Recenter({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center.lat, center.lng, zoom, map]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/** 등록 화면: 지도를 눌러 마당 위치를 찍습니다. */
export default function LocationPickerInner({ center, zoom, value, onChange }: LocationPickerProps) {
  return (
    <MapContainer center={value ?? center} zoom={value ? 14 : zoom} className="h-full w-full rounded-2xl">
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <Recenter center={center} zoom={zoom} />
      <ClickHandler onChange={onChange} />
      {value && (
        <Marker
          position={value}
          icon={pickerIcon()}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const p = e.target.getLatLng();
              onChange({ lat: +p.lat.toFixed(5), lng: +p.lng.toFixed(5) });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
