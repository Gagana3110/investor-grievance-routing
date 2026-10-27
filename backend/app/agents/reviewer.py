from typing import Any
from app.verification import verify_evidence


def reviewer_node(state: dict[str, Any]) -> dict[str, Any]:
    evidence = state.get("evidence", [])
    proposed_route = state.get("proposed_route", {})

    verified, reason = verify_evidence(evidence, proposed_route)

    return {
        "verified": verified,
        "result": {
            "status": "completed" if verified else "needs_human_review",
            "route_type": "recommendation" if verified else "human_escalation",
            "recommended_regulator": (
                proposed_route.get("recommended_regulator") if verified else None
            ),
            "responsible_entity": state.get("entity_name"),
            "reason": reason,
            "citations": evidence if verified else [],
            "escalation_reason": None if verified else reason,
            "human_review_required": not verified,
        },
    }