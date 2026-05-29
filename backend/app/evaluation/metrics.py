def calculate_groundedness(
    confidence: float
) -> float:
    """
    Estimate groundedness.
    """

    return round(
        confidence,
        2
    )


def hallucination_risk(
    confidence: float
) -> str:
    """
    Estimate hallucination risk.
    """

    if confidence >= 0.85:
        return "LOW"

    elif confidence >= 0.65:
        return "MEDIUM"

    return "HIGH"