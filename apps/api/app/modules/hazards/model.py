from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.domain.enums import GeofenceState, HazardSeverity, LifecycleStatus, SyncState


class Hazard(Base):
    __tablename__ = "hazards"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    mine_id: Mapped[str] = mapped_column(ForeignKey("mines.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text())
    severity: Mapped[str] = mapped_column(String(32), default=HazardSeverity.LOW.value)
    lifecycle_status: Mapped[str] = mapped_column(String(32), default=LifecycleStatus.OPEN.value)
    location_name: Mapped[str] = mapped_column(String(255))
    reported_by_user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    assigned_to_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    sync_state: Mapped[str] = mapped_column(String(32), default=SyncState.QUEUED.value)
    geofence_state: Mapped[str] = mapped_column(String(32), default=GeofenceState.SERVER_PENDING.value)
    captured_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
