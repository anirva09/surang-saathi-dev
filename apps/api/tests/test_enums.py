from app.domain.enums import GeofenceState, HazardSeverity, LifecycleStatus, SyncState


def test_canonical_domain_enum_values_are_locked() -> None:
    assert [item.value for item in HazardSeverity] == ["LOW", "MEDIUM", "HIGH"]
    assert [item.value for item in LifecycleStatus] == ["OPEN", "ACKNOWLEDGED", "OVERDUE", "ESCALATED", "RESOLVED"]
    assert [item.value for item in SyncState] == ["QUEUED", "SYNCING", "SYNCED", "CONFLICT", "OFFLINE"]
    assert [item.value for item in GeofenceState] == ["LOCAL_VALID", "SERVER_PENDING", "SERVER_VERIFIED", "OUTSIDE_GEOFENCE", "CONFLICT"]
