import pytest
from motiontracker.calibration import (gather_neighborhood_stats, 
                                        get_neighbors, 
                                        region_growing,
                                        extract_calibration_markers,
                                        find_transition_matrix,
                                        coord_transform)
import numpy as np

from labconfig import CONFIG
from labconfig.types import CalibrationCoordinatesPixels, CalibrationCoordinatesCentimeters, PointFloat, PointInt

np.set_printoptions(precision=3, suppress=True)

def test_get_neighbors():
    # top left
    neighbors = get_neighbors((0, 0), (480, 640))
    assert set(neighbors) == set([(0, 1), (1, 0)])

    # top right
    neighbors = get_neighbors((0, 639), (480, 640))
    assert set(neighbors) == set([(0, 638), (1, 639)])

    # bottom right
    neighbors = get_neighbors((479, 639), (480, 640))
    assert set(neighbors) == set([(478, 639), (479, 638)])

    # bottom left
    neighbors = get_neighbors((479, 0), (480, 640))
    assert set(neighbors) == set([(478, 0), (479, 1)])

    # random
    neighbors = get_neighbors((2, 2), (480, 640))
    assert set(neighbors) == set([(1, 2), (2, 3), (3, 2), (2, 1)])

def test_dlt(calibration_board_ver2):
    img = calibration_board_ver2["img"]
    calibration_coords_cm:CalibrationCoordinatesCentimeters = calibration_board_ver2['calibration_coordinates_local']
    calibration_coords_px:CalibrationCoordinatesPixels = calibration_board_ver2['calibration_coordinates_pixels_true']

    dlt = find_transition_matrix(calibration_coords_px, calibration_coords_cm)
    for key in calibration_coords_px.dict().keys():
        ccp = calibration_coords_px[key]
        ccc = calibration_coords_cm[key]
        ccc_estimate = ccp.transform(dlt)
        np.testing.assert_allclose(ccc.to_array(), ccc_estimate.to_array(), atol=1) # should be within 1 cm


# parametrize with fixture
@pytest.mark.parametrize(
    "fixture_name",
    [
        # 1. pass fixture name as a string
        "simple_tracking_frame",
        "calibration_board_ver1",
        "calibration_board_ver2"
    ],
)
def test_calibration_marker_extraction(fixture_name, request):
    test_data = request.getfixturevalue(fixture_name)
    img = test_data["img"]
    ccp_seed:CalibrationCoordinatesPixels = test_data["calibration_coordinates_pixels_seed"]
    ccp_true:CalibrationCoordinatesPixels = test_data["calibration_coordinates_pixels_true"]

    seed_positions = ccp_seed.to_array()
    marker_centers = ccp_true.to_array()
    marker_centers_estimated = extract_calibration_markers(img, seed_positions, min_area=CONFIG['motion_tracker']['calibration_stickers']['min_area'])
    # print(seed_positions)
    # print(marker_centers)
    # print(marker_centers_estimated)
    np.testing.assert_allclose(marker_centers, marker_centers_estimated, atol=2) # only has to be within 2 pixels


    

    





