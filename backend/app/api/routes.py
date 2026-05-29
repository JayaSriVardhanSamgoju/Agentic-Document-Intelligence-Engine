from pathlib import Path
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)

from app.core.schemas import (
    QueryRequest,
    QueryResponse,
    UploadResponse,
    HealthResponse
)

from app.services.document_processor import (
    DocumentProcessor
)

from app.retrieval.embeddings import (
    EmbeddingModel
)

from app.retrieval.vector_store import (
    VectorStore
)

from app.services.query_service import (
    QueryService
)
from app.auth.dependencies import (
    require_permission
)

from app.utils.logger import get_logger


router = APIRouter()

logger = get_logger()


UPLOAD_DIR = Path(
    "data/raw_documents"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


document_processor = (
    DocumentProcessor()
)

embedder = EmbeddingModel()

vector_store = VectorStore()

query_service = QueryService()


@router.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"]
)
async def health_check():

    return HealthResponse(
        status="healthy",
        app_name="Agentic Document Intelligence Engine"
    )


@router.post(
    "/upload",
    dependencies=[
        Depends(
            require_permission(
                "upload"
            )
        )
    ]
)

async def upload_document(
    file: UploadFile = File(...)
):
    """
    Upload and process document.
    """

    try:
        file_path = (
            UPLOAD_DIR / file.filename
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
            f"Uploaded file: {file.filename}"
        )

        documents = (
            document_processor
            .process_document(
                str(file_path)
            )
        )

        embeddings = (
            embedder.embed_documents(
                [
                    doc.page_content
                    for doc in documents
                ]
            )
        )

        vector_store.create_index(
            embeddings=embeddings,
            documents=documents
        )

        vector_store.save_index()

        return UploadResponse(
            filename=file.filename,
            status="uploaded",
            chunks_created=len(
                documents
            )
        )

    except Exception as error:

        logger.error(
            f"Upload failed: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post(
    "/query",
    dependencies=[
        Depends(
            require_permission(
                "query"
            )
        )
    ]
)
async def query_documents(
    request: QueryRequest
):
    """
    Ask question to uploaded docs.
    """

    try:
        response = (
            query_service.ask(
                request.query
            )
        )

        return QueryResponse(
            answer=response.get("answer", "No answer generated."),
            confidence_score=response.get("confidence_score", 0.0),
            citations=response.get("citations", []),
            reasoning=response.get("reasoning", "No reasoning provided."),
            agent_trace=response.get("agent_trace", []),
            evaluation=response.get("evaluation", {})
        )

    except Exception as error:

        logger.error(
            f"Query failed: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )