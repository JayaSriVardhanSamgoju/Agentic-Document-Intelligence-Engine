from app.graph.state import (
    AgentState
)

from app.retrieval.retriever import (
    Retriever
)

from app.utils.logger import (
    get_logger
)
from app.utils.tracing import (
    add_trace
)


logger = get_logger()


class RetrieverAgent:
    """
    Retrieves relevant
    chunks using planned
    sub-queries.
    """

    def __init__(self):

        self.retriever = (
            Retriever()
        )

    def run(
        self,
        state: AgentState
    ) -> AgentState:
        """
        Execute retrieval.
        """

        sub_queries = state.get(
            "sub_queries"
        )

        if not sub_queries:

            sub_queries = [
                state["query"]
            ]

        logger.info(
            f"Running retrieval "
            f"for {len(sub_queries)} "
            f"queries"
        )

        retrieved_docs = []

        for query in sub_queries:

            logger.info(
                f"Searching: {query}"
            )

            docs = (
                self.retriever.retrieve(
                    query=query,
                    k=3
                )
            )

            retrieved_docs.extend(
                docs
            )

        # Remove duplicates
        unique_docs = []

        seen_chunks = set()

        for document in (
            retrieved_docs
        ):

            chunk_id = (
                document.metadata.get(
                    "chunk_id"
                )
            )

            if chunk_id not in (
                seen_chunks
            ):

                seen_chunks.add(
                    chunk_id
                )

                unique_docs.append(
                    document
                )

        context = (
            self.retriever
            .format_context(
                unique_docs
            )
        )
        citations = []

        for doc in unique_docs:
            source = doc.metadata.get("source", "unknown")
            chunk_id = doc.metadata.get("chunk_id", -1)
            
            # Extract just the filename from the path if needed
            if "/" in source or "\\" in source:
                import os
                source = os.path.basename(source)
                
            citations.append({
                "source": source,
                "chunk_id": int(chunk_id) if str(chunk_id).isdigit() else -1
            })

        logger.info(
            f"Retrieved "
            f"{len(unique_docs)} "
            f"unique chunks"
        )

        return {
    **state,

    "retrieved_docs":
    unique_docs,

    "context":
    context,

    "citations":
    citations,

    "agent_trace":
    add_trace(
        state,
        "retriever"
    )
}