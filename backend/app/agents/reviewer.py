
from typing import Any
from backend.app.verification import verify_evidence


def reviewer_node(state: dict[str, Any]) -> dict[str, Any]:
    evidence = state.get("evidence", [])
    proposed_route = state.get("proposed_route", {})

    verified, reason = verify_evidence(evidence, proposed_route)

    # Convert RAG results into the API Citation schema.
    citations = []

    for item in evidence:
        if not isinstance(item, dict):
            continue

        if not item.get("text") or not item.get("source"):
            continue

        citations.append({
            "source_title": item["source"],
            "source_version": str(item.get("version") or "Unknown"),
            "section": item.get("section") or "Not specified",
            "passage": item["text"],
            "source_url": item.get("source_url"),
        })

    return {
        "verified": verified,
        "result": {
            "status": "completed" if verified else "needs_human_review",
            "route_type": (
                "recommendation" if verified else "human_escalation"
            ),
            "recommended_regulator": (
                proposed_route.get("recommended_regulator")
                if verified else None
            ),
            "responsible_entity": state.get("entity_name"),
            "reason": reason,
            "citations": citations,
            "escalation_reason": None if verified else reason,
            "human_review_required": not verified,
        },
    }
