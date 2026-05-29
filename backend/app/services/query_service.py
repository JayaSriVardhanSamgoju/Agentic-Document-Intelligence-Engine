from app.agents.orchestrator import AgentOrchestrator
from app.utils.logger import get_logger
from app.utils.tracing import add_trace
from app.evaluation.evaluator import (
    Evaluator
)

logger = get_logger()

class QueryService:
    """
    Handles agentic querying.
    """

    def __init__(self):

        logger.info("Initializing Query Service...")
        self.orchestrator = AgentOrchestrator()
        logger.info("Query Service initialized")
        self.evaluator = (
    Evaluator()
)

    def ask(
        self,
        query: str
    ) -> dict:
        """
        Execute agentic workflow.
        """

        logger.info(f"Received query: {query}")

        result = self.orchestrator.run(query)

        print("\nFINAL RESULT:")
        print(result)

        reasoning = result.get("verification_notes", "")
        if result.get("is_safe") is False:
            reasoning = f"BLOCKED: {result.get('blocked_reason', 'Security policy violation.')}"
        evaluation = (
    self.evaluator.evaluate(
        confidence_score=
        result.get(
            "confidence_score",
            0.5
        ),

        citations_count=
        len(
            result.get(
                "citations",
                []
            )
        )
    )
)

        return {
            "answer": result.get("draft_answer", "No answer generated."),
            "confidence_score": result.get("confidence_score", 0.0),
            "reasoning": reasoning,
            "citations": result.get("citations", []),
            "agent_trace": result.get("agent_trace", []),
            "evaluation": evaluation
        }
