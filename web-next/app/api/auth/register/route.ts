import { registerWithPassword } from "@/lib/auth";
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
    rateScope: "auth-register",
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
    return jsonNoStore({ error: "invalid_fields" }, 400);
  }
  const data = body as Record<string, unknown>;
  if (
    typeof data.username !== "string" ||
    typeof data.password !== "string" ||
    typeof data.name !== "string"
  ) {
    return jsonNoStore({ error: "invalid_fields" }, 400);
  }

  const result = await registerWithPassword({
    username: data.username,
    password: data.password,
    name: data.name,
  });
  if (!result.ok) {
    const status = result.error === "username_taken" ? 409 : 400;
    return jsonNoStore({ error: result.error }, status);
  }
  return jsonNoStore({ user: toPublicUser(result.user) }, 201);
}
