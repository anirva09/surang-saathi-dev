from fastapi import APIRouter

from app.api.v1.audit import router as audit_router
from app.api.v1.corrective_actions import router as corrective_actions_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.hazards import router as hazards_router
from app.api.v1.risk import router as risk_router


api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(hazards_router)
api_v1_router.include_router(corrective_actions_router)
api_v1_router.include_router(evidence_router)
api_v1_router.include_router(audit_router)
api_v1_router.include_router(risk_router)
