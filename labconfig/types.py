from enum import Enum
from typing import TypedDict, List, Dict, Tuple, Union, Optional
from pathlib import Path
from pydantic import BaseModel
import numpy as np


########################################################
###           Start Backend Server Typing            ###


class PointFloat(BaseModel):
    x: float = 0
    y: float = 0

    def to_array(self):
        return [self.y, self.x]


class PointInt(BaseModel):
    x: int = 0
    y: int = 0

    def to_array(self):
        return [self.y, self.x]

    def transform(self, dlt: np.ndarray) -> PointFloat:
        """Calculate x and y coordinates (in cm) based on the coefficients (c_1 - c_8) from
            the fractional transformation and the pixel coordinates of each point
            x = (c_1*u + c_2*v + c_3)/(1 + c_7*u + c_8*v)
            y = (c_4*u + c_5*v + c_6)/(1 + c_7*u + c_8*v)

        Args:
            dlt (list): Parameters of DLT

        Returns:
            PointFloat: The [x,y] coordinate in local space.
        """
        x_transformed = (dlt[0] * self.x + dlt[1] * self.y + dlt[2]) / (
            1.0 + dlt[6] * self.x + dlt[7] * self.y
        )

        y_transformed = (dlt[3] * self.x + dlt[4] * self.y + dlt[5]) / (
            1.0 + dlt[6] * self.x + dlt[7] * self.y
        )

        return PointFloat(x=x_transformed, y=y_transformed)
    
    class Config:
        schema_extra = {
            "example": {
                "x": 331,
                "y": 273
            }
        }


class ROI(BaseModel):
    width: int
    height: int
    row_start: int = 0
    column_start: int = 0

    def __getitem__(self, key) -> PointInt:
        return getattr(self, key)


class SimpleServerCommand(str, Enum):
    start_calibration = "start_calibration"  # no arguments
    # receive_calibration_points = "receive_calibration_points"  # 6 calibration points
    reset_calibration = "reset_calibration"  # no arguments
    # receive_object_points = "receive_object_points"  # 1 object points
    reset_tracking = "reset_tracking"  # no arguments
    # open_experiment = "open_experiment"  # name of experiment, str
    close_experiment = "close_experiment"  # no arguments
    start_recording = "start_recording"  # no arguments
    stop_recording = "stop_recording"  # no arguments
    soft_reset = "soft_reset"  # no arguments


class CalibrationCoordinatesPixels(BaseModel):
    tl: PointInt = PointInt(x=0, y=0)
    tm: PointInt = PointInt(x=0, y=0)
    tr: PointInt = PointInt(x=0, y=0)
    bl: PointInt = PointInt(x=0, y=0)
    bm: PointInt = PointInt(x=0, y=0)
    br: PointInt = PointInt(x=0, y=0)

    @classmethod
    def toCCP(contour_positions: np.ndarray):
        return CalibrationCoordinatesPixels(
            tl=PointInt(x=contour_positions[0, 1], y=contour_positions[0, 0]),
            tm=PointInt(x=contour_positions[1, 1], y=contour_positions[1, 0]),
            tr=PointInt(x=contour_positions[2, 1], y=contour_positions[2, 0]),
            bl=PointInt(x=contour_positions[3, 1], y=contour_positions[3, 0]),
            bm=PointInt(x=contour_positions[4, 1], y=contour_positions[4, 0]),
            br=PointInt(x=contour_positions[5, 1], y=contour_positions[5, 0]),
        )

    def to_array(self):
        return np.array(
            [
                self.tl.to_array(),
                self.tm.to_array(),
                self.tr.to_array(),
                self.bl.to_array(),
                self.bm.to_array(),
                self.br.to_array(),
            ]
        )

    def __getitem__(self, key) -> PointInt:
        if key in self.__dict__:
            return getattr(self, key)
        else:
            if key == 0:
                return self.tl
            elif key == 1:
                return self.tm
            elif key == 2:
                return self.tr
            elif key == 3:
                return self.bl
            elif key == 4:
                return self.bm
            elif key == 5:
                return self.br

    def __setitem__(self, key, newvalue):
        if key in self.__dict__:
            setattr(self, key, newvalue)
        else:
            if key == 0:
                self.tl = newvalue
            elif key == 1:
                self.tm = newvalue
            elif key == 2:
                self.tr = newvalue
            elif key == 3:
                self.bl = newvalue
            elif key == 4:
                self.bm = newvalue
            elif key == 5:
                self.br = newvalue
    #  {"tl": {"x": 235, "y": 69}, "tm": {"x": 482, "y": 68}, "tr": {"x": 734, "y": 69}, "bl": {"x": 232, "y": 221}, "bm": {"x": 478, "y": 216}, "br": {"x": 732, "y": 219}}
    class Config:
        schema_extra = {
            "example": {
                "tl": PointInt(x=235, y=69),
                "tm": PointInt(x=482, y=68),
                "tr": PointInt(x=734, y=69),
                "bl": PointInt(x=232, y=221),
                "bm": PointInt(x=478, y=216),
                "br": PointInt(x=732, y=219),
            }
        }


class CalibrationCoordinatesCentimeters(BaseModel):
    tl: PointFloat = PointFloat(x=0.0, y=0.0)
    tm: PointFloat = PointFloat(x=0.0, y=0.0)
    tr: PointFloat = PointFloat(x=0.0, y=0.0)
    bl: PointFloat = PointFloat(x=0.0, y=0.0)
    bm: PointFloat = PointFloat(x=0.0, y=0.0)
    br: PointFloat = PointFloat(x=0.0, y=0.0)

    @classmethod
    def toCCP(contour_positions: np.ndarray):
        return CalibrationCoordinatesCentimeters(
            tl=PointFloat(x=contour_positions[0, 1], y=contour_positions[0, 0]),
            tm=PointFloat(x=contour_positions[1, 1], y=contour_positions[1, 0]),
            tr=PointFloat(x=contour_positions[2, 1], y=contour_positions[2, 0]),
            bl=PointFloat(x=contour_positions[3, 1], y=contour_positions[3, 0]),
            bm=PointFloat(x=contour_positions[4, 1], y=contour_positions[4, 0]),
            br=PointFloat(x=contour_positions[5, 1], y=contour_positions[5, 0]),
        )

    def to_array(self):
        return np.array(
            [
                self.tl.to_array(),
                self.tm.to_array(),
                self.tr.to_array(),
                self.bl.to_array(),
                self.bm.to_array(),
                self.br.to_array(),
            ]
        )

    def __getitem__(self, key) -> PointFloat:
        return getattr(self, key)

    class Config:
        schema_extra = {
            "example": {
                "tl": PointFloat(x=0.0, y=0.0),
                "tm": PointFloat(x=0.0, y=0.0),
                "tr": PointFloat(x=0.0, y=0.0),
                "bl": PointFloat(x=0.0, y=0.0),
                "bm": PointFloat(x=0.0, y=0.0),
                "br": PointFloat(x=0.0, y=0.0),
            }
        }


class ObjectState(BaseModel):
    pixel_position: PointInt = PointInt(x=0, y=0)
    local_position: Optional[PointFloat] = None
    timestamp: Optional[int]

    class Config:
        schema_extra = {
            "example": {
                "coordinate_pixel": PointInt(x=0, y=0),
                "coordinate_centimeter": None,
                "timestamp": None,
            }
        }


###      End Backend Server Typing                    ###
########################################################


########################################################
###         Start Configuration File Typing          ###
class CameraVideoConfig(TypedDict):
    states: Optional[Dict[str, Tuple[int, int]]]
    video_fpath: str


class CameraConfig(TypedDict):
    width: int
    height: int
    fps: int
    device_index: int


class LabWebConfig(TypedDict):
    production: bool
    log_directory: str
    static_files_directory: str


# class CalibrationCoordinatesPixels(TypedDict):
#     tl: List[int]
#     tm: List[int]
#     tr: List[int]
#     bl: List[int]
#     bm: List[int]
#     br: List[int]


# class ObjectCoordinates(TypedDict):
#     center: List[int]


class CalibrationConfig(TypedDict):
    min_area: int
    coordinates_local: CalibrationCoordinatesCentimeters


class ROIConfig(TypedDict):
    width: int
    height: int


# class ObjectState(TypedDict):
#     pixel_position: PointInt
#     local_position: PointFloat

#     timestamp: float


class TrackingConfig(TypedDict):
    frame_timeout: int
    roi: ROIConfig


class RecordingConfig(TypedDict):
    default_experiment_name: str
    save_directory: str


class MotionTrackerConfig(TypedDict):
    camera: Union[CameraConfig, CameraVideoConfig]
    inactive_timer: int
    calibration_stickers: CalibrationConfig
    tracking: TrackingConfig
    recording: RecordingConfig


class AllConfig(TypedDict):
    log_debug: bool  # whether to log debug statements
    log_level: Optional[int]  # log level, calculated automatically based upon log_debug


class Config(TypedDict):
    all: AllConfig
    labweb: LabWebConfig
    motion_tracker: MotionTrackerConfig
    top_level_directory: Path


###         End Configuration File Typing            ###
########################################################


def flatten(dictionary, parent_key=False, separator="."):
    """
    Turn a nested dictionary into a flattened dictionary
    :param dictionary: The dictionary to flatten
    :param parent_key: The string to prepend to dictionary's keys
    :param separator: The string used to separate flattened keys
    :return: A flattened dictionary
    """
    import sys

    if sys.version_info[:2] >= (3, 8):
        from collections.abc import MutableMapping
    else:
        from collections import MutableMapping
    crumbs = False

    items = []
    for key, value in dictionary.items():
        if crumbs:
            print("checking:", key)
        new_key = str(parent_key) + separator + key if parent_key else key
        if isinstance(value, MutableMapping):
            if crumbs:
                print(new_key, ": dict found")
            if not value.items():
                if crumbs:
                    print("Adding key-value pair:", new_key, None)
                items.append((new_key, None))
            else:
                items.extend(flatten(value, new_key, separator).items())
        elif isinstance(value, list):
            if crumbs:
                print(new_key, ": list found")
            if len(value):
                for k, v in enumerate(value):
                    items.extend(flatten({str(k): v}, new_key, separator).items())
            else:
                if crumbs:
                    print("Adding key-value pair:", new_key, None)
                items.append((new_key, None))
        else:
            if crumbs:
                print("Adding key-value pair:", new_key, value)
            items.append((new_key, value))
    return dict(items)
