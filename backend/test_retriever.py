from app.retrieval.retriever import (
    Retriever
)


retriever = Retriever()

results = retriever.retrieve(
    "Summarize the document"
)


print(
    f"Retrieved: {len(results)} chunks"
)

print("\n--- Context ---\n")

context = retriever.format_context(
    results
)

print(context[:500])