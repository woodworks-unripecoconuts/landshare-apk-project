import type { BookingStatus } from "@/lib/domain/types";
import { BOOKING_STATUS_LABEL } from "@/lib/domain/labels";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

const TONE: Record<BookingStatus, BadgeTone> = {
  requested: "sun",
  approved: "grass",
  rejected: "red",
  cancelled: "gray",
  completed: "blue",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge tone={TONE[status]}>{BOOKING_STATUS_LABEL[status]}</Badge>;
}
