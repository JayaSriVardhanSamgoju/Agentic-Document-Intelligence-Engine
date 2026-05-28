from app.services.query_service import (
    QueryService
)


query_service = QueryService()


response = query_service.ask(
    "Summarize the document"
)

print("\nResponse:\n")
print(response)