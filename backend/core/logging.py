import logging
import re

SENSITIVE_PATTERNS = [
    (re.compile(r'(password["\']?\s*[:=]\s*["\'])([^"\']+)("|\')', re.IGNORECASE), r'\1[REDACTED]\3'),
    (re.compile(r'(token["\']?\s*[:=]\s*["\'])([^"\']+)("|\')', re.IGNORECASE), r'\1[REDACTED]\3'),
    (re.compile(r'(secret["\']?\s*[:=]\s*["\'])([^"\']+)("|\')', re.IGNORECASE), r'\1[REDACTED]\3'),
    (re.compile(r'(authorization:\s*bearer\s+)([a-zA-Z0-9\._\-]+)', re.IGNORECASE), r'\1[REDACTED]'),
    (re.compile(r'(api[_\-]?key["\']?\s*[:=]\s*["\'])([^"\']+)("|\')', re.IGNORECASE), r'\1[REDACTED]\3'),
]


class RedactingFilter(logging.Filter):
    """Filter that strips out sensitive keys and values from log messages."""

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            msg = record.msg
            for pattern, repl in SENSITIVE_PATTERNS:
                msg = pattern.sub(repl, msg)
            record.msg = msg
        return True
