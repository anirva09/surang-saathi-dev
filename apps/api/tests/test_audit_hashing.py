from app.modules.audit.hashing import calculate_event_hash


def test_audit_hash_is_deterministic_for_key_order() -> None:
    event_a = {'entity_type':'HAZARD','entity_id':'HZRD-2026-442','event_type':'HAZARD_CREATED','payload':{'severity':'HIGH','location':'Seam 2, Main Gallery'}}
    event_b = {'event_type':'HAZARD_CREATED','payload':{'location':'Seam 2, Main Gallery','severity':'HIGH'},'entity_id':'HZRD-2026-442','entity_type':'HAZARD'}
    assert calculate_event_hash(event_a, None) == calculate_event_hash(event_b, None)


def test_audit_hash_changes_when_payload_changes() -> None:
    event = {'entity_type':'HAZARD','entity_id':'HZRD-2026-442','event_type':'HAZARD_CREATED','payload':{'severity':'HIGH'}}
    changed = {**event, 'payload': {'severity':'MEDIUM'}}
    assert calculate_event_hash(event, None) != calculate_event_hash(changed, None)


def test_previous_hash_is_part_of_event_hash() -> None:
    event = {'entity_type':'HAZARD','entity_id':'HZRD-2026-442','event_type':'HAZARD_CREATED','payload':{}}
    assert calculate_event_hash(event, 'a'*64) != calculate_event_hash(event, 'b'*64)
