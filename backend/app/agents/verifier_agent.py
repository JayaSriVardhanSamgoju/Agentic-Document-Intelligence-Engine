from huggingface_hub.inference._generated.types import zero_shot_image_classification
from langchain_groq import (
    ChatGroq
)

from langchain_core.prompts import (
    ChatPromptTemplate
)

from app.core.config import (
    settings
)

from app.graph.state import (
    AgentState
)

from app.utils.logger import (
    get_logger
)


logger = get_logger()


class VerifierAgent:
    """
    Verifies whether
    generated answer
    is grounded in context.
    """

    def __init__(self):

        self.llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME
        )

        self.prompt = (
    ChatPromptTemplate.from_template(
        """
You are a hallucination
verification agent.

Your task is to verify
whether the answer is
grounded in the retrieved
context.

Evaluation Rules:

1. Fully grounded:
- All claims supported
- Confidence: 0.8–1.0

2. Partially grounded:
- Some claims supported
- Some unsupported
- Confidence: 0.4–0.79

3. Not grounded:
- Major unsupported claims
- Confidence: 0.0–0.39

Do NOT hallucinate.

Context:
{context}

Answer:
{answer}

Return EXACTLY:

VERDICT: grounded /
partially_grounded /
not_grounded

CONFIDENCE: 0.xx

NOTES:
brief explanation
"""
    )
)

    def run(
        self,
        state: AgentState
    ) -> AgentState:
        """
        Verify answer grounding.
        """

        context = state.get(
            "context",
            ""
        )

        answer = state.get(
            "draft_answer",
            ""
        )

        logger.info(
            "Running verification"
        )

        chain = (
            self.prompt
            | self.llm
        )

        response = chain.invoke(
            {
                "context": context,
                "answer": answer
            }
        )

        verification = (
            response.content
        )

        logger.info(
            "Verification completed"
        )

        confidence_score = 0.5

        try:

            for line in (
                verification.split(
                    "\n"
                )
            ):

                if (
                    "CONFIDENCE:"
                    in line
                ):

                    confidence_score = (
                        float(
                            line
                            .split(":")[1]
                            .strip()
                        )
                    )

        except Exception:

            logger.warning(
                "Confidence parsing failed"
            )

        return {
    **state,
    "verification_notes":
    verification,

    "confidence_score":
    confidence_score
}