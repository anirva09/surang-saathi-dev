import hashlib
import json


def canonical_json(payload: dict) -> str:
    return json.dumps(
        payload,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )


def calculate_event_hash(event: dict, previous_hash: str | None) -> str:
    material = canonical_json(
        {
            "event": event,
            "previous_hash": previous_hash,
        }
    ).encode("utf-8")

    return hashlib.sha256(material).hexdigest()
