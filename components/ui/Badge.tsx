import { cn } from "@/lib/utils/cn";

export type BadgeTone = "grass" | "soil" | "sun" | "red" | "gray" | "blue";

const tones: Record<BadgeTone, string> = {
  grass: "bg-grass-100 text-grass-800",
  soil: "bg-soil-100 text-soil-800",
  sun: "bg-sun-100 text-soil-800",
  red: "bg-red-50 text-red-700",
  gray: "bg-stone-100 text-stone-600",
  blue: "bg-sky-50 text-sky-800",
};

export function Badge({
  tone = "soil",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
