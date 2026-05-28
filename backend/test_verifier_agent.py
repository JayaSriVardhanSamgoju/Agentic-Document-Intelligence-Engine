from app.agents.verifier_agent import (
    VerifierAgent
)


agent = VerifierAgent()


state = {
    "context":
    "AI helps automation.",

    "draft_answer":
    "AI helps automation and reduces cost by 90%"
}


updated_state = (
    agent.run(state)
)

print(
    updated_state[
        "verification_notes"
    ]
)

print(
    updated_state[
        "confidence_score"
    ]
)