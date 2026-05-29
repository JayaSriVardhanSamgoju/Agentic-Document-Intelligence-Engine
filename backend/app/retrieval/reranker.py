from sentence_transformers import (
    CrossEncoder
)

from app.utils.logger import (
    get_logger
)


logger = get_logger()


class Reranker:
    """
    Cross-encoder reranker
    for improving retrieval.
    """

    def __init__(self):

        logger.info(
            "Loading reranker model..."
        )

        self.model = (
            CrossEncoder(
                "cross-encoder/ms-marco-MiniLM-L-6-v2"
            )
        )

        logger.info(
            "Reranker loaded"
        )

    def rerank(
        self,
        query: str,
        documents: list,
        top_k: int = 5
    ):
        """
        Rerank retrieved docs.
        """

        if not documents:
            return []

        pairs = [

            (
                query,
                doc.page_content
            )

            for doc in documents
        ]

        scores = (
            self.model.predict(
                pairs
            )
        )

        ranked = sorted(
            zip(
                documents,
                scores
            ),
            key=lambda x: x[1],
            reverse=True
        )

        return [
            doc
            for doc, _
            in ranked[:top_k]
        ]