from datetime import (
    datetime
)


def add_trace(
    state: dict,
    agent_name: str,
    status: str = "completed"
):
    """
    Add agent execution trace.
    """

    trace = state.get(
        "agent_trace",
        []
    )

    trace.append(
        {
            "agent":
            agent_name,

            "status":
            status,

            "timestamp":
            str(
                datetime.now()
            )
        }
    )

    return trace