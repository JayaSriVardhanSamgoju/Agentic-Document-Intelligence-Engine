from langgraph.graph import (
    StateGraph,
    END
)

from app.graph.state import (
    AgentState
)

from app.agents.planner_agent import (
    PlannerAgent
)

from app.agents.retriever_agent import (
    RetrieverAgent
)

from app.agents.synthesizer_agent import (
    SynthesizerAgent
)

from app.agents.verifier_agent import (
    VerifierAgent
)

from app.utils.logger import (
    get_logger
)
from app.agents.guardrails import (
    GuardrailsAgent
)


logger = get_logger()


class AgentOrchestrator:
    """
    LangGraph orchestration
    for agentic workflow.
    """

    def __init__(self):

        logger.info(
            "Initializing agent workflow"
        )

        self.planner = (
            PlannerAgent()
        )

        self.retriever = (
            RetrieverAgent()
        )

        self.synthesizer = (
            SynthesizerAgent()
        )

        self.verifier = (
            VerifierAgent()
        )

        workflow = (
            StateGraph(
                AgentState
            )
        )
        self.guardrails = (
    GuardrailsAgent()
)

        # Add nodes
        workflow.add_node(
            "planner",
            self.planner.run
        )

        workflow.add_node(
            "retriever",
            self.retriever.run
        )

        workflow.add_node(
            "synthesizer",
            self.synthesizer.run
        )

        workflow.add_node(
            "verifier",
            self.verifier.run
        )
        workflow.add_node(
            "guardrails",
            self.guardrails.run
        )

        # Define flow
        workflow.set_entry_point(
            "guardrails"
        )

        workflow.add_edge(
            "guardrails",
            "planner"
        )

        workflow.add_edge(
            "planner",
            "retriever"
        )

        workflow.add_edge(
            "retriever",
            "synthesizer"
        )

        workflow.add_edge(
            "synthesizer",
            "verifier"
        )

        workflow.add_edge(
            "verifier",
            END
        )

        self.graph = (
            workflow.compile()
        )

        logger.info(
            "Workflow initialized"
        )

    def run(
        self,
        query: str
    ) -> AgentState:
        """
        Execute agentic workflow.
        """

        logger.info(
            f"Running workflow: "
            f"{query}"
        )

        initial_state = {
            "query": query
        }

        final_state = (
            self.graph.invoke(
                initial_state
            )
        )

        logger.info(
            "Workflow completed"
        )

        return final_state