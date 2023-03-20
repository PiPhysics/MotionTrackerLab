from typing import Tuple, List
import numpy as np
from motiontracker.utility.cv_util import findContours
from scipy.spatial import distance
from labconfig.types import CalibrationCoordinatesPixels, CalibrationCoordinatesCentimeters, PointInt, PointFloat, ROI

import matplotlib.pyplot as plt


def gather_values_around_seed(
    image: np.ndarray, seed_pos: Tuple[int, int], k_size: int = 3
):

    row, col = seed_pos
    index_sub = k_size // 2
    start_row = row - index_sub
    end_row = row + index_sub
    start_col = col - index_sub
    end_col = col + index_sub

    # ensure we are gathering data inside the image
    # seed pixel must not be on edge of frame
    assert start_row >= 0 and end_row < image.shape[0]
    assert start_col >= 0 and end_col < image.shape[1]

    return image[start_row : end_row + 1, start_col : end_col + 1, :]


def gather_neighborhood_stats(
    image: np.ndarray, seed_pos: Tuple[int, int], k_size: int = 3
):
    window = gather_values_around_seed(image, seed_pos)
    mean = window.mean(axis=(0, 1))
    std = window.std(axis=(0, 1))
    return (mean, std)

def in_bounds(index, img_shape):
    return index[0] >= 0 and index[0] < img_shape[0] and index[1] >= 0 and index[1] < img_shape[1]

def get_neighbors(index: Tuple[int, int], img_shape):
    bottom = (index[0] + 1, index[1])
    top = (index[0] - 1, index[1])
    right = (index[0], index[1] + 1)
    left = (index[0], index[1] - 1)
    neighbors = [top, right, bottom, left]
    return list(filter(lambda x: in_bounds(x, img_shape), neighbors))

def error_hsv(c1, c2):
    # todo, handle rollover
    return np.linalg.norm(c1-c2)

def get_hsl_lo_hi(hsv:np.ndarray, px:int, py:int, **kwargs):
    """ Get the lo and hi hsl values that should threshold the pixel at (py,px)"""
    binary_image = np.zeros(shape=(hsv.shape[0], hsv.shape[1]), dtype=np.uint8)
    binary_image = region_growing(hsv, (py, px), binary_image, **kwargs)
    binary_image = binary_image.astype(bool)
    mean = hsv[binary_image, :].mean(axis=0)
    std = hsv[binary_image, :].std(axis=0)
    hsv_lo = np.clip(mean - 3 * std, a_min=[0, 0, 0], a_max=[180, 255, 255]).astype(int)
    hsv_hi = np.clip(mean + 3 * std, a_min=[0, 0, 0], a_max=[180, 255, 255]).astype(int)
    return hsv_lo, hsv_hi

def region_growing(
    image: np.ndarray,
    seed_pos: Tuple[int, int],
    binary_image: np.ndarray,
    std_multiplier:float = 3.0,
    max_neighbor_distance: int = 20,
    min_std: Tuple[int, int, int] = (1, 5, 5),
):
    # gather samples around 3X3 kernel
    mean, std = gather_neighborhood_stats(image, seed_pos)
    std = np.maximum(min_std, std)
    # initialize the open list with the seed
    candidates:list[tuple[int, int]] = [seed_pos]
    # continue growing as long as more candidates exist
    while candidates:
        candidate = candidates.pop(0) # get from front of list, BFS
        value = image[candidate[0], candidate[1], :] # get the pixel HSV value
        # print(value)
        # get absolute hue error
        error_hue = abs(mean[0] - value[0]) 
        error_sat = abs(mean[1] - value[1]) 
        if error_hue < (std[0] * std_multiplier) and error_sat < (std[1] * std_multiplier):
            # hue and saturation error is less than some multiplier of std, add to list
            binary_image[candidate[0], candidate[1]] = 255
            neighbors = get_neighbors(candidate, img_shape=image.shape[:2])
            for neighbor in neighbors:
                # only a neighbor to the open list if it has not been added to the open list
                if binary_image[neighbor[0], neighbor[1]] < 1:
                    # print(neighbor)
                    candidates.append(neighbor)
                    binary_image[neighbor[0], neighbor[1]] = 1 # has been added to open list

    # not very efficient, but its vectorized so should be pretty quick
    mask = binary_image == 1 # mask for temporary closed list
    binary_image[mask] = 0 # remove prior inspections
    return binary_image

def extract_calibration_markers(image: np.ndarray, seed_positions: List[Tuple[int, int]], min_area=100):
    binary_image = np.zeros(shape=(image.shape[0], image.shape[1]), dtype=np.uint8)
    for seed in seed_positions:
        binary_image = region_growing(image, seed, binary_image)

    contour_positions = extract_contours_from_markers(binary_image, seed_positions, min_area=min_area).astype(int)
    return contour_positions

def extract_contours_from_markers(binary_image, seed_positions, min_area=100):
    roi = [0, 0, binary_image.shape[1], binary_image.shape[0]]
    result = findContours(binary_image, roi, min_area=min_area, sort=False)

    seed_positions_np = np.array(seed_positions, dtype=np.float64)
    contour_positions = np.flip(np.array([contour['center']  for contour in result['contours']], dtype=np.float64), axis=1)

    distance_matrix = distance.cdist(contour_positions, seed_positions_np, 'euclidean')
    indices = np.argmin(distance_matrix, axis=1)
    contour_positions = contour_positions[indices, :]

    return contour_positions


def get_object_position(cropped_binary_image, roi:ROI, min_area=100, full_bgr_image=None):
    roi_array = [roi.column_start, roi.row_start, roi.width, roi.height]
    result = findContours(cropped_binary_image, roi_array, min_area=min_area, sort=True, img=full_bgr_image)
    if result['contours']:
        point = result['contours'][0]['center']
        point = PointInt(x=point[0], y=point[1])
        return point, result['img_contours']
    else:
        return None, full_bgr_image

        
# def get_real_world_coordinates_markers(real_world_coords=None):
#     if real_world_coords == None:
#         CALIBRATION_POINTS = dict(
#             tl=[0, 40],
#             tr=[90,40],
#             tm=[45,40],
#             bl=[0,20],
#             br=[90,20],
#             bm=[45,20]
#         )
#     else:
#         CALIBRATION_POINTS=real_world_coords
    
#     return CALIBRATION_POINTS

def find_transition_matrix(ccp:CalibrationCoordinatesPixels, ccc:CalibrationCoordinatesCentimeters):
    tl_x = ccp.tl.x # ccp.x.y
    tl_y = ccp.tl.y # ccp.x.x
    tm_x = ccp.tm.x # ccp.y.y
    tm_y = ccp.tm.y # ccp.y.x
    tr_x = ccp.tr.x # ccp[2].y
    tr_y = ccp.tr.y # ccp[2].x
    
    bl_x = ccp.bl.x # ccp[3].y
    bl_y = ccp.bl.y # ccp[3].x
    bm_x = ccp.bm.x # ccp[4].y
    bm_y = ccp.bm.y # ccp[4].x
    br_x = ccp.br.x # ccp[5].y
    br_y = ccp.br.y # ccp[5].x

    #Form A matrix for Camera Calibration
    A_mat = [[bl_x, bl_y, 1, 0, 0, 0, -bl_x*ccc.bl.x,-bl_y*ccc.bl.x],
            [0, 0, 0, bl_x, bl_y, 1, -bl_x*ccc.bl.y,-bl_y*ccc.bl.y],
            [br_x, br_y, 1, 0, 0, 0, -br_x*ccc.br.x,-br_y*ccc.br.x],
            [0, 0, 0,br_x, br_y, 1, -br_x*ccc.br.y,-br_y*ccc.br.y],
            [tl_x, tl_y, 1, 0, 0, 0, -tl_x*ccc.tl.x,-tl_y*ccc.tl.x],
            [0, 0, 0, tl_x, tl_y, 1, -tl_x*ccc.tl.y,-tl_y*ccc.tl.y],
            [tr_x, tr_y, 1, 0, 0, 0, -tr_x*ccc.tr.x,-tr_y*ccc.tr.x],
            [0, 0, 0, tr_x, tr_y, 1, -tr_x*ccc.tr.y,-tr_y*ccc.tr.y],
            [bm_x, bm_y, 1, 0, 0, 0, -bm_x*ccc.bm.x,-bm_y*ccc.bm.x],
            [0, 0, 0,bm_x, bm_y, 1, -bm_x*ccc.bm.y,-bm_y*ccc.bm.y],
            [tm_x, tm_y, 1, 0, 0, 0, -tm_x*ccc.tm.x,-tm_y*ccc.tm.x],
            [0, 0, 0, tm_x, tm_y, 1, -tm_x*ccc.tm.y,-tm_y*ccc.tm.y]]
    
    b_vec = [ccc.bl.x, ccc.bl.y,
             ccc.br.x, ccc.br.y,
             ccc.tl.x, ccc.tl.y,
             ccc.tr.x, ccc.tr.y,
             ccc.bm.x, ccc.bm.y,
             ccc.tm.x, ccc.tm.y]
    
    A_mat = np.array(A_mat)
    b_vec = np.array(b_vec)

    cal_vec = np.linalg.lstsq(A_mat, b_vec, rcond=None)
    return cal_vec[0]

def coord_transform(obj_coord_pixels, cal_vec):
    """Calculate x and y coordinates (in cm) based on the coefficients (c_1 - c_8) from
        the fractional transformation and the pixel coordinates of each point
        x = (c_1*u + c_2*v + c_3)/(1 + c_7*u + c_8*v)
        y = (c_4*u + c_5*v + c_6)/(1 + c_7*u + c_8*v)

    Args:
        obj_coord_pixels (tuple): the (row, col) tuple of the pixel. Note that Y comes first
        cal_vec (list): Parameters of DLT

    Returns:
        list: The [x,y] coordiate in local space. Note that X comes first!
    """    

    obj_x = (cal_vec[0]*obj_coord_pixels[1] + cal_vec[1]*obj_coord_pixels[0] + cal_vec[2])/\
    (1.0 + cal_vec[6]*obj_coord_pixels[1] + cal_vec[7]*obj_coord_pixels[0])

    obj_y = (cal_vec[3]*obj_coord_pixels[1] + cal_vec[4]*obj_coord_pixels[0] + cal_vec[5])/\
    (1.0 + cal_vec[6]*obj_coord_pixels[1] + cal_vec[7]*obj_coord_pixels[0])

    return [obj_x, obj_y]


