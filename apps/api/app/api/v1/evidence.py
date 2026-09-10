from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.v1.schemas import EvidenceUploadOut
from app.core.database import get_db
from app.domain.enums import GeofenceState
from app.modules.evidence.service import (
    MAX_EVIDENCE_BYTES,
    EvidenceConflictError,
    EvidenceNotFoundError,
    EvidenceStorageError,
    EvidenceValidationError,
    upload_hazard_evidence,
)


router = APIRouter(tags=["evidence"])
ALLOWED_EVIDENCE_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


def _translate_error(exc: Exception) -> HTTPException:
    if isinstance(exc, EvidenceNotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, EvidenceConflictError):
        return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))
    if isinstance(exc, EvidenceValidationError):
        return HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    return HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))


@router.post(
    "/hazards/{hazard_id}/evidence",
    response_model=EvidenceUploadOut,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
async def upload_evidence_endpoint(
    hazard_id: str,
    evidence_id: str = Form(..., alias="evidenceId", min_length=3, max_length=64),
    actor_id: str = Form(..., alias="actorId", min_length=1, max_length=64),
    captured_at: datetime = Form(..., alias="capturedAt"),
    latitude: float = Form(..., ge=-90, le=90),
    longitude: float = Form(..., ge=-180, le=180),
    accuracy_meters: float = Form(..., alias="accuracyMeters", ge=0, le=10000),
    local_geofence_state: GeofenceState = Form(
        GeofenceState.LOCAL_VALID,
        alias="localGeofenceState",
    ),
    client_sha256: str | None = Form(
        default=None,
        alias="clientSha256",
        min_length=64,
        max_length=64,
        pattern=r"^[0-9a-fA-F]{64}$",
    ),
    file: UploadFile = File(...),
    session: Session = Depends(get_db),
) -> dict:
    mime_type = file.content_type or "application/octet-stream"
    if mime_type not in ALLOWED_EVIDENCE_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Evidence must be JPEG, PNG, or WebP",
        )

    contents = await file.read(MAX_EVIDENCE_BYTES + 1)
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Evidence file is empty",
        )
    if len(contents) > MAX_EVIDENCE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Evidence file exceeds the 10 MiB limit",
        )

    try:
        return upload_hazard_evidence(
            session,
            hazard_id=hazard_id,
            evidence_id=evidence_id,
            actor_id=actor_id,
            file_name=file.filename or "evidence.bin",
            mime_type=mime_type,
            contents=contents,
            captured_at=captured_at,
            latitude=latitude,
            longitude=longitude,
            accuracy_meters=accuracy_meters,
            local_geofence_state=local_geofence_state.value,
            client_sha256=client_sha256,
        )
    except (
        EvidenceNotFoundError,
        EvidenceConflictError,
        EvidenceValidationError,
        EvidenceStorageError,
    ) as exc:
        raise _translate_error(exc) from exc
