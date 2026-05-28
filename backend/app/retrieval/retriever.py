from typing import List

from langchain_core.documents import Document

from app.retrieval.embeddings import (
    EmbeddingModel
)

from app.retrieval.vector_store import (
    VectorStore
)

from app.core.config import settings
from app.utils.logger import get_logger


logger = get_logger()


class Retriever:
    """
    Handles semantic retrieval
    for document intelligence.
    """

    def __init__(self):
        self.embedder = (
            EmbeddingModel()
        )

        self.vector_store = (
            VectorStore()
        )

        self.top_k = (
            settings.TOP_K_RESULTS
        )

        try:
            self.vector_store.load_index()

            logger.info(
                "Retriever initialized successfully"
            )

        except Exception as error:
            logger.warning(
                f"Could not load index: {error}"
            )

    def retrieve(
        self,
        query: str,
        k: int = None
    ) -> List[Document]:
        """
        Retrieve relevant chunks.
        """

        if k is None:
            k = self.top_k

        logger.info(
            f"Searching for query: {query}"
        )

        query_embedding = (
            self.embedder.embed_query(
                query
            )
        )

        results = (
            self.vector_store.similarity_search(
                query_embedding=query_embedding,
                k=k
            )
        )

        logger.info(
            f"Retrieved {len(results)} chunks"
        )

        return results

    def format_context(
        self,
        documents: List[Document]
    ) -> str:
        """
        Convert retrieved chunks
        into LLM context.
        """

        context = "\n\n".join(
            [
                document.page_content
                for document in documents
            ]
        )

        return context