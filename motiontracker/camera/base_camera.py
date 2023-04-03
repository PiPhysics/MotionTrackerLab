import time
import threading
import io
from pathlib import Path
from PIL import Image
import numpy as np
from ..log import log

from labconfig import CONFIG

try:
    from greenlet import getcurrent as get_ident
except ImportError:
    try:
        from thread import get_ident
    except ImportError:
        from _thread import get_ident
# https://blog.miguelgrinberg.com/post/flask-video-streaming-revisited

THIS_DIR = Path(__file__).parent
DUMMY_IMAGE = THIS_DIR / "dummy_image.jpg"
class FrameEvent(object):
    """An Event-like class that signals all active clients when a new frame is
    available.
    """
    def __init__(self):
        self.events = {}

    def wait(self, timeout=None):
        """Invoked from each client's thread to wait for the next frame."""
        ident = get_ident()
        if ident not in self.events:
            # this is a new client
            # add an entry for it in the self.events dict
            # each entry has two elements, a threading.Event() and a timestamp
            self.events[ident] = [threading.Event(), time.time()]
        return self.events[ident][0].wait(timeout=timeout)

    def set(self):
        """Invoked by the camera thread when a new frame is available."""
        now = time.time()
        remove = None
        for ident, event in self.events.items():
            if not event[0].isSet():
                # if this client's event is not set, then set it
                # also update the last set timestamp to now
                event[0].set()
                event[1] = now
            else:
                # if the client's event is already set, it means the client
                # did not process a previous frame
                # if the event stays set for more than 5 seconds, then assume
                # the client is gone and remove it
                if now - event[1] > 5:
                    remove = ident
        if remove:
            del self.events[remove]

    def clear(self):
        """Invoked from each client's thread after a frame was processed."""
        self.events[get_ident()][0].clear()


class BaseCamera(object):
    thread = None  # background thread that reads frames from camera
    frame = None  # current frame is stored here by background thread
    last_access = 0  # time of last client access to the camera
    stop_flag = False # if set to true, camera should be turned off
    event = FrameEvent()
    width:int = 640
    height:int = 360
    callback_thread_closed = None
    dummy_image = None

    def __init__(self, width=640, height=360, callback_thread_closed=None):
        """Start the background camera thread if it isn't running yet."""
        BaseCamera.width = width
        BaseCamera.height = height
        BaseCamera.callback_thread_closed = callback_thread_closed
        dummy_image = Image.open(DUMMY_IMAGE)
        BaseCamera.dummy_image = np.asarray(dummy_image.resize((width, height)))

    def start_camera(self):
        if BaseCamera.thread is None:
            BaseCamera.last_access = time.time()

            # start background frame thread
            BaseCamera.thread = threading.Thread(target=self._thread)
            BaseCamera.stop_flag = False
            BaseCamera.thread.start()
            # wait until first frame is available
            if BaseCamera.thread is not None:
                log.debug("Waiting for first camera frame...")
                BaseCamera.event.wait()
                BaseCamera.event.clear()

    def stop_camera(self):
        BaseCamera.stop_flag = True

    def get_frame(self, timeout=None):
        """Return the current camera frame."""
        BaseCamera.last_access = time.time()

        # if the camera is off just return the dummy image
        if BaseCamera.thread is None or BaseCamera.stop_flag:
            log.debug("Sending Dummy Image")
            return self.dummy_image

        # wait for a signal from the camera thread
        log.debug("Inside Base Camera Get Frame, Waiting for Event")
        success = BaseCamera.event.wait(timeout=timeout)
        if not success:
            log.debug("Frame took to long, skipping frame and returning None")
            raise RuntimeError("No frame camera frame received")
        log.debug("Inside Base Camera Get Frame, Waiting to Clear Event")
        BaseCamera.event.clear()
        return BaseCamera.frame

    def frames():
        """"Generator that returns frames from the camera."""
        raise RuntimeError('Must be implemented by subclasses.')

    @classmethod
    def _thread(cls):
        """Camera background thread."""
        log.info('Starting camera thread...')
        try:
            frames_iterator = cls.frames()
            t_prev = time.perf_counter()
            for frame in frames_iterator:
                t_now = time.perf_counter()
                dt = (t_now-t_prev) * 1000
                log.debug(f"Frame Rate: {dt:.0f}")
                BaseCamera.frame = frame
                BaseCamera.event.set()  # send signal to clients
                time.sleep(0)

                # if there hasn't been any clients asking for frames in
                # the last X seconds then stop the thread
                if time.time() - BaseCamera.last_access > CONFIG["motion_tracker"]["inactive_timer"]:
                    frames_iterator.close()
                    log.info('Stopping camera thread due to inactivity.')
                    break
                t_prev = t_now
        except Exception as e:
            log.error("Error in Camera thread! Closing thread, try starting again later")
            log.exception(e)
            BaseCamera.event.set() # need to set so that start_camera does not hang if camera can not open
        finally:
            log.info("Closing Camera thread...")
            BaseCamera.thread = None
            BaseCamera.stop_flag = False
            if BaseCamera.callback_thread_closed is not None:
                BaseCamera.callback_thread_closed()

