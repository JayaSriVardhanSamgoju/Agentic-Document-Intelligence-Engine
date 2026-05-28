from sentence_transformers import SentenceTransformer
from typing import List

from app.utils.logger import get_logger


logger = get_logger()


class EmbeddingModel:
    """
    Handles document embeddings.
    """

    def __init__(self):
        logger.info(
            "Loading embedding model..."
        )

        self.model = SentenceTransformer(
            "BAAI/bge-small-en-v1.5"
        )

        logger.info(
            "Embedding model loaded successfully"
        )

    def embed_documents(
        self,
        texts: List[str]
    ) -> List[List[float]]:
        """
        Generate embeddings for documents.
        """

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True
        )

        logger.info(
            f"Generated embeddings for {len(texts)} chunks"
        )

        return embeddings.tolist()

    def embed_query(
        self,
        query: str
    ) -> List[float]:
        """
        Generate embedding for query.
        """

        embedding = self.model.encode(
            query,
            normalize_embeddings=True
        )

        logger.info(
            "Generated query embedding"
        )

        return embedding.tolist()