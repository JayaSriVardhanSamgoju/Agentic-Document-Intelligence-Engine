from typing import (
    TypedDict,
    List,
    Optional
)
from langchain_core.documents import (Document)

class AgentState(TypedDict):
    """
    Shared state across agents 
    """

    query:str
    sub_queries: Optional[
        List[str]
    ]
    retrieved_docs: Optional[
        List[Document]
    ]

    # Combined retrieval context
    context: Optional[str]

    # Verifier feedback
    verification_notes: Optional[
        str
    ]
     # Final answer
    final_answer: Optional[
        str
    ]

    # Confidence score
    confidence_score: Optional[
        float
    ]

    citations: Optional[list]
    
    
    
