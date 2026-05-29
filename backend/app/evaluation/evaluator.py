from app.evaluation.metrics import (
    calculate_groundedness,
    hallucination_risk
)


class Evaluator:
    """
    Evaluate response quality.
    """

    def evaluate(
        self,
        confidence_score: float,
        citations_count: int
    ) -> dict:
        """
        Generate evaluation metrics.
        """

        groundedness = (
            calculate_groundedness(
                confidence_score
            )
        )

        hallucination = (
            hallucination_risk(
                confidence_score
            )
        )

        retrieval_quality = (
            min(
                citations_count * 0.2,
                1.0
            )
        )

        answer_completeness = (
            round(
                (
                    confidence_score
                    + retrieval_quality
                ) / 2,
                2
            )
        )

        return {
            "groundedness":
            groundedness,

            "hallucination_risk":
            hallucination,

            "retrieval_quality":
            round(
                retrieval_quality,
                2
            ),

            "answer_completeness":
            answer_completeness
        }