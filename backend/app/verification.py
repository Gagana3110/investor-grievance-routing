def verify_evidence(
    evidence: list[dict],
    proposed_route: dict
) -> tuple[bool, str]:
    """Check evidence quality and consistency before accepting a route."""

    if not evidence:
        return False, "No regulatory evidence was retrieved."

    regulator = proposed_route.get("recommended_regulator")

    if regulator not in {"RBI", "SEBI"}:
        return False, "No valid regulator proposed."

    valid_evidence = []

    for item in evidence:
        if not isinstance(item, dict):
            return False, "Malformed evidence record."

        if not item.get("text") or not item.get("source"):
            return False, "Evidence is missing its text or source."

        if item.get("regulator") not in {"RBI", "SEBI"}:
            continue

        valid_evidence.append(item)

    if not valid_evidence:
        return False, "No usable regulatory evidence found."

    # Check whether the retrieved evidence supports the proposed regulator.
    matching_evidence = [
        item for item in valid_evidence
        if item.get("regulator") == regulator
    ]

    if not matching_evidence:
        return False, (
            f"Retrieved evidence does not support the proposed regulator: "
            f"{regulator}."
        )

    # Evidence relevance and legal jurisdiction still need independent review.
    return False, (
        "Evidence records are consistent with the proposed regulator, "
        "but independent legal and jurisdiction verification is pending."
    )