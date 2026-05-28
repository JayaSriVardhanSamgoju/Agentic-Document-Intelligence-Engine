from app.agents.planner_agent import (
    PlannerAgent
)


planner = PlannerAgent()


state = {
    "query":
    "Compare benefits and risks of AI"
}


updated_state = (
    planner.run(state)
)

print(
    updated_state[
        "sub_queries"
    ]
)