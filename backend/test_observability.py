from app.observability.monitor import (
    ObservabilityMonitor
)

trace = [

    {
        "agent":
        "input_guardrails",

        "status":
        "passed",

        "timestamp":
        "2026-05-29 13:28:22.895551"
    },

    {
        "agent":
        "planner",

        "status":
        "completed",

        "timestamp":
        "2026-05-29 13:28:23.434130"
    },

    {
        "agent":
        "retriever",

        "status":
        "completed",

        "timestamp":
        "2026-05-29 13:28:23.488453"
    },

    {
        "agent":
        "synthesizer",

        "status":
        "completed",

        "timestamp":
        "2026-05-29 13:28:24.705383"
    },

    {
        "agent":
        "output_guardrails",

        "status":
        "passed",

        "timestamp":
        "2026-05-29 13:28:24.709314"
    },

    {
        "agent":
        "verifier",

        "status":
        "completed",

        "timestamp":
        "2026-05-29 13:28:25.819025"
    }
]


monitor = (
    ObservabilityMonitor()
)

report = (
    monitor.generate_report(
        trace=trace,
        confidence=0.91
    )
)

print(
    "\nOBSERVABILITY REPORT:\n"
)

print(report)