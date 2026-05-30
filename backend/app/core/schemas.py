from ast import Dict
from pydantic import BaseModel,Field
from typing import (
    List,
    Dict,
    Any,
    Optional
)
class QueryRequest(BaseModel):

    query: str

    session_id:str = "default"

class Citation(BaseModel):
    """
    Source citation schema
    """

    source: str
    chunk_id: Optional[int] = None


class AgentTrace(BaseModel):
    """
    Agent execution trace schema
    """
    
    agent: str
    status: str
    timestamp: str


class QueryResponse(BaseModel):
    """
    Final validated response schema
    """

    answer: str

    confidence_score: float = Field(
        ...,
        ge=0,
        le=1,
        description="Confidence score between 0 and 1"
    )
    
    source_type: str = "unknown"

    citations: List[Citation]
    reasoning: str
    agent_trace: List[AgentTrace]
    evaluation: Dict[str, Any] = {}
    observability: Dict[str, Any] = {}

class UploadResponse(BaseModel):
    """
    Response schema after document upload
    """

    filename: str
    status: str
    chunks_created: int

class HealthResponse(BaseModel):
    """
    Health check response schema
    """

    status:str
    app_name:str
    
    