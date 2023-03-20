
import logging
import sys
from dataclasses import dataclass
from functools import lru_cache

from labconfig import CONFIG

LOGGER_FILE =  CONFIG["top_level_directory"] / CONFIG["labweb"]["log_directory"] / "lab.log"
DATE_FORMAT = "%d-%b-%y %H:%M:%S"
LOGGER_FORMAT = "%(levelname)s: %(asctime)s \t%(message)s"
LOGGER_HANDLER = None

@dataclass
class LoggerConfig:
    handlers: list
    format: str
    date_format: str
    logger_file: str
    level: str = CONFIG["all"]["log_level"]


@lru_cache
def get_logger_config():
    if not CONFIG["labweb"]["production"]:
        from rich.logging import RichHandler

        return LoggerConfig(
            handlers=[RichHandler(rich_tracebacks=True)],
            format=None,
            date_format=None,
            logger_file=None,
            level=CONFIG["all"]["log_level"]
        )

    output_file_handler = logging.handlers.TimedRotatingFileHandler(LOGGER_FILE, when="midnight", backupCount=0)
    handler_format = logging.Formatter(LOGGER_FORMAT, datefmt=DATE_FORMAT)
    output_file_handler.setFormatter(handler_format)

    # Stdout
    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setFormatter(handler_format)

    return LoggerConfig(
        handlers=[output_file_handler, stdout_handler],
        format="%(levelname)s: %(asctime)s \t%(message)s",
        date_format="%d-%b-%y %H:%M:%S",
        logger_file=LOGGER_FILE,
        level=CONFIG["all"]["log_level"]
    )


logger_config = get_logger_config()

logging.basicConfig(
    level=logger_config.level,
    format=logger_config.format,
    datefmt=logger_config.date_format,
    handlers=logger_config.handlers,
)

def get_logger(name):
    return logging.getLogger(name)