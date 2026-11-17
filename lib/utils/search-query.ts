/**
 * 찾기 조건 ↔ 주소창 쿼리(?region=pyeongchang&type=camping&date=...) 변환.
 * 주소에 조건이 남아 있어서, 링크를 공유하거나 새로고침해도 같은 결과가 나옵니다.
 */
import type { AmenityKey, SpaceType } from "@/lib/domain/types";
import type { SpaceFilter } from "@/lib/repository";
import { isRegionCode } from "@/data/regions";
import { AMENITIES } from "@/data/amenities";
import { SPACE_TYPES } from "@/data/space-types";

const TYPE_KEYS = new Set(SPACE_TYPES.map((t) => t.key));
const AMENITY_KEYS = new Set(AMENITIES.map((a) => a.key));

type ParamsLike = { get(name: string): string | null };

export function filterFromParams(p: ParamsLike): SpaceFilter {
  const region = p.get("region");
  const types = (p.get("type") ?? "").split(",").filter((t): t is SpaceType => TYPE_KEYS.has(t as SpaceType));
  const amenities = (p.get("amenities") ?? "")
    .split(",")
    .filter((a): a is AmenityKey => AMENITY_KEYS.has(a as AmenityKey));
  const date = p.get("date");
  const end = p.get("end");
  const isDate = (v: string | null): v is string => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);
  const guests = Number(p.get("guests"));
  return {
    regionCode: isRegionCode(region) ? region : undefined,
    types: types.length ? types : undefined,
    amenities: amenities.length ? amenities : undefined,
    date: isDate(date) ? date : undefined,
    endDate: isDate(date) && isDate(end) && end > date ? end : undefined,
    guests: Number.isFinite(guests) && guests > 0 ? Math.min(guests, 30) : undefined,
    verifiedOnly: p.get("verified") === "1" ? true : undefined,
  };
}

export function filterToQuery(f: SpaceFilter): string {
  const q = new URLSearchParams();
  if (f.regionCode) q.set("region", f.regionCode);
  if (f.types?.length) q.set("type", f.types.join(","));
  if (f.date) q.set("date", f.date);
  if (f.date && f.endDate) q.set("end", f.endDate);
  if (f.guests) q.set("guests", String(f.guests));
  if (f.amenities?.length) q.set("amenities", f.amenities.join(","));
  if (f.verifiedOnly) q.set("verified", "1");
  const s = q.toString();
  return s ? `?${s}` : "";
}
