from app.services.document_processor import (
    DocumentProcessor
)


processor = DocumentProcessor()

documents = processor.process_document(
    "Ebook-Agentic-AI.pdf"
)

print(f"Chunks created: {len(documents)}")

print(documents[0].page_content[:300])