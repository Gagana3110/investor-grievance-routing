def verify_evidence(evidence: list[dict], proposed_route: dict) -> tuple[bool, str]:
    if not evidence:
        return False, "No regulatory evidence was retrieved."

    for item in evidence:
        if not isinstance(item, dict):
            return False, "Malformed evidence record."
        if not item.get("text") or not item.get("source"):
            return False, "Evidence is missing its text or source."

    if not proposed_route.get("recommended_regulator"):
        return False, "No regulator proposed."

    # Presence of a passage alone does not prove jurisdiction.
    return False, "Independent regulatory support verification is pending."