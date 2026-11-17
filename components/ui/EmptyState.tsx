export function EmptyState({
  emoji = "🌱",
  title,
  description,
  children,
}: {
  emoji?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-soil-300 bg-white/60 px-6 py-10 text-center">
      <p className="text-4xl" aria-hidden="true">
        {emoji}
      </p>
      <p className="mt-3 font-bold text-soil-900">{title}</p>
      {description && <p className="mt-1 text-sm text-soil-600">{description}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}

export function LoadingBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-label="불러오는 중">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-soil-100" />
      ))}
    </div>
  );
}

export function ErrorBox({ error }: { error: Error | null | undefined }) {
  if (!error) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error.message}
    </div>
  );
}
