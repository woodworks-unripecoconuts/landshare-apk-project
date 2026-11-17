import { SLOGAN } from "@/data/policies";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-grass-800">{SLOGAN}</h1>
      <p className="mt-3 text-soil-700">메인 화면은 다음 단계에서 만들어요.</p>
    </div>
  );
}
