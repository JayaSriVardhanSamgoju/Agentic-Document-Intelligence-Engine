import re
from typing import Tuple, Optional
from app.utils.logger import get_logger

logger = get_logger()

class SecurityRules:
    """
    Centralized security and safety
    validation rules for inputs and outputs.
    """

    def __init__(self):
        # 1. Prompt Injection Protection
        self.injection_patterns = [
            r"ignore\s+previous\s+instructions",
            r"system\s+prompt",
            r"reveal\s+hidden\s+(prompt|instructions)",
            r"developer\s+message",
            r"act\s+as\s+admin"
        ]

        # 2. Jailbreak Protection
        self.jailbreak_patterns = [
            r"dan\s+mode",
            r"pretend\s+you\s+are\s+unrestricted",
            r"bypass\s+restrictions",
            r"ignore\s+safety\s+rules",
            r"do\s+anything\s+now"
        ]

        # 3. Sensitive Information Protection (Secrets, API keys, etc.)
        self.sensitive_patterns = [
            r"sk-[a-zA-Z0-9]{32,}",                # Generic secret key pattern
            r"(?i)(password|api[_-]?key|secret|token)\s*[:=]\s*[^\s]+"  # Secret assignments
        ]

    def _check_patterns(self, text: str, patterns: list, category: str) -> Tuple[bool, Optional[str]]:
        """
        Check text against a list of regex patterns.
        """
        text_lower = text.lower()
        for pattern in patterns:
            if re.search(pattern, text_lower):
                logger.warning(f"Security Alert: {category} pattern matched.")
                return False, f"Blocked due to {category} policy violation."
        return True, None

    def validate_input(self, query: str) -> Tuple[bool, Optional[str]]:
        """
        Validate incoming user queries.
        Returns: (is_safe, blocked_reason)
        """
        query = query.strip()

        # 4. Empty / Invalid Query Validation
        if not query or len(query) < 2:
            return False, "Query is empty or too short."

        # Check prompt injections
        is_safe, reason = self._check_patterns(query, self.injection_patterns, "Prompt Injection")
        if not is_safe:
            return is_safe, reason

        # Check jailbreaks
        is_safe, reason = self._check_patterns(query, self.jailbreak_patterns, "Jailbreak attempt")
        if not is_safe:
            return is_safe, reason
            
        # Check sensitive info leaking in query
        is_safe, reason = self._check_patterns(query, self.sensitive_patterns, "Sensitive Information")
        if not is_safe:
            return is_safe, reason

        return True, None

    def validate_output(self, generated_text: str) -> Tuple[bool, Optional[str]]:
        """
        Validate generated output before returning to user.
        Returns: (is_safe, blocked_reason)
        """
        if not generated_text:
            return False, "Generated output is empty."

        # Check for system prompt leaks in output
        is_safe, reason = self._check_patterns(generated_text, self.injection_patterns, "System Prompt Leakage")
        if not is_safe:
            return is_safe, reason

        # Check sensitive info leaking in output
        is_safe, reason = self._check_patterns(generated_text, self.sensitive_patterns, "Sensitive Information Leakage")
        if not is_safe:
            return is_safe, reason

        return True, None
