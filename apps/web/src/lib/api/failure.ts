/**
 * A serialisable description of a failed request.
 *
 * Server Components catch an `ApiError` but cannot hand a class instance to a
 * Client Component, so every page converts the error into this plain object and
 * the error state renders from it. `kind` is what the UI switches on, so the
 * view never has to reason about HTTP status codes itself.
 */

import { isApiError, validationFieldMessages } from "./errors";

export type ApiFailureKind =
  | "unreachable"
  | "notFound"
  | "conflict"
  | "validation"
  | "unknown";

export interface ApiFailure {
  kind: ApiFailureKind;
  /** The backend's `error.code`, or this client's transport code. */
  code: string;
  /** 0 when the request never reached the API. */
  status: number;
  /** The backend's `error.message`, shown verbatim so nothing is invented. */
  message: string;
  /**
   * Field name → message, for a 422 the BACKEND raised. These are the API's own
   * words and are shown verbatim, untranslated, exactly like an identifier.
   */
  fieldMessages: Record<string, string>;
  /**
   * Field name → message key, for a rejection this frontend raised before
   * sending. These are our own copy, so they are translated like any other
   * label. A field appearing here takes precedence over `fieldMessages`.
   */
  fieldMessageKeys?: Record<string, string>;
}

/** A rejection this frontend raised itself, with translatable field messages. */
export function localValidationFailure(
  fieldMessageKeys: Record<string, string>,
  message: string
): ApiFailure {
  return {
    kind: "validation",
    code: "VALIDATION_ERROR",
    status: 422,
    message,
    fieldMessages: {},
    fieldMessageKeys,
  };
}

export function toApiFailure(error: unknown): ApiFailure {
  if (isApiError(error)) {
    const kind: ApiFailureKind = error.isUnreachable
      ? "unreachable"
      : error.isNotFound
        ? "notFound"
        : error.isConflict
          ? "conflict"
          : error.isValidation
            ? "validation"
            : "unknown";

    return {
      kind,
      code: error.code,
      status: error.status,
      message: error.message,
      fieldMessages: validationFieldMessages(error),
    };
  }

  // Not an ApiError at all: a bug in our own code, or a thrown non-Error.
  return {
    kind: "unknown",
    code: "UNEXPECTED",
    status: 0,
    message:
      error instanceof Error ? error.message : "An unexpected error occurred.",
    fieldMessages: {},
  };
}

/** The outcome of a Server Action, in the shape a form can render directly. */
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; failure: ApiFailure };

export function actionOk<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function actionFailed<T = undefined>(error: unknown): ActionResult<T> {
  return { ok: false, failure: toApiFailure(error) };
}
