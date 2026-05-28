from loguru import logger
from pathlib import Path
import sys


# Get backend root directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# Create logs directory
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)


# Log file path
LOG_FILE = LOG_DIR / "system.log"


# Remove default logger
logger.remove()


# Console logger
logger.add(
    sys.stdout,
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:"
        "<cyan>{line}</cyan> - <level>{message}</level>"
    ),
    level="INFO"
)


# File logger
logger.add(
    LOG_FILE,
    rotation="10 MB",
    retention="10 days",
    compression="zip",
    level="DEBUG",
    enqueue=True
)


def get_logger():
    """
    Return configured logger instance.
    """
    return logger