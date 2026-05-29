from langgraph.graph import StateGraph, END
from app.graph.state import AgentState
from app.agents.planner_agent import PlannerAgent
from app.agents.retriever_agent import RetrieverAgent
from app.agents.synthesizer_agent import SynthesizerAgent
from app.agents.verifier_agent import VerifierAgent
from app.guardrails.input_guardrails import InputGuardrails
from app.guardrails.output_guardrails import OutputGuardrails
from app.utils.logger import get_logger

logger = get_logger()

def route_after_input(state: AgentState) -> str:
    """Route conditionally after input guardrails."""
    if state.get("is_safe") is False:
        return END
    return "planner"

def route_after_output(state: AgentState) -> str:
    """Route conditionally after output guardrails."""
    if state.get("is_safe") is False:
        return END
    return "verifier"

class AgentOrchestrator:
    """
    LangGraph orchestration for secure agentic workflow.
    """

    def __init__(self):
        logger.info("Initializing secure agent workflow")

        self.input_guardrails = InputGuardrails()
        self.planner = PlannerAgent()
        self.retriever = RetrieverAgent()
        self.synthesizer = SynthesizerAgent()
        self.output_guardrails = OutputGuardrails()
        self.verifier = VerifierAgent()

        workflow = StateGraph(AgentState)

        # Add nodes
        workflow.add_node("input_guardrails", self.input_guardrails.run)
        workflow.add_node("planner", self.planner.run)
        workflow.add_node("retriever", self.retriever.run)
        workflow.add_node("synthesizer", self.synthesizer.run)
        workflow.add_node("output_guardrails", self.output_guardrails.run)
        workflow.add_node("verifier", self.verifier.run)

        # Define flow
        workflow.set_entry_point("input_guardrails")
        
        # Conditional edge after input guardrails
        workflow.add_conditional_edges(
            "input_guardrails",
            route_after_input
        )

        workflow.add_edge("planner", "retriever")
        workflow.add_edge("retriever", "synthesizer")
        workflow.add_edge("synthesizer", "output_guardrails")

        # Conditional edge after output guardrails
        workflow.add_conditional_edges(
            "output_guardrails",
            route_after_output
        )

        workflow.add_edge("verifier", END)

        self.graph = workflow.compile()
        logger.info("Secure Workflow initialized")

    def run(self, query: str) -> AgentState:
        """
        Execute agentic workflow.
        """
        logger.info(f"Running workflow: {query}")

        initial_state = {
            "query": query,
            "agent_trace": [],
            "is_safe": True,
            "blocked_reason": None,
            "draft_answer": "",
            "verification_notes": "No verification performed.",
            "confidence_score": 0.0,
            "citations": []
        }

        logger.info("Starting Graph Execution...")
        
        final_state = None
        for state in self.graph.stream(initial_state, stream_mode="values"):
            logger.info("--- Graph State Update ---")
            logger.info(str(state))
            final_state = state

        logger.info(f"[FINAL GRAPH STATE]:\n{final_state}")
        logger.info("Workflow completed")

        return final_state