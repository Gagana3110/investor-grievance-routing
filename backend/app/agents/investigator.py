from typing import Any


def investigator_node(state: dict[str, Any]) -> dict[str, Any]:
    """Retrieve regulatory evidence and propose a preliminary regulator."""

    from backend.app.tools.corpus_search import search_corpus

    complaint = state["complaint_text"]

    try:
        evidence = search_corpus(complaint)
    except Exception:
        evidence = []

    # Count the regulators represented in the retrieved evidence.
    regulator_counts = {"RBI": 0, "SEBI": 0}

    for item in evidence:
        regulator = item.get("regulator")
        if regulator in regulator_counts:
            regulator_counts[regulator] += 1

    # Propose a regulator only when the retrieved evidence has a clear majority.
    rbi_count = regulator_counts["RBI"]
    sebi_count = regulator_counts["SEBI"]

    recommended_regulator = None

    if rbi_count > sebi_count:
        recommended_regulator = "RBI"
    elif sebi_count > rbi_count:
        recommended_regulator = "SEBI"

    if recommended_regulator:
        reason = (
            f"Preliminary routing proposal based on retrieved evidence: "
            f"{recommended_regulator} appears in more retrieved records."
        )
    else:
        reason = (
            "Retrieved evidence does not establish a clear regulator. "
            "Human review is required."
        )

    return {
        "evidence": evidence,
        "proposed_route": {
            "recommended_regulator": recommended_regulator,
            "reason": reason,
            "human_review_required": True,
        },
    }