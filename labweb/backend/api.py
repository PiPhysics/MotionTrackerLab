import time
import io
from PIL import Image
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from .log import log
from labconfig.types import CalibrationCoordinatesPixels, SimpleServerCommand, PointInt
from motiontracker.utility.load_experiments import load_experiment
from labconfig import CONFIG
from motiontracker.trackerstate import MotionTrackerController


mt_controller = MotionTrackerController(CONFIG)
api_app = FastAPI(title="API App")


def shutdown_api():
    log.info("Received shutdown event, closing camera")
    mt_controller.soft_reset()


################################################################################
##                        Start Video Streaming                               ##


def _start_stream(freq: int = 30):
    """Continuous loop to stream the frame from SQLite to html image/jpeg format
    Args:
        freq (int, optional): Loop frequency. Defaults to 30.
    Yields:
        bytes: HTML containing the bytes to plot the stream
    """

    sleep_duration = 1.0 / freq

    while True:
        time.sleep(sleep_duration)
        frame = None
        log.debug("Trying to get frame")
        try:
            frame = mt_controller.get_frame()
        except:
            pass
        if frame is None:
            continue

        log.debug("Received Data")
        imgByteArr = io.BytesIO()
        image = Image.fromarray(frame[:, :, ::-1])  # bgr -> rgb
        image.save(imgByteArr, format="jpeg")
        image_bytes = imgByteArr.getvalue()
        yield (
            b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + image_bytes + b"\r\n"
        )


@api_app.get("/video_feed")
def get_stream(freq: int = 30) -> StreamingResponse:
    """Get an stream of frames
    Args:
        freq (int, optional): Frequency of the continuous loop retrieval (in Hz). Defaults to 30.
    Returns:
        StreamingResponse: FastAPI StreamingResponse
    """

    return StreamingResponse(
        _start_stream(freq),
        media_type="multipart/x-mixed-replace;boundary=frame",
        status_code=206,
    )


##                           End Video Streaming                              ##
################################################################################


@api_app.post("/command/receive_calibration_points")
async def receive_calibration_points(calibration_points: CalibrationCoordinatesPixels):
    success = True
    error_message = ""
    try:
        mt_controller.receive_calibration_points(calibration_coordinates_px=calibration_points)
    except Exception as e:
        success = False
        error_message = str(e)
        log.exception("Error in start calibration API call")
    return dict(success=success, current_state=mt_controller.current_state.value, error_message=error_message)


@api_app.post("/command/receive_object_points")
async def receive_object_points(start: PointInt):
    success = True
    error_message = ""
    try:
        mt_controller.receive_object_points(start=start)
    except Exception as e:
        success = False
        error_message = str(e)
        log.exception("Error in start calibration API call")
    return dict(success=success, current_state=mt_controller.current_state.value, error_message=error_message)


@api_app.post("/command/get_experiment")
async def receive_object_points(experiment_name: str):
    success = True
    error_message = ""
    data = []
    try:
        data = load_experiment(experiment_name)
    except Exception as e:
        success = False
        error_message = str(e)
        log.exception("Error in start calibration API call")
    return dict(success=success, current_state=mt_controller.current_state.value, error_message=error_message, data=data)

@api_app.post("/command/open_experiment")
async def open_experiment(experiment_name: str):
    success = True
    error_message = ""
    try:
        mt_controller.open_experiment(experiment_name=experiment_name)
    except Exception as e:
        success = False
        error_message = str(e)
        log.exception("Error in start calibration API call")
    return dict(success=success, current_state=mt_controller.current_state.value, error_message=error_message)


@api_app.post("/command/{command_name}")
async def execute_command(command_name: SimpleServerCommand):
    success = True
    error_message = ""
    try:
        getattr(mt_controller, command_name.value)()  # call function
    except Exception as e:
        success = False
        log.exception("Error in start calibration API call")
        error_message = str(e)
    return dict(success=success, current_state=mt_controller.current_state.value, error_message=error_message)
