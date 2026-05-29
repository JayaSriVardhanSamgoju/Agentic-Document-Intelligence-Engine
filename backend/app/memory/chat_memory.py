from typing import (
    Dict,
    List
)


class ChatMemory:
    """
    Stores conversation history.
    """

    def __init__(self):

        self.memory: Dict[
            str,
            List[dict]
        ] = {}

    def add_message(
        self,
        session_id: str,
        role: str,
        content: str
    ):
        """
        Add message
        to session.
        """

        if (
            session_id
            not in self.memory
        ):

            self.memory[
                session_id
            ] = []

        self.memory[
            session_id
        ].append(
            {
                "role":
                role,

                "content":
                content
            }
        )

    def get_history(
        self,
        session_id: str
    ) -> List[dict]:
        """
        Get session history.
        """

        return self.memory.get(
            session_id,
            []
        )

    def clear_memory(
        self,
        session_id: str
    ):
        """
        Clear session.
        """

        self.memory.pop(
            session_id,
            None
        )