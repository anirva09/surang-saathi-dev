from enum import StrEnum


class HazardSeverity(StrEnum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class LifecycleStatus(StrEnum):
    OPEN = "OPEN"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    OVERDUE = "OVERDUE"
    ESCALATED = "ESCALATED"
    RESOLVED = "RESOLVED"


class SyncState(StrEnum):
    QUEUED = "QUEUED"
    SYNCING = "SYNCING"
    SYNCED = "SYNCED"
    CONFLICT = "CONFLICT"
    OFFLINE = "OFFLINE"


class GeofenceState(StrEnum):
    LOCAL_VALID = "LOCAL_VALID"
    SERVER_PENDING = "SERVER_PENDING"
    SERVER_VERIFIED = "SERVER_VERIFIED"
    OUTSIDE_GEOFENCE = "OUTSIDE_GEOFENCE"
    CONFLICT = "CONFLICT"
