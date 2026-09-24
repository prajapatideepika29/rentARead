import { ApiError } from "./api";

// FastAPI 422 returns detail as an array of {msg}; 4xx usually a string. Render either safely.
export function apiErrorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    const detail = (e.body as { detail?: unknown } | null)?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      const msgs = detail
        .map((d) => (d && typeof d === "object" && "msg" in d ? String((d as { msg: unknown }).msg) : ""))
        .filter(Boolean);
      if (msgs.length) return msgs.join(" ");
    }
  }
  return "Something went wrong. Please try again.";
}
