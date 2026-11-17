import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl">🌾</p>
      <h1 className="mt-4 text-xl font-bold">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-soil-600">주소가 바뀌었거나 없는 페이지예요.</p>
      <LinkButton href="/" className="mt-6">
        홈으로 가기
      </LinkButton>
    </div>
  );
}
