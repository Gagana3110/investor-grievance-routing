from typing import Any


def investigator_node(state: dict[str, Any]) -> dict[str, Any]:
    """Retrieve regulatory evidence for a complaint."""

    from app.tools.corpus_search import search_corpus

    complaint = state["complaint_text"]

    try:
        evidence = search_corpus(complaint)
    except Exception:
        evidence = []

    return {
        "evidence": evidence,
        "proposed_route": {
            "recommended_regulator": None,
            "reason": "Routing requires verified regulatory evidence.",
            "human_review_required": True,
        },
    }