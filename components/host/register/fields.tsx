import { cn } from "@/lib/utils/cn";

export const inputClass =
  "h-12 w-full rounded-xl border border-soil-200 bg-white px-3 text-[15px] outline-none focus:border-grass-500 focus:ring-2 focus:ring-grass-100";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-sm font-bold text-soil-800">{label}</p>
      {children}
      {hint && <p className="text-xs text-soil-500">{hint}</p>}
    </div>
  );
}

/** 큰 선택 카드 (라디오처럼 하나만 고름) */
export function ChoiceCard({
  selected,
  onClick,
  title,
  description,
  emoji,
  disabled,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  emoji?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
        selected ? "border-grass-600 bg-grass-50 ring-2 ring-grass-200" : "border-soil-200 bg-white hover:border-soil-300",
      )}
    >
      {emoji && (
        <span className="text-2xl" aria-hidden="true">
          {emoji}
        </span>
      )}
      <span>
        <span className="block font-bold">{title}</span>
        {description && <span className="block text-sm text-soil-600">{description}</span>}
      </span>
    </button>
  );
}

export function NumberStepper({
  value,
  onChange,
  min,
  max,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <div className="flex h-12 items-center justify-between rounded-xl border border-soil-200 bg-white px-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="size-9 rounded-lg text-xl font-bold text-soil-700 hover:bg-soil-100 disabled:opacity-30"
        aria-label="줄이기"
      >
        −
      </button>
      <span className="font-bold">
        {value}
        {unit}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="size-9 rounded-lg text-xl font-bold text-soil-700 hover:bg-soil-100 disabled:opacity-30"
        aria-label="늘리기"
      >
        +
      </button>
    </div>
  );
}
