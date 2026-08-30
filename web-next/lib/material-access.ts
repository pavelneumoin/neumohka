export type MaterialAccess = "allowed" | "login" | "share";

type MaterialAccessInput = {
  free: boolean;
  authenticated: boolean;
  unlocked: boolean;
};

/**
 * Resolves access from catalog policy and the current session state.
 * The catalog's `free` flag is authoritative for anonymous downloads.
 */
export function resolveMaterialAccess({
  free,
  authenticated,
  unlocked,
}: MaterialAccessInput): MaterialAccess {
  if (free) return "allowed";
  if (!authenticated) return "login";
  return unlocked ? "allowed" : "share";
}
