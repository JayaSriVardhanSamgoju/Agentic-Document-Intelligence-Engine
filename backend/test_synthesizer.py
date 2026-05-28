from app.agents.synthesizer_agent import (
    SynthesizerAgent
)


agent = (
    SynthesizerAgent()
)


state = {
    "query":
    "How does AI help businesses?",

    "context":
    """
    AI improves automation.
    AI increases efficiency.
    """
}


updated_state = (
    agent.run(state)
)

print(
    updated_state[
        "draft_answer"
    ]
)