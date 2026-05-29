from typing import (
    TypedDict,
    List,
    Optional
)

from langchain_core.documents import (
    Document
)


class AgentState(TypedDict):
    """
    Shared state across agents.
    """

    query: str

    sub_queries: Optional[
        List[str]
    ]

    retrieved_docs: Optional[
        List[Document]
    ]

    context: Optional[str]

    draft_answer: Optional[
        str
    ]

    verification_notes: Optional[
        str
    ]

    final_answer: Optional[
        str
    ]

    confidence_score: Optional[
        float
    ]

    citations: Optional[
        list
    ]

    agent_trace: Optional[
        list
    ]
    
    is_safe: Optional[bool]
    
    blocked_reason: Optional[str]