from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.schemas import (
    CorrectiveActionCreateIn,
    CorrectiveActionOut,
    CorrectiveActionResolveIn,
    CorrectiveActionUpdateIn,
)
from app.core.database import get_db
from app.modules.corrective_actions.service import (
    create_corrective_action,
    resolve_corrective_action,
    update_corrective_action,
)
from app.modules.hazards.mutations import MutationConflictError, MutationNotFoundError


router = APIRouter(tags=["corrective-actions"])


def _translate_mutation_error(exc: Exception) -> HTTPException:
    if isinstance(exc, MutationNotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))


@router.post(
    "/corrective-actions",
    response_model=CorrectiveActionOut,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
def create_corrective_action_endpoint(
    body: CorrectiveActionCreateIn,
    session: Session = Depends(get_db),
) -> dict:
    try:
        return create_corrective_action(session, body)
    except (MutationNotFoundError, MutationConflictError) as exc:
        session.rollback()
        raise _translate_mutation_error(exc) from exc


@router.patch(
    "/corrective-actions/{action_id}",
    response_model=CorrectiveActionOut,
    response_model_by_alias=True,
)
def update_corrective_action_endpoint(
    action_id: str,
    body: CorrectiveActionUpdateIn,
    session: Session = Depends(get_db),
) -> dict:
    try:
        return update_corrective_action(session, action_id, body)
    except (MutationNotFoundError, MutationConflictError) as exc:
        session.rollback()
        raise _translate_mutation_error(exc) from exc


@router.post(
    "/corrective-actions/{action_id}/resolve",
    response_model=CorrectiveActionOut,
    response_model_by_alias=True,
)
def resolve_corrective_action_endpoint(
    action_id: str,
    body: CorrectiveActionResolveIn,
    session: Session = Depends(get_db),
) -> dict:
    try:
        return resolve_corrective_action(session, action_id, body.actor_id)
    except (MutationNotFoundError, MutationConflictError) as exc:
        session.rollback()
        raise _translate_mutation_error(exc) from exc
