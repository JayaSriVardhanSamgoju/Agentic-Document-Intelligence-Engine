from langchain_groq import (
    ChatGroq
)

from langchain_core.prompts import (
    ChatPromptTemplate
)

from app.core.config import (
    settings
)

from app.graph.state import (
    AgentState
)

from app.utils.logger import (
    get_logger
)


logger = get_logger()


class SynthesizerAgent:
    """
    Generates grounded answers
    from retrieved context.
    """

    def __init__(self):

        self.llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME
        )

        self.prompt = (
            ChatPromptTemplate.from_template(
                """
You are an expert
document intelligence
assistant.

Your task:
Generate a high-quality
answer ONLY using the
provided context.

Rules:
- Do NOT hallucinate
- Do NOT invent facts
- Stay grounded
- Be concise but complete
- If answer is missing,
say:

"I could not find
relevant information
in the uploaded documents."

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

        query = state.get(
            "query",
            ""
        )

        context = state.get(
            "context",
            ""
        )

        logger.info(
            "Running synthesis"
        )

        chain = (
            self.prompt
            | self.llm
        )

        response = chain.invoke(
            {
                "context": context,
                "query": query
            }
        )

        draft_answer = (
            response.content
        )

        logger.info(
            "Draft answer generated"
        )

        return {
    **state,
    "draft_answer":
    draft_answer
}