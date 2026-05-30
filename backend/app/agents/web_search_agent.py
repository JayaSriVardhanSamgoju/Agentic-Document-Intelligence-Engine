import os
from tavily import TavilyClient
from datetime import datetime
from app.core.config import settings
from app.graph.state import AgentState
from app.utils.logger import get_logger
from app.utils.tracing import add_trace

logger = get_logger()

class WebSearchAgent:
    """
    Autonomous Web Search Agent.
    Fetches real-time context from the web using the Tavily Search API.
    """

    def __init__(self):
        logger.info("Initializing Web Search Agent (Tavily)...")
        # Initialize the client from Pydantic settings which automatically parses .env
        self.tavily_api_key = settings.TAVILY_API_KEY or settings.TAVILY_SEARCH_API or ""
        if self.tavily_api_key:
            self.client = TavilyClient(api_key=self.tavily_api_key)
        else:
            self.client = None
            logger.warning("TAVILY_API_KEY not found in environment variables.")

    def run(self, state: AgentState) -> AgentState:
        """
        Execute web search via Tavily.
        """
        logger.info("Executing Web Search with Tavily...")
        
        # Determine the search query
        sub_queries = state.get("sub_queries", [])
        search_query = sub_queries[0] if sub_queries else state.get("query", "")
        
        web_results = []
        citations = state.get("citations", [])
        
        if not self.client:
            logger.error("Cannot perform web search: Tavily API key is missing.")
            web_results.append("Web search skipped: API key missing.")
            return {
                **state,
                "web_results": web_results,
                "agent_trace": add_trace(state, "web_search_agent", status="failed")
            }
        
        try:
            # Execute search
            response = self.client.search(
                query=search_query,
                search_depth="advanced",
                max_results=3
            )
            
            results = response.get("results", [])
            
            for res in results:
                snippet = res.get("content", "")
                url = res.get("url", "")
                title = res.get("title", "")
                
                web_results.append(
                    f"Title: {title}\nSource: {url}\nContent: {snippet}"
                )
                
                # Add to citations for UI rendering
                citations.append({
                    "source": url,
                    "chunk_id": "web"
                })
                
            logger.info(f"Tavily search completed: {len(results)} results found.")
            
        except Exception as e:
            logger.error(f"Tavily web search failed: {e}")
            web_results.append("Web search failed or timed out.")

        return {
            **state,
            "web_results": web_results,
            "citations": citations,
            "agent_trace": add_trace(state, "web_search_agent")
        }
