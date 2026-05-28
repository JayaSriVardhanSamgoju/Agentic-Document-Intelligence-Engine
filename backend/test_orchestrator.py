from app.agents.orchestrator import (
    AgentOrchestrator
)


orchestrator = (
    AgentOrchestrator()
)

result = orchestrator.run(
    "Summarize the document"
)

print("\nFINAL STATE:\n")
print(result)