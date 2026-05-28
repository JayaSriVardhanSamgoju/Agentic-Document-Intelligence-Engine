from langchain_groq import ChatGroq
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


class PlannerAgent:
    """
    Breaks complex queries
    into smaller sub-queries.
    """

    def __init__(self):

        self.llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME
        )

        self.prompt = (
            ChatPromptTemplate.from_template(
                """
You are a query planning agent.

Your task is to break
the user's query into
smaller meaningful
search tasks.

Rules:
- Keep sub-queries concise
- Avoid redundancy
- If query is simple,
return one search query

User Query:
{query}

Return ONLY a Python list.

Example:
[
"main topics",
"summary"
]
"""
            )
        )

    def run(
        self,
        state: AgentState
    ) -> AgentState:
        """
        Execute planning.
        """

        query = state["query"]

        logger.info(
            f"Planning query: {query}"
        )

        chain = (
            self.prompt
            | self.llm
        )

        response = chain.invoke(
            {
                "query": query
            }
        )

        try:

            sub_queries = eval(
                response.content
            )

            if not isinstance(
                sub_queries,
                list
            ):
                sub_queries = [query]

        except Exception:

            logger.warning(
                "Failed parsing "
                "sub-queries."
            )

            sub_queries = [query]

        logger.info(
            f"Generated "
            f"{len(sub_queries)} "
            f"sub-queries"
        )

        return {
    **state,
    "sub_queries":
    sub_queries
}