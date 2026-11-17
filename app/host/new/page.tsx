import type { Metadata } from "next";
import { RoleGate } from "@/components/auth/RoleGate";
import { RegisterWizard } from "@/components/host/register/RegisterWizard";

export const metadata: Metadata = { title: "마당 등록" };

export default function NewSpacePage() {
  return (
    <RoleGate allow={["host"]} reason="마당 등록은 마당지기만 할 수 있어요.">
      <RegisterWizard mode="new" />
    </RoleGate>
  );
}
