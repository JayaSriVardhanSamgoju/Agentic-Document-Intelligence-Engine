from app.agents.planner_agent import (
    PlannerAgent
)

from app.agents.retriever_agent import (
    RetrieverAgent
)


planner = PlannerAgent()

retriever = (
    RetrieverAgent()
)


state = {
    "query":
    "Compare benefits and risks of AI"
}


state = planner.run(
    state
)

state = retriever.run(
    state
)


print(
    state["context"][:1000]
)