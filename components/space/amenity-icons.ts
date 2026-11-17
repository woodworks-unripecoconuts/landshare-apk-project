import { Toilet, Droplets, Zap, SquareParking, Flame, PawPrint, Umbrella, type LucideIcon } from "lucide-react";
import type { AmenityKey } from "@/lib/domain/types";

export const AMENITY_ICONS: Record<AmenityKey, LucideIcon> = {
  toilet: Toilet,
  water: Droplets,
  electricity: Zap,
  parking: SquareParking,
  fire: Flame,
  pets: PawPrint,
  shade: Umbrella,
};
