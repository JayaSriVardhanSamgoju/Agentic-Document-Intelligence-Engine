from pathlib import Path
import shutil
import asyncio

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)

from fastapi.responses import (
    StreamingResponse
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

from app.utils.logger import (
    get_logger
)


router = APIRouter()

logger = get_logger()


# -----------------------------
# Upload Directory
# -----------------------------

UPLOAD_DIR = Path(
    "data/raw_documents"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# -----------------------------
# Services Initialization
# -----------------------------

document_processor = (
    DocumentProcessor()
)

embedder = (
    EmbeddingModel()
)

vector_store = (
    VectorStore()
)

query_service = (
    QueryService()
)


# -----------------------------
# Health Check
# -----------------------------

@router.get(
    "/health",
    response_model=
    HealthResponse,

    tags=["Health"]
)
async def health_check():

    return HealthResponse(
        status="healthy",
        app_name=
        "Agentic Document Intelligence Engine"
    )


# -----------------------------
# Upload Document
# -----------------------------

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
            UPLOAD_DIR
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
            f"Uploaded file: "
            f"{file.filename}"
        )

        # -------------------------
        # Process Document
        # -------------------------

        documents = (
            document_processor
            .process_document(
                str(file_path)
            )
        )

        # -------------------------
        # Generate Embeddings
        # -------------------------

        embeddings = (
            embedder
            .embed_documents(
                [
                    doc.page_content
                    for doc in
                    documents
                ]
            )
        )

        # -------------------------
        # Store in Vector DB
        # -------------------------

        vector_store.create_index(
            embeddings=
            embeddings,

            documents=
            documents
        )

        vector_store.save_index()

        return UploadResponse(
            filename=
            file.filename,

            status=
            "uploaded",

            chunks_created=
            len(documents)
        )

    except Exception as error:

        logger.error(
            f"Upload failed: "
            f"{error}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# -----------------------------
# Query Endpoint
# -----------------------------

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
                query=
                request.query,

                session_id=
                request.session_id
            )
        )

        return QueryResponse(

            answer=response.get(
                "answer",
                "No answer generated."
            ),

            confidence_score=response.get(
                "confidence_score",
                0.0
            ),

            citations=response.get(
                "citations",
                []
            ),

            reasoning=response.get(
                "reasoning",
                "No reasoning provided."
            ),

            agent_trace=response.get(
                "agent_trace",
                []
            ),

            evaluation=response.get(
                "evaluation",
                {}
            ),

            observability=response.get(
                "observability",
                {}
            )
        )

    except Exception as error:

        logger.error(
            f"Query failed: "
            f"{error}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# -----------------------------
# Streaming Query Endpoint
# -----------------------------

@router.post(
    "/query/stream",
    dependencies=[
        Depends(
            require_permission(
                "query"
            )
        )
    ]
)
async def query_stream(
    request: QueryRequest
):
    """
    Stream query response.
    """

    async def generator():

        try:

            logger.info(
                f"Streaming query: "
                f"{request.query}"
            )

            response = (
                query_service.ask(
                    query=
                    request.query,

                    session_id=
                    request.session_id
                )
            )

            answer = (
                response.get(
                    "answer",
                    "No answer generated."
                )
            )

            # Stream word by word
            for word in answer.split():

                yield (
                    word + " "
                )

                await asyncio.sleep(
                    0.03
                )

        except Exception as error:

            logger.error(
                f"Streaming failed: "
                f"{error}"
            )

            yield (
                "Error generating response."
            )

    return StreamingResponse(
        generator(),
        media_type=
        "text/plain"
    )