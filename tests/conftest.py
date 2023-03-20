# content of conftest.py
import pytest
from pathlib import Path
import cv2
from labconfig.types import ObjectState, CalibrationCoordinatesPixels, CalibrationCoordinatesCentimeters, PointInt, PointFloat
from labconfig import CONFIG

THIS_DIR = Path(__file__).parent
FIXTURES_DIR = THIS_DIR / "fixtures"


# @pytest.fixture()
# def region_growing_img_1():
#     img = cv2.imread(str(FIXTURES_DIR / "region_growing_1.png"))
#     img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

#     answers = [
#         dict(seed_pos=(25, 25), mean_color=[92, 245, 255], std_color=[0.0, 0.0, 0.0])
#     ]
#     return img, answers

@pytest.fixture()
def simple_tracking_frame():
    img = cv2.imread(str(FIXTURES_DIR / "simple_tracking_frame.png"))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    data = dict(
        calibration_coordinates_pixels_seed = CalibrationCoordinatesPixels(
            tl=PointInt(x=225,y=66),
            tm=PointInt(x=485,y=66),
            tr=PointInt(x=725,y=74),
            bl=PointInt(x=225,y=215),
            bm=PointInt(x=486,y=216),
            br=PointInt(x=730,y=225),
        ),
        calibration_coordinates_pixels_true = CalibrationCoordinatesPixels(
            tl=PointInt(x=229,y=70),
            tm=PointInt(x=480,y=70),
            tr=PointInt(x=730,y=70),
            bl=PointInt(x=229,y=220),
            bm=PointInt(x=480,y=220),
            br=PointInt(x=730,y=220),
        ),
        calibration_coordinates_local=CONFIG["motion_tracker"]["calibration_stickers"]["coordinates_local"],
        object_coordinates_seed=ObjectState(px=0, py=0),
        object_coordinates_true=ObjectState(px=0, py=0),
        img=img
    )
    return data


@pytest.fixture()
def calibration_board_ver1():
    img = cv2.imread(str(FIXTURES_DIR / "calibration_board_ver1.png"))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    data = dict(
        calibration_coordinates_pixels_seed = CalibrationCoordinatesPixels(
            tl=PointInt(x=217,y=52),
            tm=PointInt(x=390,y=50),
            tr=PointInt(x=567,y=45),
            bl=PointInt(x=220,y=133),
            bm=PointInt(x=392,y=128),
            br=PointInt(x=568,y=122),
        ),
        calibration_coordinates_pixels_true = CalibrationCoordinatesPixels(
            tl=PointInt(x=218,y=57),
            tm=PointInt(x=391,y=50),
            tr=PointInt(x=568,y=45),
            bl=PointInt(x=220,y=135),
            bm=PointInt(x=392,y=130),
            br=PointInt(x=569,y=123),
        ),
        calibration_coordinates_local=CONFIG["motion_tracker"]["calibration_stickers"]["coordinates_local"],
        img=img
    )
    return data


@pytest.fixture()
def calibration_board_ver2():
    img = cv2.imread(str(FIXTURES_DIR / "calibration_board_ver2.png"))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    data = dict(
        calibration_coordinates_pixels_seed = CalibrationCoordinatesPixels(
            tl=PointInt(x=129,y=135),
            tm=PointInt(x=377,y=136),
            tr=PointInt(x=604,y=152),
            bl=PointInt(x=136,y=234),
            bm=PointInt(x=367,y=247),
            br=PointInt(x=600,y=253),
        ),
        calibration_coordinates_pixels_true = CalibrationCoordinatesPixels(
            tl=PointInt(x=133,y=136),
            tm=PointInt(x=371,y=142),
            tr=PointInt(x=599,y=146),
            bl=PointInt(x=135,y=242),
            bm=PointInt(x=370,y=244),
            br=PointInt(x=596,y=247),
        ),
        calibration_coordinates_local=CONFIG["motion_tracker"]["calibration_stickers"]["coordinates_local"],
        img=img
    )
    return data
