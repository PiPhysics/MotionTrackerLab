import os
import cv2
from .base_camera import BaseCamera
from ..log import log

class Camera(BaseCamera):
    video_source = 0
    fps: int
    device_index:int = 0
    def __init__(self, width=640, height=360, callback_thread_closed=None, fps=60, device_index=0):
        if os.environ.get('OPENCV_CAMERA_SOURCE'):
            Camera.set_video_source(int(os.environ['OPENCV_CAMERA_SOURCE']))
        else:
            Camera.set_video_source(device_index)
        super(Camera, self).__init__(width=width, height=height, callback_thread_closed=callback_thread_closed)
        Camera.fps = fps
        Camera.device_index = device_index
    

    @staticmethod
    def set_video_source(source):
        Camera.video_source = source

    @staticmethod
    def frames():
        camera = None
        try:
            camera = cv2.VideoCapture(Camera.video_source)
            camera.set(3, BaseCamera.width)  # width
            camera.set(4, BaseCamera.height)  # height
            camera.set(5, Camera.fps)  # 60 fps
            # raise RuntimeError('Could not start camera.') # uncomment for testing exceptions

            if not camera.isOpened():
                raise RuntimeError('Could not start camera.')

            while True and not Camera.stop_flag:
                # read current frame
                _, img = camera.read()
                # return image from frame
                yield img
                # encode as a jpeg image and return it
                # cv2.imencode('.jpg', img)[1].tobytes()
            # release the camera when done
        finally:
            if camera is not None:
                log.info("Stop flag received. Releasing OpenCV camera...")
                camera.release()
