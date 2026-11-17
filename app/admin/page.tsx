import type { Metadata } from "next";
import { RoleGate } from "@/components/auth/RoleGate";
import { AdminClient } from "@/components/admin/AdminClient";

export const metadata: Metadata = { title: "관리자" };

export default function AdminPage() {
  return (
    <RoleGate allow={["admin"]} reason="관리자 화면은 관리자만 볼 수 있어요.">
      <AdminClient />
    </RoleGate>
  );
}
