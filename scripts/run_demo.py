import time
from statemachine.contrib.diagram import DotGraphMachine
import cv2

from labconfig import CONFIG
from labconfig.types import CalibrationCoordinatesPixels, PointInt
from motiontracker.log import log
from motiontracker.trackerstate import MotionTrackerController


# Global variables whose only purpose is for the main function
num_clicks = 0
ccp = CalibrationCoordinatesPixels()
start = PointInt()
machine = MotionTrackerController(CONFIG)

def main():
    print("Command             -> key")

    print("quit                -> q")
    print("start/stop camera   -> s")
    print("calibrate/reset     -> c")
    print("tracking/reset      -> t")
    print("The next commands are only available for a dummy camera")
    print("next camera state -> n")
    print("Jump cal/track      -> 1")
    # log.info("Enter 'q' to quit. Enter 's' to start camera. Enter 'c' to close camera.")

    def click_event(event, x, y, flags, params):
        import cv2
        global num_clicks, ccp, start
        # checking for left mouse clicks
        if event == cv2.EVENT_LBUTTONDOWN:
            log.info(f"Left Click: ({x},{y})")
            if num_clicks < 6:
                ccp[num_clicks] = PointInt(x=x, y=y)
                log.info(f"{ccp}")
            else:
                start = PointInt(x=x, y=y)
                log.info(start)
            num_clicks += 1

    cv2.imshow("Camera", machine.get_frame())
    cv2.setMouseCallback("Camera", click_event)

    # use these if you want to skip through quickly the states
    # {"tl": {"x": 235, "y": 69}, "tm": {"x": 482, "y": 68}, "tr": {"x": 734, "y": 69}, "bl": {"x": 232, "y": 221}, "bm": {"x": 478, "y": 216}, "br": {"x": 732, "y": 219}}
    default_calib_points = CalibrationCoordinatesPixels(tl=PointInt(x=235, y=69), tm=PointInt(x=482, y=68), tr=PointInt(x=734, y=69), bl=PointInt(x=232, y=221), bm=PointInt(x=478, y=216), br=PointInt(x=732, y=219))
    default_track_point = PointInt(x=331, y=273)
    while True:
        try:
            log.debug("Getting Camera Frame")
            cv2.imshow("Camera", machine.get_frame())
            key = cv2.waitKey(30)
            if key == ord("q"):
                machine.soft_reset()
                break
            elif key == ord("s"):
                if machine.is_camera_on:
                    log.info("Turning off Camera")
                    machine.soft_reset()
                    cv2.destroyAllWindows()  # necessary for some reason...
                else:
                    log.info("Turning on Camera")
                    log.info(
                        "Please click the 6 calibration stickers (tl, tm, tr, bl, bm, br)"
                    )
                    machine.start_calibration()
            elif key == ord("c"):
                if num_clicks >= 6:
                    machine.receive_calibration_points(calibration_coordinates_px=ccp)
                else:
                    log.error("You have not clicked all 6 calibration coordinates")
            elif key == ord("t"):
                if machine.is_tracking_on:
                    machine.reset_tracking()
                elif num_clicks >= 7:
                    machine.receive_object_points(start=start)
                else:
                    log.error("You have not clicked on the object to being tracked")
            elif key == ord("o"):
                experiment_name = input("Please enter your experiment: ")
                machine.open_experiment(experiment_name=experiment_name)
            elif key == ord("r"):
                if machine.is_recording_on:
                    machine.stop_recording()
                else:
                    machine.start_recording()
            elif key == ord("n"):
                log.info(
                    "Cycling state of camera. This only available for the CameraVideo used for testing"
                )
                machine.camera._cycle_state()
            elif key == ord('1'):
                log.info("Fast Forwarding to Tracking State! This is for debug purposes only")
                machine.cycle_camera()
                time.sleep(0.1)
                machine.start_calibration()
                time.sleep(0.1)
                machine.receive_calibration_points(calibration_coordinates_px=default_calib_points)
                time.sleep(0.1)
                machine.receive_object_points(start=default_track_point)
                time.sleep(0.1)
                machine.cycle_camera()
                machine.cycle_camera()
                
        except Exception as e:
            log.exception("Something went wrong!")
        # log.info(f"Current State: {machine.current_state.id}")

    machine.soft_reset()
    cv2.destroyAllWindows()
    # graph = DotGraphMachine(MotionTrackerController)  # also accepts instances
    # dot = graph()
    # dot.write_png("assets/MotionTrackerController.png")


if __name__ == "__main__":
    main()
