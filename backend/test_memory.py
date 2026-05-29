from app.memory.session_manager import (
    memory_store
)


memory_store.add_message(
    session_id=
    "user_001",

    role=
    "user",

    content=
    "Summarize document"
)

memory_store.add_message(
    session_id=
    "user_001",

    role=
    "assistant",

    content=
    "Document summary..."
)

history = (
    memory_store
    .get_history(
        "user_001"
    )
)

print(history)