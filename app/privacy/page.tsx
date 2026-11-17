import type { Metadata } from "next";
import { DocPage } from "@/components/layout/DocPage";
import { SERVICE_NAME } from "@/data/policies";

export const metadata: Metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <DocPage title="개인정보처리방침" subtitle="실제 서비스 전 법률 검토 후 확정됩니다.">
      <section className="rounded-2xl bg-sun-100 p-4">
        <h2>지금(프로토타입)은</h2>
        <p>
          이 프로토타입은 개인정보를 서버로 보내거나 저장하지 않습니다. 화면에서 입력한 내용(마당 정보·메시지·사진 미리보기
          등)은 <b>이 브라우저(localStorage)에만</b> 저장되고, 푸터의 &lsquo;데모 데이터 초기화&rsquo;로 지울 수 있습니다.
          등기부등본 업로드도 파일 이름만 기록하고 내용은 저장하지 않습니다.
        </p>
      </section>

      <section>
        <h2>1. 수집하는 정보 (실제 서비스 예정)</h2>
        <ul className="space-y-1">
          <li>회원: 이름(별명), 연락처, 로그인 정보</li>
          <li>마당지기: 본인 인증 결과, 토지·주택 소유 확인 서류(등기부등본), 마당 주소·위치</li>
          <li>마당손님: 신청 내역, 메시지, 마당 일기</li>
        </ul>
      </section>

      <section>
        <h2>2. 위치 정보</h2>
        <p>
          마당의 정확한 주소·좌표는 신청이 승인된 마당손님에게만 공개합니다. 그 전에는 실제 위치에서 일부러 조금 떨어뜨린
          동네 단위 원(약 1km)만 보여 줍니다.
        </p>
      </section>

      <section>
        <h2>3. 이용 목적</h2>
        <ul className="space-y-1">
          <li>마당 등록·찾기·신청·메시지 기능 제공</li>
          <li>무료 원칙 위반·불법 영업·안전 문제 신고 처리</li>
          <li>광고 노출 (개인 맞춤 광고 여부는 실제 서비스 전 결정)</li>
        </ul>
      </section>

      <section>
        <h2>4. 보관 기간과 파기</h2>
        <p>탈퇴하면 법령에서 정한 기간을 제외하고 지체 없이 파기합니다. (임시 문구)</p>
      </section>

      <section>
        <h2>5. 문의</h2>
        <p>{SERVICE_NAME} 개인정보 보호 담당자 (실제 서비스 전 지정)</p>
      </section>
    </DocPage>
  );
}
