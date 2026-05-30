from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
from app.graph.state import AgentState
from app.utils.logger import get_logger
from app.utils.tracing import add_trace

logger = get_logger()


class SynthesizerAgent:
    """
    Generates grounded answers from retrieved context 
    (Document RAG) and/or Web Search context.
    """

    def __init__(self):
        self.llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME,
            temperature=0,
            streaming=True
        )

        self.prompt = ChatPromptTemplate.from_template(
            """
You are an expert Enterprise AI Copilot.

You have access to context from private uploaded documents, and/or public web search results.

Document Context:
{document_context}

Web Search Context:
{web_context}

Question:
{query}

Rules:
1. Synthesize a clear, highly accurate answer based ONLY on the provided contexts.
2. If the answer is primarily from Web Search Context, append a brief disclaimer: "\n\n*Source: Public Web Search (external)*"
3. If information is contradictory, prioritize the Document Context but mention the discrepancy.
4. If neither context contains the answer, explicitly state that you cannot find the information.

Answer:
"""
        )

    def run(self, state: AgentState) -> AgentState:
        """
        Generate draft answer from hybrid context.
        """
        query = state.get("query", "")
        document_context = state.get("context", "")
        
        web_results = state.get("web_results", [])
        web_context = "\n\n".join(web_results) if web_results else ""

        logger.info("Running synthesis (Hybrid Context)")

        # Safety check
        if not document_context and not web_context:
            logger.warning("No context found from Documents or Web")
            return {
                **state,
                "draft_answer": "I could not find relevant information in the uploaded documents or public web search.",
                "agent_trace": add_trace(state, "synthesizer", status="failed")
            }

        try:
            chain = self.prompt | self.llm
            response = chain.invoke(
                {
                    "document_context": document_context,
                    "web_context": web_context,
                    "query": query
                }
            )

            draft_answer = response.content
            logger.info("Draft answer generated")

            return {
                **state,
                "draft_answer": draft_answer,
                "agent_trace": add_trace(state, "synthesizer")
            }

        except Exception as error:
            logger.error(f"Synthesis failed: {error}")
            return {
                **state,
                "draft_answer": "Answer generation failed due to a system error.",
                "agent_trace": add_trace(state, "synthesizer", status="failed")
            }
