from pathlib import Path
from typing import List

import faiss
import numpy as np
import pickle

from langchain_core.documents import Document

from app.utils.logger import get_logger
from app.core.config import settings


logger = get_logger()


class VectorStore:
    """
    Handles FAISS vector storage
    and semantic retrieval.
    """

    def __init__(self):
        self.index = None
        self.documents = []

        self.db_path = Path(
            settings.CHROMA_DB_PATH
        )

        self.db_path.mkdir(
            parents=True,
            exist_ok=True
        )

        self.index_path = (
            self.db_path / "faiss.index"
        )

        self.metadata_path = (
            self.db_path / "documents.pkl"
        )

    def create_index(
        self,
        embeddings: List[List[float]],
        documents: List[Document]
    ):
        """
        Create FAISS index.
        """

        embedding_array = np.array(
            embeddings,
            dtype=np.float32
        )

        dimension = embedding_array.shape[1]

        self.index = faiss.IndexFlatL2(
            dimension
        )

        self.index.add(
            embedding_array
        )

        self.documents = documents

        logger.info(
            f"Created vector index "
            f"with {len(documents)} chunks"
        )

    def save_index(self):
        """
        Save index locally.
        """

        if self.index is None:
            raise ValueError(
                "No index found to save."
            )

        faiss.write_index(
            self.index,
            str(self.index_path)
        )

        with open(
            self.metadata_path,
            "wb"
        ) as file:
            pickle.dump(
                self.documents,
                file
            )

        logger.info(
            "Vector index saved"
        )

    def load_index(self):
        """
        Load saved index.
        """

        if not self.index_path.exists():
            raise FileNotFoundError(
                "No saved index found."
            )

        self.index = faiss.read_index(
            str(self.index_path)
        )

        with open(
            self.metadata_path,
            "rb"
        ) as file:
            self.documents = pickle.load(
                file
            )

        logger.info(
            "Vector index loaded"
        )

    def similarity_search(
        self,
        query_embedding: List[float],
        k: int = 5
    ) -> List[Document]:
        """
        Retrieve top-k similar chunks.
        """

        if self.index is None:
            raise ValueError(
                "Index not loaded."
            )

        query_array = np.array(
            [query_embedding],
            dtype=np.float32
        )

        distances, indices = (
            self.index.search(
                query_array,
                k
            )
        )

        results = []

        for index in indices[0]:
            if index < len(
                self.documents
            ):
                results.append(
                    self.documents[index]
                )

        logger.info(
            f"Retrieved {len(results)} chunks"
        )

        return results