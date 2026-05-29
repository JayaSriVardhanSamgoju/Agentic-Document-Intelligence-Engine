from app.agents.orchestrator import (
    AgentOrchestrator
)

from app.utils.logger import (
    get_logger
)

from app.evaluation.evaluator import (
    Evaluator
)

from app.observability.monitor import (
    ObservabilityMonitor
)

from app.memory.session_manager import (
    memory_store
)


logger = get_logger()


class QueryService:
    """
    Handles agentic querying
    with memory, evaluation,
    observability, and
    guardrails.
    """

    def __init__(self):

        logger.info(
            "Initializing Query Service..."
        )

        self.orchestrator = (
            AgentOrchestrator()
        )

        self.evaluator = (
            Evaluator()
        )

        self.monitor = (
            ObservabilityMonitor()
        )

        logger.info(
            "Query Service initialized"
        )

    def ask(
        self,
        query: str,
        session_id: str = "default"
    ) -> dict:
        """
        Execute agentic workflow.
        """

        logger.info(
            f"Received query: {query}"
        )

        # --------------------------
        # Get Conversation History
        # --------------------------

        history = (
            memory_store.get_history(
                session_id
            )
        )

        conversation_context = ""

        for message in history[-5:]:

            conversation_context += (
                f"{message['role']}: "
                f"{message['content']}\n"
            )

        # --------------------------
        # Save User Query
        # --------------------------

        memory_store.add_message(
            session_id=session_id,
            role="user",
            content=query
        )

        # --------------------------
        # Enhanced Query
        # --------------------------

        enhanced_query = (
            f"Conversation History:\n"
            f"{conversation_context}\n\n"
            f"Current Query:\n"
            f"{query}"
        )

        # --------------------------
        # Run Agent Workflow
        # --------------------------

        result = (
            self.orchestrator.run(
                enhanced_query
            )
        )

        logger.info(
            "Workflow execution completed"
        )

        print("\nFINAL RESULT:")
        print(result)

        # --------------------------
        # Safe Result Extraction
        # --------------------------

        answer = result.get(
            "draft_answer",
            "No answer generated."
        )

        confidence_score = (
            result.get(
                "confidence_score",
                0.5
            )
        )

        citations = (
            result.get(
                "citations",
                []
            )
        )

        reasoning = (
            result.get(
                "verification_notes",
                "No verification available."
            )
        )

        agent_trace = (
            result.get(
                "agent_trace",
                []
            )
        )

        # --------------------------
        # Guardrails Check
        # --------------------------

        if (
            result.get(
                "is_safe"
            ) is False
        ):

            answer = (
                "Request blocked "
                "by security policy."
            )

            reasoning = (
                f"BLOCKED: "
                f"{result.get('blocked_reason', 'Security policy violation.')}"
            )

        # --------------------------
        # Save Assistant Response
        # --------------------------

        memory_store.add_message(
            session_id=session_id,
            role="assistant",
            content=answer
        )

        # --------------------------
        # Evaluation
        # --------------------------

        evaluation = (
            self.evaluator.evaluate(
                confidence_score=
                confidence_score,

                citations_count=
                len(citations)
            )
        )

        # --------------------------
        # Observability
        # --------------------------

        observability = (
            self.monitor.generate_report(
                trace=
                agent_trace,

                confidence=
                confidence_score
            )
        )

        logger.info(
            "Response generated successfully"
        )

        return {

            "answer":
            answer,

            "confidence_score":
            confidence_score,

            "reasoning":
            reasoning,

            "citations":
            citations,

            "agent_trace":
            agent_trace,

            "evaluation":
            evaluation,

            "observability":
            observability
        }

