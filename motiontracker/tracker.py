import time
from textwrap import dedent
from copy import copy, deepcopy
import threading
from typing import Callable, List, Dict
import cv2
import numpy as np
from .log import log

from labconfig import CONFIG
from labconfig.types import ROIConfig, ObjectState, PointInt, PointFloat, ROI
from .camera.base_camera import BaseCamera, FrameEvent
from .calibration import region_growing, get_hsl_lo_hi, get_object_position
from .utility.cv_util import hconcat_resize, vconcat_resize


def debug_image(full_bgr, debug=False, crop_bgr=None, crop_mask=None):
    if not debug:
        return full_bgr
    crop_mask_ = cv2.cvtColor(crop_mask, cv2.COLOR_GRAY2BGR)
    debug_small = vconcat_resize([crop_bgr, crop_mask_])
    debug_big = hconcat_resize([full_bgr, debug_small])
    return debug_big
    

class Tracker(object):
    thread: threading.Thread = None  # background thread that reads tracks frames
    camera: BaseCamera = None
    callback_thread_closed: Callable[[], List[int]] = None
    callback_new_tracking_position: Callable[[Dict], None] = None

    track_frame = None
    event = FrameEvent()
    roi: ROI = None
    stop_tracking_flag: bool = False  # if this is set to true, it will top the thread
    active_recording: bool = False
    time_start = time.monotonic() * 1000  # milliseconds
    recorded_object_states: List[ObjectState] = []
    current_object_state: ObjectState = ObjectState(pixel_position=PointInt(x=0, y=0))
    dlt: np.ndarray = None

    def __init__(
        self,
        camera: BaseCamera,
        callback_thread_closed=None,
        callback_new_tracking_position=None,
    ):
        """Start the background camera thread if it isn't running yet."""
        Tracker.camera = camera
        Tracker.callback_thread_closed = callback_thread_closed
        Tracker.callback_new_tracking_position = callback_new_tracking_position

    def start_tracking(self, px: int, py: int, dlt: np.ndarray):
        if Tracker.thread is None:
            # start background frame thread
            Tracker.roi = ROI(**CONFIG["motion_tracker"]["tracking"]["roi"])
            Tracker.thread = threading.Thread(target=self._thread, args=(px, py))
            Tracker.stop_tracking_flag = False
            Tracker.stop_recording_flag = False
            Tracker.active_recording = False
            Tracker.recorded_object_states = []
            Tracker.current_object_state: ObjectState = ObjectState(pixel_position=PointInt(x=px,y=py))
            Tracker.dlt = dlt
            Tracker.thread.start()

    def stop_tracking(self):
        Tracker.stop_tracking_flag = True

    def start_recording(self):
        Tracker.active_recording = True
        Tracker.recorded_object_states = []

    def stop_recording(self) -> List[ObjectState]:
        Tracker.active_recording = False
        return Tracker.recorded_object_states[:]  # makes a copy
    
    def get_frame(self, timeout=None):
        """Return the current camera frame."""
        # if the camera is off just return the dummy image
        if Tracker.thread is None or Tracker.stop_tracking_flag:
            log.warn("Tracking thread has not started! Sending Dummy Image from camera")
            return Tracker.camera.get_frame()

        log.debug("Inside Tracker Get Frame, Waiting for Event")
        success = Tracker.event.wait(timeout=timeout)
        if not success:
            log.debug("Tracker frame took too long, raising exception")
            raise RuntimeError("No tracking frame received")
        Tracker.event.clear()
        return Tracker.track_frame

    @classmethod
    def roi_crop(cls, frame: np.ndarray):
        roi_half_height = int(Tracker.roi.height / 2.0)
        roi_half_width = int(Tracker.roi.width / 2.0)

        pix_pos = Tracker.current_object_state.pixel_position
        frame_i_lo = max(int(pix_pos.y - roi_half_height), 0)
        frame_i_hi = min(int(pix_pos.y + roi_half_height), frame.shape[0])
        frame_j_lo = max(int(pix_pos.x - roi_half_width), 0)
        frame_j_hi = min(int(pix_pos.x + roi_half_width), frame.shape[1])

        # Update the current roi
        Tracker.roi.column_start = frame_j_lo
        Tracker.roi.row_start = frame_i_lo

        roi_frame = frame[frame_i_lo:frame_i_hi, frame_j_lo:frame_j_hi].copy()
        return roi_frame

    @classmethod
    def _thread(cls, px: int, py: int):
        """Camera background thread. i and"""
        log.info("Starting tracking thread...")
        frame = Tracker.camera.get_frame(
            timeout=CONFIG["motion_tracker"]["tracking"]["frame_timeout"]
        )
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        # extract the lower and upper bounds
        hsv_lo, hsv_hi = get_hsl_lo_hi(
            hsv, px, py, 
            th_std_multiplier=CONFIG["motion_tracker"]["tracking"]["th_std_multiplier"],
            rg_std_multiplier=CONFIG["motion_tracker"]["tracking"]["rg_std_multiplier"]
        )  # this finds the lower and upper bounds to track an object at (px,py)
        log.info(f"Tracking: HSL Low: {hsv_lo}, HSL High: {hsv_hi}")

        t_prev = time.perf_counter()
        try:
            while not Tracker.stop_tracking_flag:
                # read from camera in for loop, with timeout
                log.debug("Waiting for frame in tracking thread...")
                frame = Tracker.camera.get_frame(
                    timeout=CONFIG["motion_tracker"]["tracking"]["frame_timeout"]
                )
                log.debug("Received thread in tracking thread, processing...")
                t_now = time.perf_counter()

                ############################################################################
                ####  Process Image, Computer Vision - Find center of object in pixels  ####
                # crop frame from current, computationally efficient
                roi_frame = Tracker.roi_crop(frame)
                hsv = cv2.cvtColor(roi_frame, cv2.COLOR_BGR2HSV)
                # compute mask of object in the roi frame
                mask = cv2.inRange(hsv, hsv_lo, hsv_hi)
                # get object position in image
                point, bgr_image = get_object_position(
                    mask, Tracker.roi, full_bgr_image=frame
                )
                if point is not None:
                    Tracker.current_object_state.pixel_position = point
                    Tracker.current_object_state.local_position = point.transform(
                        Tracker.dlt
                    )
                    Tracker.current_object_state.timestamp = t_now * 1000
                    Tracker.track_frame = debug_image(bgr_image, CONFIG['all']['video_debug'], roi_frame, mask)
                    Tracker.event.set()
                else:
                    log.error("Unable to find object in frame. Skipping to next frame.")
                    Tracker.track_frame = debug_image(frame, CONFIG['all']['video_debug'], roi_frame, mask)
                    Tracker.event.set()
                    continue
                ############################################################################
                ######               End Image Processing                               ####

                dt_ms_processing = (time.perf_counter() - t_now) * 1000
                dt_ms_frame = (t_now - t_prev) * 1000
                if Tracker.active_recording:
                    Tracker.recorded_object_states.append(
                        deepcopy(Tracker.current_object_state)
                    )
                if Tracker.callback_new_tracking_position:
                    Tracker.callback_new_tracking_position(
                        deepcopy(Tracker.current_object_state)
                    )

                t_prev = t_now
                log_msg = dedent(f"""\
                Tracking - Pixel: {Tracker.current_object_state.pixel_position} px;
                Local: {Tracker.current_object_state.local_position} cm;
                TS: {Tracker.current_object_state.timestamp:.0f} ms
                Processing Time: {dt_ms_processing:.0f} ms
                Frame Interval: {dt_ms_frame:.0f} ms
                """).strip("\n")
                log.debug(log_msg)

        except Exception as e:
            log.error(
                "Error in Tracker thread! Closing thread, try tracking again later"
            )
            log.exception(e)
        finally:
            log.info("Closing tracking thread...")
            Tracker.thread = None
            Tracker.stop_tracking_flag = False
            Tracker.active_recording = False
            Tracker.track_frame = frame
            Tracker.event.set()
            if Tracker.callback_thread_closed is not None:
                Tracker.callback_thread_closed()
