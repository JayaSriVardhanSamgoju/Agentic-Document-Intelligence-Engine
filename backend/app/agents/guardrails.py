import re

from app.graph.state import (
    AgentState
)

from app.utils.logger import (
    get_logger
)


logger = get_logger()


class GuardrailsAgent:
    """
    Security and safety
    validation layer.
    """

    def __init__(self):

        self.blocked_patterns = [

            r"ignore previous instructions",

            r"system prompt",

            r"reveal hidden prompt",

            r"jailbreak",

            r"pretend you are",

            r"bypass restrictions",

            r"developer message",

            r"act as admin"
        ]

    def run(
        self,
        state: AgentState
    ) -> AgentState:
        """
        Validate user query.
        """

        query = (
            state.get(
                "query",
                ""
            )
            .strip()
            .lower()
        )

        logger.info(
            "Running guardrails"
        )

        # Empty query
        if not query:

            logger.warning(
                "Empty query blocked"
            )

            return {
                **state,
                "final_answer":
                (
                    "Query cannot "
                    "be empty."
                ),

                "confidence_score":
                0.0
            }

        # Prompt injection detection
        for pattern in (
            self.blocked_patterns
        ):

            if re.search(
                pattern,
                query
            ):

                logger.warning(
                    f"Blocked query: "
                    f"{query}"
                )

                return {
                    **state,
                    "final_answer":
                    (
                        "Unsafe query "
                        "detected and "
                        "blocked."
                    ),

                    "confidence_score":
                    0.0
                }

        logger.info(
            "Guardrails passed"
        )

        return state