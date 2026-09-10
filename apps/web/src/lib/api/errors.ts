/**
 * The backend's error vocabulary, transcribed from its `HTTP_ERROR_CODES` map
 * and its two exception handlers. These are the exact `error.code` values the
 * API emits; anything else arrives as `HTTP_<status>`, which the type admits
 * deliberately rather than silently mislabelling.
 *
 * `NETWORK_ERROR` and `TIMEOUT` are this client's own codes for a backend that
 * never answered. They are not contract codes and carry status 0.
 */

export const BACKEND_ERROR_CODES = [
  "BAD_REQUEST",
  "NOT_FOUND",
  "CONFLICT",
  "PAYLOAD_TOO_LARGE",
  "UNSUPPORTED_MEDIA_TYPE",
  "UNPROCESSABLE_ENTITY",
  "SERVICE_UNAVAILABLE",
  "VALIDATION_ERROR",
] as const;

export type BackendErrorCode = (typeof BACKEND_ERROR_CODES)[number];

/** Codes this client raises when the request never reached the API. */
export type TransportErrorCode = "NETWORK_ERROR" | "TIMEOUT";

export type ApiErrorCode = BackendErrorCode | TransportErrorCode | string;

export interface ApiErrorInit {
  code: ApiErrorCode;
  message: string;
  status: number;
  /** `error.details` from a validation failure, when present. */
  details?: unknown;
  /** The whole parsed response body, for diagnostics. */
  payload?: unknown;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details: unknown;
  readonly payload: unknown;

  constructor({ code, message, status, details, payload, cause }: ApiErrorInit) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
    this.payload = payload;
  }

  /** The resource genuinely does not exist — render a not-found state. */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /**
   * The request was valid but the current state forbids it: acknowledging a
   * resolved hazard, resolving an action twice, creating a duplicate id.
   */
  get isConflict(): boolean {
    return this.status === 409;
  }

  /** The submission itself was rejected — show it against the form. */
  get isValidation(): boolean {
    return this.status === 422 || this.code === "VALIDATION_ERROR";
  }

  /** The API was never reached, or answered too slowly. */
  get isUnreachable(): boolean {
    return this.code === "NETWORK_ERROR" || this.code === "TIMEOUT";
  }
}

/** True when `value` is an ApiError, across module and bundle boundaries. */
export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError || (value as ApiError)?.name === "ApiError";
}

/**
 * One field-level message per path, extracted from the backend's
 * `error.details` (FastAPI's `RequestValidationError.errors()` shape).
 * Returns an empty record for any other payload rather than guessing.
 */
export function validationFieldMessages(
  error: unknown
): Record<string, string> {
  if (!isApiError(error) || !Array.isArray(error.details)) return {};

  const messages: Record<string, string> = {};
  for (const entry of error.details) {
    if (!entry || typeof entry !== "object") continue;
    const { loc, msg } = entry as { loc?: unknown; msg?: unknown };
    if (typeof msg !== "string" || !Array.isArray(loc)) continue;
    // loc is e.g. ["body", "title"] — the last segment names the field.
    const field = loc[loc.length - 1];
    if (typeof field === "string" && !(field in messages)) {
      messages[field] = msg;
    }
  }
  return messages;
}
