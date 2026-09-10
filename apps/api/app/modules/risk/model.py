from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, JSON, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class RiskSnapshot(Base):
    __tablename__ = "risk_snapshots"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    mine_id: Mapped[str] = mapped_column(ForeignKey("mines.id"), index=True)
    score: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    level: Mapped[str] = mapped_column(String(32))
    factors_json: Mapped[list[dict]] = mapped_column(JSON())
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
