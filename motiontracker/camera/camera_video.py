import os
import cv2
from .base_camera import BaseCamera
from typing import Dict, Tuple, Optional
from ..log import log
import time

class Camera(BaseCamera):
    video_source = 0
    fps: int
    device_index:int = 0
    states:Optional[Dict[str, Tuple[int, int]]] = None
    current_state:str = None
    state_change_flag = False

    def __init__(self, video_fpath=None, states=None, callback_thread_closed=None ):
        if os.environ.get('OPENCV_CAMERA_SOURCE'):
            Camera.set_video_source(int(os.environ['OPENCV_CAMERA_SOURCE']))
        else:
            Camera.set_video_source(video_fpath)
        super(Camera, self).__init__(callback_thread_closed=callback_thread_closed)
        Camera.video_fpath = video_fpath
        Camera.states = states

    @staticmethod
    def set_video_source(source):
        Camera.video_source = source

    @staticmethod
    def set_state(state):
        Camera.current_state = state
        Camera.state_change_flag = True

    @staticmethod
    def _cycle_state():
        "This is hardcoded here just for testing"
        if Camera.current_state == None:
            Camera.set_state("calibrate")
        elif Camera.current_state == "calibrate":
            Camera.set_state("track")
        elif Camera.current_state == "track":
            Camera.set_state("tracking")
        elif Camera.current_state == "tracking":
            Camera.set_state("calibrate")

    @staticmethod
    def frames():
        camera = None
        try:
            camera = cv2.VideoCapture(Camera.video_source)
            if not camera.isOpened():
                raise RuntimeError('Could not start camera.')
            
            fps = camera.get(cv2.CAP_PROP_FPS) 
            frame_count = int(camera.get(cv2.CAP_PROP_FRAME_COUNT))
            msec_to_frame = fps / 1000

            # This keeps track of what time ranges (corresponding frame ranges) we should be playing
            end_ms = int(frame_count/fps * 1000)
            end_frame = int(msec_to_frame * end_ms)
            start_ms = 0
            start_frame = int(msec_to_frame * start_ms)

            # the last valid image that was received
            last_img = BaseCamera.dummy_image
            sleep_duration = 1.0 / fps

            while True and not Camera.stop_flag:
                time.sleep(sleep_duration)
                # this get the current frame number we are on
                current_frame = camera.get(cv2.CAP_PROP_POS_FRAMES)
                log.debug(f"start_ms: {start_ms}, end_ms: {end_ms}, start_frame: {start_frame}, end_frame: {end_frame}, current_frame: {current_frame}, ")

                if Camera.state_change_flag:
                    Camera.state_change_flag = False
                    start_ms, end_ms = Camera.states[Camera.current_state]
                    start_frame = int(msec_to_frame * start_ms)
                    log.debug(f"Camera Video: updating new position, start_frame: {start_frame}, start_ms: {start_ms}")
                    camera.set(cv2.CAP_PROP_POS_FRAMES, start_frame)  # width

                end_frame = int(msec_to_frame * end_ms)
                if current_frame >= end_frame:
                    log.debug(f"Camera Video: restarting loop, start_frame: {start_frame}, start_ms: {start_ms}")
                    camera.set(cv2.CAP_PROP_POS_FRAMES, start_frame)  # width

                log.debug("About to read from video file")
                success, img = camera.read()
                if not success:
                    log.debug("Frame did not come!")
                    yield last_img
                else:
                    log.debug(f"Got video frame, shape: {img.shape}")
                    last_img = img
                    yield img
        finally:
            if camera is not None:
                log.info("Stop flag received. Releasing OpenCV camera...")
                camera.release()
                Camera.state_change_flag = False
