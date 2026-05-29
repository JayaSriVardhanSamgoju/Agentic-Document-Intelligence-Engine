from app.evaluation.metrics import (
    calculate_groundedness,
    hallucination_risk
)

print(
    calculate_groundedness(
        0.91
    )
)

print(
    hallucination_risk(
        0.91
    )
)