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

import os


logger = get_logger()


class RetrieverAgent:
    """
    Retrieves relevant
    chunks using planned
    sub-queries with
    hybrid retrieval.
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

        sub_queries = (
            state.get(
                "sub_queries",
                []
            )
        )

        if not sub_queries:

            sub_queries = [

                state.get(
                    "query",
                    ""
                )
            ]

        logger.info(
            f"Running retrieval "
            f"for {len(sub_queries)} "
            f"queries"
        )

        retrieved_docs = []

        # --------------------------
        # Execute Retrieval
        # --------------------------

        for query in sub_queries:

            logger.info(
                f"Searching: "
                f"{query}"
            )

            try:

                docs = (
                    self.retriever
                    .retrieve(
                        query=query
                    )
                )

                retrieved_docs.extend(
                    docs
                )

            except Exception as error:

                logger.error(
                    f"Retrieval failed "
                    f"for query "
                    f"'{query}': "
                    f"{error}"
                )

        # --------------------------
        # Remove Duplicates
        # --------------------------

        unique_docs = []

        seen_chunks = set()

        for document in (
            retrieved_docs
        ):

            chunk_id = (
                document.metadata.get(
                    "chunk_id",
                    -1
                )
            )

            source = (
                document.metadata.get(
                    "source",
                    "unknown"
                )
            )

            unique_key = (
                source,
                chunk_id
            )

            if (
                unique_key
                not in seen_chunks
            ):

                seen_chunks.add(
                    unique_key
                )

                unique_docs.append(
                    document
                )

        # --------------------------
        # Format Context
        # --------------------------

        context = (
            self.retriever
            .format_context(
                unique_docs
            )
        )

        # --------------------------
        # Generate Citations
        # --------------------------

        citations = []

        for doc in unique_docs:

            source = (
                doc.metadata.get(
                    "source",
                    "unknown"
                )
            )

            chunk_id = (
                doc.metadata.get(
                    "chunk_id",
                    -1
                )
            )

            source = (
                os.path.basename(
                    source
                )
            )

            citations.append(
                {
                    "source":
                    source,

                    "chunk_id":
                    int(chunk_id)
                    if str(
                        chunk_id
                    ).isdigit()
                    else -1
                }
            )

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
