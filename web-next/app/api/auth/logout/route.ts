import { logout } from "@/lib/auth";
import { checkMutationRequest, jsonNoStore } from "@/lib/request-security";

export async function POST(request: Request) {
  const rejected = checkMutationRequest(request, { rateScope: "auth-logout" });
  if (rejected) return rejected;
  await logout();
  return jsonNoStore({ ok: true });
}
