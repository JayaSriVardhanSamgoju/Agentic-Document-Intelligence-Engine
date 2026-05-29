from app.agents.orchestrator import AgentOrchestrator
from app.utils.logger import get_logger
from app.utils.tracing import add_trace

logger = get_logger()

class QueryService:
    """
    Handles agentic querying.
    """

    def __init__(self):

        logger.info("Initializing Query Service...")
        self.orchestrator = AgentOrchestrator()
        logger.info("Query Service initialized")

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

        return {
            "answer": result.get("draft_answer", "No answer generated."),
            "confidence_score": result.get("confidence_score", 0.0),
            "verification_notes": reasoning,
            "citations": result.get("citations", []),
            "agent_trace": result.get("agent_trace", [])
        }
