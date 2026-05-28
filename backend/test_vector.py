from app.services.document_processor import (
    DocumentProcessor
)

from app.retrieval.embeddings import (
    EmbeddingModel
)

from app.retrieval.vector_store import (
    VectorStore
)


processor = DocumentProcessor()

documents = processor.process_document(
    "Ebook-Agentic-AI.pdf"
)


embedder = EmbeddingModel()

embeddings = embedder.embed_documents(
    [
        doc.page_content
        for doc in documents
    ]
)


vector_store = VectorStore()

vector_store.create_index(
    embeddings=embeddings,
    documents=documents
)

vector_store.save_index()


query_embedding = (
    embedder.embed_query(
        "Summarize the document"
    )
)

results = (
    vector_store.similarity_search(
        query_embedding=query_embedding,
        k=3
    )
)

print(results[0].page_content[:300])