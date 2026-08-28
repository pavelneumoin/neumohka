const VK_USER_INFO_URL = "https://id.vk.ru/oauth2/user_info";
const DEFAULT_TIMEOUT_MS = 5_000;

export type VkUserPayload = {
  id: number;
  first_name: string;
  last_name: string;
  photo_100: string | null;
};

export type VkValidationResult =
  | { ok: true; user: VkUserPayload }
  | {
      ok: false;
      reason: "invalid_credentials" | "provider_unavailable";
    };

type ValidationOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  warn?: (message: string) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isValidVkId(value: unknown): value is number {
  return (
    typeof value === "number" && Number.isSafeInteger(value) && value > 0
  );
}

export function isValidVkAccessToken(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 4_096 &&
    value.trim() === value
  );
}

function parseVkId(value: unknown): number | null {
  if (isValidVkId(value)) return value;
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  return isValidVkId(parsed) ? parsed : null;
}

/**
 * Validates a VK ID access token against the app-bound user_info endpoint.
 * Identity always comes from VK's response, never from client-supplied profile data.
 */
export async function validateVkAccessToken(
  accessToken: string,
  expectedUserId: number,
  appId: number,
  options: ValidationOptions = {}
): Promise<VkValidationResult> {
  if (
    !isValidVkAccessToken(accessToken) ||
    !isValidVkId(expectedUserId) ||
    !isValidVkId(appId)
  ) {
    return { ok: false, reason: "invalid_credentials" };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const warn = options.warn ?? ((message: string) => console.warn(message));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const url = new URL(VK_USER_INFO_URL);
  url.searchParams.set("client_id", String(appId));

  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({ access_token: accessToken }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      warn(`[auth] VK user_info returned HTTP ${response.status}`);
      const invalidCredentials = [400, 401, 403].includes(response.status);
      return {
        ok: false,
        reason: invalidCredentials
          ? "invalid_credentials"
          : "provider_unavailable",
      };
    }

    const payload: unknown = await response.json();
    const user = isRecord(payload) && isRecord(payload.user) ? payload.user : null;
    if (!user) {
      warn("[auth] VK user_info returned an invalid response");
      return { ok: false, reason: "provider_unavailable" };
    }

    const actualUserId = parseVkId(user.user_id);

    if (actualUserId !== expectedUserId) {
      warn("[auth] VK user_info identity mismatch");
      return { ok: false, reason: "invalid_credentials" };
    }

    return {
      ok: true,
      user: {
        id: actualUserId,
        first_name:
          typeof user.first_name === "string" ? user.first_name : "",
        last_name: typeof user.last_name === "string" ? user.last_name : "",
        photo_100:
          typeof user.avatar === "string" && user.avatar ? user.avatar : null,
      },
    };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown_error";
    warn(`[auth] VK user_info request failed: ${reason}`);
    return { ok: false, reason: "provider_unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
