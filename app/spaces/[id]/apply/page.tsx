import type { Metadata } from "next";
import { RoleGate } from "@/components/auth/RoleGate";
import { ApplyClient } from "@/components/booking/ApplyClient";

export const metadata: Metadata = { title: "마당 신청" };

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <RoleGate allow={["guest"]} reason="마당 신청은 마당손님만 할 수 있어요.">
      <ApplyClient id={id} />
    </RoleGate>
  );
}
