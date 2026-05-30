import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
from app.graph.state import AgentState
from app.utils.logger import get_logger
from app.utils.tracing import add_trace

logger = get_logger()


class PlannerAgent:
    """
    Breaks complex queries into smaller sub-queries
    and intelligently classifies the query type.
    """

    def __init__(self):
        self.llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME,
            temperature=0
        )

        self.prompt = ChatPromptTemplate.from_template(
            """
You are an intelligent query planner and classifier for an Enterprise AI Copilot.

Your task is twofold:
1. Classify the user's intent into one of three categories:
   - "document_question": Specifically asking about uploaded documents/data (e.g. "Summarize the uploaded file").
   - "general_knowledge": Asking about public, world, or current events (e.g. "Who won the cricket match?", "What is python?").
   - "mixed_query": Asking to compare/blend uploaded data with public/external trends (e.g. "Compare uploaded healthcare data to recent global trends").

2. Break the query down into 1-3 concise search terms or sub-queries.

User Query:
{query}

Respond ONLY with a valid JSON object in this exact format, with no markdown formatting or backticks:
{{
  "query_type": "document_question",
  "sub_queries": ["search term 1", "search term 2"]
}}
"""
        )

    def run(self, state: AgentState) -> AgentState:
        """
        Execute planning and classification.
        """
        query = state["query"]
        logger.info(f"Planning query: {query}")

        chain = self.prompt | self.llm
        response = chain.invoke({"query": query})

        query_type = "document_question"
        sub_queries = [query]

        try:
            content = response.content.strip()
            # Clean up markdown formatting if present
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
                
            parsed = json.loads(content)
            
            query_type = parsed.get("query_type", "document_question")
            sub_queries = parsed.get("sub_queries", [query])
            
            if not isinstance(sub_queries, list):
                sub_queries = [query]
                
        except Exception as e:
            logger.warning(f"Failed parsing planner output: {e}. Defaulting to document_question.")

        logger.info(f"Classification: {query_type} | Sub-queries: {len(sub_queries)}")

        return {
            **state,
            "query_type": query_type,
            "sub_queries": sub_queries,
            "agent_trace": add_trace(state, "planner")
        }