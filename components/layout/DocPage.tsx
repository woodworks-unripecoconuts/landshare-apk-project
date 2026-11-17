/** 약관·방침·안내처럼 글로 된 페이지의 공통 틀 */
export function DocPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <p className="mb-3 inline-block rounded-full bg-sun-100 px-3 py-1 text-xs font-bold text-soil-800">
        임시 문구 · 프로토타입용
      </p>
      <h1 className="text-2xl font-extrabold">{title}</h1>
      {subtitle && <div className="mt-2 text-sm text-soil-600">{subtitle}</div>}
      <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-soil-800 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </div>
  );
}
