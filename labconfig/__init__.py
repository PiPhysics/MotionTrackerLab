import os
from pathlib import Path
import yaml
from typing import TypedDict, List, Dict, Tuple, Union, Optional
import logging
from .types import Config, CalibrationCoordinatesCentimeters


DEFAULT_FILE = (Path(__file__).parent / "config.yaml").absolute()
TOP_LEVEL_DIR = (Path(__file__).parent.parent).absolute()


def load_config(fpath=DEFAULT_FILE) -> Config:
    if os.environ.get('LAB_CONFIG_FILE'):
        fpath_final = os.environ.get('LAB_CONFIG_FILE')
        print(f"Configuration - Using test configuration file at: {fpath_final} ")
    else:
        fpath_final = fpath

    with open(fpath_final, 'r') as fh:
        data:Config = yaml.load(fh, Loader=yaml.FullLoader)

    data["top_level_directory"] = TOP_LEVEL_DIR
    data["all"]["log_level"] = logging.DEBUG if data["all"]["log_debug"] else logging.INFO

    data["motion_tracker"]["calibration_stickers"]["coordinates_local"] = CalibrationCoordinatesCentimeters(**data["motion_tracker"]["calibration_stickers"]["coordinates_local"])
    return data

CONFIG:Config = load_config()
