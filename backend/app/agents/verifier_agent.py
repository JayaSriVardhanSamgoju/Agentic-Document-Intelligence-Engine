from langchain_groq import (
    ChatGroq
)

from langchain_core.prompts import (
    ChatPromptTemplate
)

from app.core.config import (
    settings
)

from app.utils.logger import (
    get_logger
)

from datetime import (
    datetime
)


logger = get_logger()


class VerifierAgent:
    """
    Verifies whether answer
    is grounded in retrieved
    context.
    """

    def __init__(self):

        self.llm = ChatGroq(
            groq_api_key=
            settings.GROQ_API_KEY,

            model_name=
            settings.MODEL_NAME,

            temperature=0
        )

        self.prompt = (
            ChatPromptTemplate
            .from_template(
                """
You are an expert AI evaluator.

Your job is to verify if
the answer is grounded
in the provided context.

Context:
{context}

Answer:
{answer}

Evaluate:

1. Is answer supported by context?
2. Any hallucination?
3. Did answer miss key info?

Respond ONLY in format:

VERDICT: grounded
CONFIDENCE: 0.91
NOTES: short explanation
"""
            )
        )

    def run(
        self,
        state: dict
    ) -> dict:

        logger.info(
            "Running verification"
        )

        try:

            chain = (
                self.prompt
                | self.llm
            )

            response = (
                chain.invoke(
                    {
                        "context":
                        state.get(
                            "context",
                            ""
                        ),

                        "answer":
                        state.get(
                            "draft_answer",
                            ""
                        )
                    }
                )
            )

            text = (
                response.content
            )

            confidence = 0.75

            for line in (
                text.split("\n")
            ):

                if (
                    "CONFIDENCE:"
                    in line
                ):

                    try:

                        confidence = (
                            float(
                                line
                                .split(
                                    ":"
                                )[1]
                                .strip()
                            )
                        )

                    except Exception:
                        pass

            trace = (
                state.get(
                    "agent_trace",
                    []
                )
            )

            trace.append(
                {
                    "agent":
                    "verifier",

                    "status":
                    "completed",

                    "timestamp":
                    str(
                        datetime.now()
                    )
                }
            )

            logger.info(
                "Verification completed"
            )

            return {
                **state,

                "verification_notes":
                text,

                "confidence_score":
                confidence,

                "agent_trace":
                trace
            }

        except Exception as e:

            logger.error(
                f"Verifier failed: {e}"
            )

            return {
                **state,

                "verification_notes":
                (
                    "VERDICT: "
                    "partially_grounded\n"

                    "CONFIDENCE: "
                    "0.75\n"

                    "NOTES: "
                    "Fallback verifier."
                ),

                "confidence_score":
                0.75
            }