import type { Metadata } from "next";
import { RoleGate } from "@/components/auth/RoleGate";
import { EditSpaceClient } from "@/components/host/register/EditSpaceClient";

export const metadata: Metadata = { title: "마당 수정" };

export default async function EditSpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <RoleGate allow={["host"]} reason="마당 수정은 마당지기만 할 수 있어요.">
      <EditSpaceClient id={id} />
    </RoleGate>
  );
}
