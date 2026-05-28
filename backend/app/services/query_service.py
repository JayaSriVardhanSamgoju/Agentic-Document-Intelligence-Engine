from app.agents.orchestrator import (
    AgentOrchestrator
)

from app.utils.logger import (
    get_logger
)


logger = get_logger()


class QueryService:
    """
    Handles agentic querying.
    """

    def __init__(self):

        logger.info(
            "Initializing Query Service..."
        )

        self.orchestrator = (
            AgentOrchestrator()
        )

        logger.info(
            "Query Service initialized"
        )

    def ask(
        self,
        query: str
    ) -> dict:
        """
        Execute agentic workflow.
        """

        logger.info(
            f"Received query: {query}"
        )

        result = (
            self.orchestrator.run(
                query
            )
        )

        print("\nFINAL RESULT:")
        print(result)

        return {
    "answer":
    result.get(
        "draft_answer",
        "No answer generated."
    ),

    "confidence_score":
    result.get(
        "confidence_score",
        0.5
    ),

    "verification_notes":
    result.get(
        "verification_notes",
        ""
    ),

    "citations":
    result.get(
        "citations",
        []
    )
}