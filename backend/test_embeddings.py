from app.retrieval.embeddings import (
    EmbeddingModel
)


embedder = EmbeddingModel()


texts = [
    "Machine learning is useful.",
    "Artificial intelligence is growing."
]


vectors = embedder.embed_documents(texts)

print(len(vectors))
print(len(vectors[0]))