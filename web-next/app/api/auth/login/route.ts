import { loginWithPassword } from "@/lib/auth";
import { toPublicUser } from "@/lib/store";
import {
  checkMutationRequest,
  jsonNoStore,
  PayloadTooLargeError,
  readJsonBody,
} from "@/lib/request-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rejected = checkMutationRequest(request, {
    requireJson: true,
    rateScope: "auth-login",
  });
  if (rejected) return rejected;

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    return jsonNoStore(
      { error: error instanceof PayloadTooLargeError ? "payload_too_large" : "invalid_json" },
      error instanceof PayloadTooLargeError ? 413 : 400
    );
  }
  if (!body || typeof body !== "object") {
    return jsonNoStore({ error: "invalid_credentials" }, 401);
  }
  const data = body as Record<string, unknown>;
  if (typeof data.username !== "string" || typeof data.password !== "string") {
    return jsonNoStore({ error: "invalid_credentials" }, 401);
  }

  const result = await loginWithPassword({
    username: data.username,
    password: data.password,
  });
  if (!result.ok) {
    return jsonNoStore({ error: "invalid_credentials" }, 401);
  }
  return jsonNoStore({ user: toPublicUser(result.user) });
}
