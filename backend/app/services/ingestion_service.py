from pathlib import Path
import shutil

from fastapi import UploadFile

from app.services.document_processor import (
    DocumentProcessor
)

from app.retrieval.embeddings import (
    EmbeddingModel
)

from app.retrieval.vector_store import (
    VectorStore
)

from app.core.schemas import (
    UploadResponse
)

from app.utils.logger import get_logger


logger = get_logger()


class IngestionService:
    """
    Handles document ingestion pipeline.
    """

    def __init__(self):

        self.upload_dir = Path(
            "data/raw_documents"
        )

        self.upload_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        self.document_processor = (
            DocumentProcessor()
        )

        self.embedder = (
            EmbeddingModel()
        )

        self.vector_store = (
            VectorStore()
        )

    def ingest_document(
        self,
        file: UploadFile
    ) -> UploadResponse:
        """
        Full ingestion pipeline.
        """

        logger.info(
            f"Starting ingestion: "
            f"{file.filename}"
        )

        # Save file
        file_path = (
            self.upload_dir
            / file.filename
        )

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        logger.info(
            f"Saved file: "
            f"{file.filename}"
        )

        # Process document
        documents = (
            self.document_processor
            .process_document(
                str(file_path)
            )
        )

        logger.info(
            f"Created "
            f"{len(documents)} chunks"
        )

        # Generate embeddings
        embeddings = (
            self.embedder
            .embed_documents(
                [
                    doc.page_content
                    for doc in documents
                ]
            )
        )

        logger.info(
            "Embeddings generated"
        )

        # Create vector index
        self.vector_store.create_index(
            embeddings=embeddings,
            documents=documents
        )

        self.vector_store.save_index()

        logger.info(
            "Vector store updated"
        )

        return UploadResponse(
            filename=file.filename,
            status="uploaded",
            chunks_created=len(
                documents
            )
        )