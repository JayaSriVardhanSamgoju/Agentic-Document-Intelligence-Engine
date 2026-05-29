from app.observability.metrics import (
    calculate_latency
)


class ObservabilityMonitor:
    """
    AI observability engine.
    """

    def generate_report(
        self,
        trace: list,
        confidence: float
    ) -> dict:

        timings = (
            calculate_latency(
                trace
            )
        )

        total_latency = (
            sum(
                timings.values()
            )
        )

        risk_level = (
            "low"
            if confidence >= 0.85
            else "medium"
            if confidence >= 0.65
            else "high"
        )

        return {

            "latency_ms":
            round(
                total_latency,
                2
            ),

            "agent_timings":
            timings,

            "pipeline_health":
            "healthy",

            "risk_level":
            risk_level
        }