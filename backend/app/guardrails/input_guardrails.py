from app.graph.state import AgentState
from app.utils.logger import get_logger
from app.utils.tracing import add_trace
from app.guardrails.security_rules import SecurityRules

logger = get_logger()

class InputGuardrails:
    """
    Pre-processing validation layer to intercept
    malicious or invalid user queries before they
    reach the core agents.
    """

    def __init__(self):
        self.rules = SecurityRules()

    def run(self, state: AgentState) -> AgentState:
        """
        Validate user query.
        """
        query = state.get("query", "")

        logger.info("Running Input Guardrails")

        is_safe, blocked_reason = self.rules.validate_input(query)

        if not is_safe:
            logger.warning(f"Input Guardrails blocked query. Reason: {blocked_reason}")
            return {
                **state,
                "is_safe": False,
                "blocked_reason": blocked_reason,
                "draft_answer": "Your query was blocked by security policies.",
                "confidence_score": 0.0,
                "agent_trace": add_trace(state, "input_guardrails", status="blocked")
            }

        logger.info("Input Guardrails passed")
        return {
            **state,
            "is_safe": True,
            "blocked_reason": None,
            "agent_trace": add_trace(state, "input_guardrails", status="passed")
        }
