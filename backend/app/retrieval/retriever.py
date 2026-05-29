from rank_bm25 import (
    BM25Okapi
)

from app.retrieval.vector_store import (
    VectorStore
)

from app.retrieval.embeddings import (
    EmbeddingModel
)

from app.retrieval.reranker import (
    Reranker
)

from app.core.config import (
    settings
)

from app.utils.logger import (
    get_logger
)


logger = get_logger()


class Retriever:
    """
    Hybrid retriever:
    Dense Search
    + BM25
    + Reranking
    """

    def __init__(self):

        logger.info(
            "Initializing Retriever..."
        )

        # -------------------------
        # Models
        # -------------------------

        self.embedder = (
            EmbeddingModel()
        )

        self.vector_store = (
            VectorStore()
        )

        self.reranker = (
            Reranker()
        )

        # -------------------------
        # Load Saved Index
        # -------------------------

        try:

            self.vector_store.load_index()

            logger.info(
                "Vector index loaded"
            )

        except Exception as error:

            logger.warning(
                f"Could not load "
                f"index: {error}"
            )

        # -------------------------
        # Load Documents
        # -------------------------

        self.documents = (
            getattr(
                self.vector_store,
                "documents",
                []
            )
        )

        logger.info(
            f"Loaded "
            f"{len(self.documents)} "
            f"documents into "
            f"retriever"
        )

        # -------------------------
        # BM25 Setup
        # -------------------------

        self.bm25 = None

        if self.documents:

            try:

                corpus = [

                    doc.page_content
                    .lower()
                    .split()

                    for doc
                    in self.documents
                ]

                self.bm25 = (
                    BM25Okapi(
                        corpus
                    )
                )

                logger.info(
                    "BM25 initialized"
                )

            except Exception as error:

                logger.error(
                    f"BM25 failed: "
                    f"{error}"
                )

        logger.info(
            "Retriever initialized"
        )

    def retrieve(
        self,
        query: str,
        k: int = None
    ) -> list:
        """
        Hybrid retrieval:
        Dense + BM25 + Rerank
        """

        logger.info(
            f"Searching query: "
            f"{query}"
        )

        if (
            not self.documents
        ):

            logger.warning(
                "No indexed "
                "documents found."
            )

            return []

        top_k = (
            k
            or
            settings.TOP_K_RESULTS
        )

        try:

            # ---------------------
            # Dense Retrieval
            # ---------------------

            query_embedding = (
                self.embedder
                .embed_query(
                    query
                )
            )

            dense_docs = (
                self.vector_store
                .search(
                    embedding=
                    query_embedding,

                    top_k=
                    top_k
                )
            )

            logger.info(
                f"Dense search "
                f"returned "
                f"{len(dense_docs)} "
                f"docs"
            )

        except Exception as error:

            logger.error(
                f"Dense retrieval "
                f"failed: {error}"
            )

            dense_docs = []

        # -------------------------
        # BM25 Retrieval
        # -------------------------

        bm25_docs = []

        if self.bm25:

            try:

                tokenized_query = (
                    query
                    .lower()
                    .split()
                )

                scores = (
                    self.bm25
                    .get_scores(
                        tokenized_query
                    )
                )

                ranked_indices = (
                    sorted(
                        range(
                            len(scores)
                        ),

                        key=lambda i:
                        scores[i],

                        reverse=True
                    )
                )

                bm25_docs = [

                    self.documents[i]

                    for i in
                    ranked_indices[
                        :top_k
                    ]
                ]

                logger.info(
                    f"BM25 search "
                    f"returned "
                    f"{len(bm25_docs)} "
                    f"docs"
                )

            except Exception as error:

                logger.error(
                    f"BM25 retrieval "
                    f"failed: "
                    f"{error}"
                )

        # -------------------------
        # Merge Results
        # -------------------------

        merged_docs = list({

            (
                doc.metadata.get(
                    "source",
                    ""
                ),

                doc.metadata.get(
                    "chunk_id",
                    -1
                )
            ): doc

            for doc in (
                dense_docs
                + bm25_docs
            )

        }.values())

        logger.info(
            f"Merged "
            f"{len(merged_docs)} "
            f"documents"
        )

        # -------------------------
        # Reranking
        # -------------------------

        try:

            reranked_docs = (
                self.reranker
                .rerank(
                    query=query,

                    documents=
                    merged_docs,

                    top_k=
                    top_k
                )
            )

            logger.info(
                f"Reranked "
                f"{len(reranked_docs)} "
                f"documents"
            )

            return reranked_docs

        except Exception as error:

            logger.error(
                f"Reranking "
                f"failed: {error}"
            )

            return merged_docs[
                :top_k
            ]

    def format_context(
        self,
        documents: list
    ) -> str:
        """
        Convert documents
        into context.
        """

        if not documents:

            return ""

        return "\n\n".join(

            [
                doc.page_content
                for doc in
                documents
            ]
        )
