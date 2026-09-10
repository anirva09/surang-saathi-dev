/**
 * Central API client.
 *
 * Architecture: UI → page/domain adapter → typed endpoint module → this client
 * → FastAPI. Components never call `fetch` directly and never learn backend
 * implementation details.
 *
 * Requests run on the server (Server Components and Server Actions), never
 * from the browser. That is deliberate: the backend's CORS allowlist admits
 * only the frontend's own origin, the base URL stays a server-side
 * environment variable, and a browser that cannot reach the API is never the
 * reason a page fails to render.
 */

import { ApiError, type ApiErrorCode } from "./errors";

/**
 * Server-side only — no NEXT_PUBLIC_ prefix, so the value is never inlined
 * into the client bundle. Matches the backend's own default bind address.
 */
export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8000";

/**
 * The mine the prototype is scoped to. The backend seeds MINE-03; overriding
 * this is how a different mine is demonstrated without touching code.
 */
export const DEMO_MINE_ID = process.env.DEMO_MINE_ID ?? "MINE-03";

/**
 * The acting user for mutations. There is no authentication backend yet, so
 * this is a named, configurable prototype actor rather than an invented token:
 * every mutation the contract requires an `actorId` for sends this value, and
 * the audit trail records it honestly.
 */
export const PROTOTYPE_ACTOR_ID =
  process.env.PROTOTYPE_ACTOR_ID ?? "USR-MSHARMA";

/** How long a request may hang before the page shows an error state. */
const REQUEST_TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS ?? 8000);

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH";
  /** Serialised as JSON. Mutually exclusive with `formData`. */
  body?: unknown;
  /** Sent as multipart/form-data with no Content-Type of our own. */
  formData?: FormData;
  /** Appended as a query string, skipping null and undefined. */
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, API_BASE_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * The backend's error envelope, verified against its own hardening tests:
 *
 *   { "error": { "code", "message", "status", "details"? }, "detail": ... }
 *
 * `error` is the stable field; `detail` is the legacy FastAPI field the
 * backend still emits for compatibility. This reads `error` and falls back to
 * `detail` only so a transport-level failure still produces a sentence, never
 * to reconstruct a shape the contract does not guarantee.
 */
function toApiError(payload: unknown, status: number): ApiError {
  if (payload && typeof payload === "object") {
    const envelope = (payload as { error?: unknown }).error;
    if (envelope && typeof envelope === "object") {
      const { code, message, details } = envelope as {
        code?: unknown;
        message?: unknown;
        details?: unknown;
      };
      return new ApiError({
        code: typeof code === "string" ? (code as ApiErrorCode) : `HTTP_${status}`,
        message:
          typeof message === "string" && message.trim()
            ? message
            : `Request failed with status ${status}`,
        status,
        details,
        payload,
      });
    }

    // No `error` key: an intermediary (proxy, gateway) answered, not the API.
    const detail = (payload as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail.trim()) {
      return new ApiError({
        code: `HTTP_${status}`,
        message: detail,
        status,
        payload,
      });
    }
  }

  return new ApiError({
    code: `HTTP_${status}`,
    message: `Request failed with status ${status}`,
    status,
    payload,
  });
}

/** Issues a request and returns the parsed body, or throws an ApiError. */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, formData, query, headers, signal }: RequestOptions = {}
): Promise<T> {
  if (body !== undefined && formData !== undefined) {
    throw new Error("apiRequest: pass either body or formData, not both");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      // Safety and governance data is never served from a cache: every render
      // asks the backend what is true now.
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      ...(formData === undefined ? {} : { body: formData }),
    });
  } catch (cause) {
    // The backend is unreachable, refused the connection or timed out. This
    // surfaces as a real error state — never as demo data.
    const aborted = cause instanceof Error && cause.name === "AbortError";
    throw new ApiError({
      code: aborted ? "TIMEOUT" : "NETWORK_ERROR",
      message: aborted
        ? `The API did not respond within ${REQUEST_TIMEOUT_MS} ms.`
        : "The API could not be reached.",
      status: 0,
      cause,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();
  let payload: unknown;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = raw;
    }
  }

  if (!response.ok) {
    throw toApiError(payload, response.status);
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  postForm: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", formData }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
};
