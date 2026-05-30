from langgraph.graph import StateGraph, END
from app.graph.state import AgentState
from app.agents.planner_agent import PlannerAgent
from app.agents.retriever_agent import RetrieverAgent
from app.agents.web_search_agent import WebSearchAgent
from app.agents.synthesizer_agent import SynthesizerAgent
from app.agents.verifier_agent import VerifierAgent
from app.guardrails.input_guardrails import InputGuardrails
from app.guardrails.output_guardrails import OutputGuardrails
from app.utils.logger import get_logger

logger = get_logger()

def route_after_input(state: AgentState) -> str:
    if state.get("is_safe") is False:
        return END
    return "planner"

def route_after_planner(state: AgentState) -> str:
    """Route conditionally based on query intent."""
    q_type = state.get("query_type", "document_question")
    if q_type == "general_knowledge":
        return "web_search"
    return "retriever"

def route_after_retriever(state: AgentState) -> str:
    """Route conditionally based on retrieval success or hybrid intent."""
    q_type = state.get("query_type", "document_question")
    docs = state.get("retrieved_docs", [])
    
    # If the user specifically asked a mixed query, or RAG failed to find anything
    if q_type == "mixed_query" or len(docs) == 0:
        return "web_search"
        
    return "synthesizer"

def route_after_output(state: AgentState) -> str:
    if state.get("is_safe") is False:
        return END
    return "verifier"

class AgentOrchestrator:
    """
    LangGraph orchestration for secure Hybrid Copilot workflow.
    """
    def __init__(self):
        logger.info("Initializing Hybrid Copilot workflow")

        self.input_guardrails = InputGuardrails()
        self.planner = PlannerAgent()
        self.retriever = RetrieverAgent()
        self.web_search = WebSearchAgent()
        self.synthesizer = SynthesizerAgent()
        self.output_guardrails = OutputGuardrails()
        self.verifier = VerifierAgent()

        workflow = StateGraph(AgentState)

        # Add nodes
        workflow.add_node("input_guardrails", self.input_guardrails.run)
        workflow.add_node("planner", self.planner.run)
        workflow.add_node("retriever", self.retriever.run)
        workflow.add_node("web_search", self.web_search.run)
        workflow.add_node("synthesizer", self.synthesizer.run)
        workflow.add_node("output_guardrails", self.output_guardrails.run)
        workflow.add_node("verifier", self.verifier.run)

        # Entry
        workflow.set_entry_point("input_guardrails")
        
        # 1. Input Guardrails
        workflow.add_conditional_edges("input_guardrails", route_after_input)

        # 2. Planner (Intent Classification)
        workflow.add_conditional_edges("planner", route_after_planner)

        # 3. Retriever (RAG)
        workflow.add_conditional_edges("retriever", route_after_retriever)
        
        # 4. Web Search -> Synthesizer
        workflow.add_edge("web_search", "synthesizer")

        # 5. Synthesizer -> Output Guardrails
        workflow.add_edge("synthesizer", "output_guardrails")

        # 6. Output Guardrails -> Verifier
        workflow.add_conditional_edges("output_guardrails", route_after_output)

        # 7. Verifier -> End
        workflow.add_edge("verifier", END)

        self.graph = workflow.compile()
        logger.info("Hybrid Copilot Workflow initialized")

    def run(self, query: str) -> AgentState:
        logger.info(f"Running workflow: {query}")

        initial_state = {
            "query": query,
            "query_type": "document_question",
            "sub_queries": [],
            "retrieved_docs": [],
            "context": "",
            "web_results": [],
            "source_type": "unknown",
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
            final_state = state

        logger.info("Workflow completed")
        return final_state