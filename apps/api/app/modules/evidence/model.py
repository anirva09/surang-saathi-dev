from datetime import datetime
from decimal import Decimal

from sqlalchemy import BigInteger, DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.domain.enums import GeofenceState


class HazardEvidence(Base):
    __tablename__ = "hazard_evidence"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    hazard_id: Mapped[str] = mapped_column(ForeignKey("hazards.id"), index=True)
    object_key: Mapped[str] = mapped_column(String(1024), unique=True)
    file_name: Mapped[str] = mapped_column(String(255))
    mime_type: Mapped[str] = mapped_column(String(128))
    file_size: Mapped[int] = mapped_column(BigInteger())
    sha256: Mapped[str] = mapped_column(String(64))
    latitude: Mapped[Decimal | None] = mapped_column(Numeric(9, 6), nullable=True)
    longitude: Mapped[Decimal | None] = mapped_column(Numeric(9, 6), nullable=True)
    accuracy_meters: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    captured_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    local_geofence_state: Mapped[str] = mapped_column(String(32), default=GeofenceState.LOCAL_VALID.value)
    server_geofence_state: Mapped[str] = mapped_column(String(32), default=GeofenceState.SERVER_PENDING.value)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
