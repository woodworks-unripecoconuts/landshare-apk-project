import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "@/components/layout/DocPage";
import { NO_FEE_NOTICE, SERVICE_NAME } from "@/data/policies";
import { GUEST_AGREEMENT_LABEL } from "@/data/legal-notices";

export const metadata: Metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <DocPage title={`${SERVICE_NAME} 이용약관`} subtitle="시행일: 미정 (프로토타입) · 실제 서비스 전 법률 검토 후 확정됩니다.">
      <section>
        <h2>제1조 (목적)</h2>
        <p>
          이 약관은 {SERVICE_NAME}(이하 &lsquo;서비스&rsquo;)가 강원특별자치도의 남는 땅·주택 마당·농지를 가진
          마당지기와, 캠핑·차박·나들이를 하려는 마당손님을 무료로 이어 주는 데 필요한 기본 사항을 정합니다.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-grass-600 bg-grass-50 p-4">
        <h2>제2조 (무료 원칙)</h2>
        <ul className="space-y-1">
          <li>서비스와 모든 마당의 이용은 무료입니다. 서비스는 광고 수익으로 운영됩니다.</li>
          <li>
            <b>{NO_FEE_NOTICE}</b> 현금·계좌이체·상품권·물품 등 어떤 형태의 대가도 요구하거나 받을 수 없습니다.
          </li>
          <li>부지를 나눠 팔거나 회원권·지분을 판매하는 행위는 금지되며, 확인되면 공간을 숨기고 이용을 제한합니다.</li>
        </ul>
      </section>

      <section>
        <h2>제3조 (서비스 지역)</h2>
        <p>현재 서비스는 강원특별자치도 18개 시·군에서만 제공됩니다.</p>
      </section>

      <section>
        <h2>제4조 (마당지기의 의무)</h2>
        <ul className="space-y-1">
          <li>
            공간을 등록하기 전 <Link href="/legal" className="font-semibold text-grass-700 underline">법령 안내</Link>의
            모든 항목을 확인하고 지켜야 합니다.
          </li>
          <li>산림 또는 산림에서 100m 이내인 공간은 불 사용을 허용할 수 없습니다.</li>
          <li>자연공원·상수원보호구역·하천구역 안의 공간은 등록할 수 없습니다.</li>
          <li>농지는 시설 설치나 땅 형질 변경 없이 그대로 사용하게 해야 합니다.</li>
          <li>공간 정보(편의시설·규칙 등)를 사실대로 적어야 합니다.</li>
        </ul>
      </section>

      <section>
        <h2>제5조 (마당손님의 의무)</h2>
        <ul className="space-y-1">
          <li>신청할 때 &lsquo;{GUEST_AGREEMENT_LABEL}&rsquo;에 동의해야 합니다.</li>
          <li>마당지기의 이용 규칙을 지키고, 쓰레기는 모두 되가져갑니다.</li>
          <li>승인 후 공개된 정확한 주소를 다른 사람에게 퍼뜨리지 않습니다.</li>
        </ul>
      </section>

      <section>
        <h2>제6조 (위치 정보 공개)</h2>
        <p>정확한 주소는 마당 신청이 승인된 마당손님에게만 공개되며, 그 전에는 동네 단위의 대략적인 위치만 표시됩니다.</p>
      </section>

      <section>
        <h2>제7조 (신고와 제재)</h2>
        <p>
          이용료 요구, 불법 영업, 안전 문제, 허위 정보 등은 공간 상세 화면의 &lsquo;신고하기&rsquo;로 알려 주세요. 관리자는
          확인 후 공간 숨김, 이용 제한 등의 조치를 할 수 있습니다.
        </p>
      </section>

      <section>
        <h2>제8조 (책임)</h2>
        <p>
          서비스는 마당지기와 마당손님을 이어 주는 역할을 하며, 공간 이용 중 생긴 사고·분쟁의 책임에 대해서는 실제 서비스 전
          전문가 검토를 거쳐 정합니다. (임시 문구)
        </p>
      </section>
    </DocPage>
  );
}
