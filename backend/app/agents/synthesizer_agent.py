from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
from app.graph.state import AgentState
from app.utils.logger import get_logger
from app.utils.tracing import add_trace

logger = get_logger()


class SynthesizerAgent:
    """
    Generates grounded answers
    from retrieved context.
    """

    def __init__(self):

        self.llm = ChatGroq(
    groq_api_key=
    settings.GROQ_API_KEY,

    model_name=
    settings.MODEL_NAME,

    temperature=0,

    streaming=True
)

        self.prompt = (
            ChatPromptTemplate.from_template(
                """
You are an expert document assistant.

Answer ONLY using the
provided context.

If the answer cannot be found
in the context, say:

"I could not find relevant
information in the uploaded
documents."

Context:
{context}

Question:
{query}

Answer:
"""
            )
        )

    def run(
        self,
        state: AgentState
    ) -> AgentState:
        """
        Generate draft answer.
        """

        query = state.get("query", "")
        context = state.get("context", "")

        logger.info("Running synthesis")

        # Safety check
        if not context:
            logger.warning("No context found")
            return {
                "draft_answer": "No relevant document context found.",
                "agent_trace": add_trace(state, "synthesizer")
            }

        try:
            chain = self.prompt | self.llm
            response = chain.invoke(
                {
                    "context": context,
                    "query": query
                }
            )

            draft_answer = response.content

            logger.info("Draft answer generated")

            return {
                "draft_answer": draft_answer,
                "agent_trace": add_trace(state, "synthesizer")
            }

        except Exception as error:
            logger.error(f"Synthesis failed: {error}")
            return {
                "draft_answer": "Answer generation failed.",
                "agent_trace": add_trace(state, "synthesizer", status="failed")
            }
