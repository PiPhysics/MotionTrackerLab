from typing import Tuple, List
from pathlib import Path
import csv
import time
import sys
import numpy as np
from statemachine import StateMachine, State
from statemachine.contrib.diagram import DotGraphMachine
from labconfig import CONFIG
from labconfig.types import Config, CalibrationCoordinatesPixels, ObjectState, PointInt, flatten
from .log import log
from .camera.camera_opencv import Camera as CameraCV
from .camera.camera_video import Camera as CameraVideo
from .calibration import find_transition_matrix
from .tracker import Tracker


class MotionTrackerController(StateMachine):
    "State machine for webserver"
    ####################################################
    ##    Finite State Machine - Possible States      ##
    startup = State("startup", initial=True)
    calibrating = State("calibrating")
    calibrated = State("calibrated")
    tracking = State("tracking")
    experiment = State("experiment")
    recording = State("recording")
    ##                                                ##
    ####################################################

    ####################################################
    ##      Finite State Machine - Transitions        ##
    start_calibration = startup.to(calibrating)
    receive_calibration_points = calibrating.to(calibrated) | calibrated.to.itself()
    receive_object_points = calibrated.to(tracking)
    open_experiment = tracking.to(experiment) | experiment.to.itself()
    start_recording = experiment.to(recording)
    stop_recording = recording.to(experiment)
    reset_calibration = (
        calibrated.to(calibrating)
        | tracking.to(calibrating)
        | experiment.to(calibrating)
    )
    # remove tracking object
    reset_tracking = tracking.to(calibrated)
    # unload experiment data, reset to tracking
    close_experiment = experiment.to(tracking)

    soft_reset = (
        startup.to.itself()
        | calibrating.to(startup)
        | calibrated.to(startup)
        | tracking.to(startup)
        | experiment.to(startup)
        | recording.to(startup)
    )
    ##                                                ##
    ####################################################

    ####################################################
    ##              Class Variables                   ##
    # calibration points in pixels that are sent from the client
    # these should be updated when we are in the calibrating state and receive data from the client
    calibration_coordinates_px: CalibrationCoordinatesPixels = None
    # this is the transition matrix to convert between pixel space to local coordinates
    dlt: np.ndarray = None
    experiment_name:str = CONFIG["motion_tracker"]["recording"]["default_experiment_name"]
    trial_num:int = 0
    ##                                                ##
    ####################################################

    def __init__(self, config: Config):
        StateMachine.__init__(self)
        self.config = config
        camera_config = config["motion_tracker"]["camera"]
        if "video_fpath" in camera_config:
            self.camera = CameraVideo(
                **camera_config,
                callback_thread_closed=self.callback_camera_thread_closed,
            )
        else:
            self.camera = CameraCV(
                **camera_config,
                callback_thread_closed=self.callback_camera_thread_closed,
            )
        self.tracker = Tracker(
            camera=self.camera,
            callback_thread_closed=self.callback_tracking_thread_closed,
        )

        # all states that indicate the camera is on
        self.camera_on_states = [
            self.calibrating.id,
            self.calibrated.id,
            self.tracking.id,
            self.experiment.id,
            self.recording.id,
        ]
        # states where tracking is happening
        self.tracking_on_states = [
            self.tracking.id,
            self.experiment.id,
            self.recording.id,
        ]

        self.recording_main_directory = Path(CONFIG["motion_tracker"]["recording"]["save_directory"])
        if not self.recording_main_directory.exists():
            log.info(f"Creating {self.recording_main_directory}")
            self.recording_main_directory.mkdir(parents=True, exist_ok=True)

    ####################################################
    ## General Catch All States and Transition Events ##
    def before_transition(self, event, state):
        log.debug(f"Before '{event}', on the '{state.id}' state.")
        return "before_transition_return"

    def on_transition(self, event, state):
        log.debug(f"On '{event}', on the '{state.id}' state.")
        return "on_transition_return"

    def on_exit_state(self, event, state):
        log.debug(f"Exiting '{state.id}' state from '{event}' event.")

    def on_enter_state(self, event, state):
        log.info(f"Entering '{state.id}' state from '{event}' event.")

    def after_transition(self, event, state):
        log.debug(f"After '{event}', on the '{state.id}' state.")

    ## End General Catch All States and Transition Events ##
    ########################################################

    def on_enter_startup(self, event, state):
        log.info("Entering startup state")

    def on_enter_calibrating(self, event, state):
        log.info(f"Turning on camera. Awaiting to receive calibration points.")
        self.camera.start_camera()

    def on_receive_calibration_points(
        self,
        event,
        state,
        calibration_coordinates_px: CalibrationCoordinatesPixels = None,
    ):
        log.info(f"Received Calibration Points {calibration_coordinates_px}")
        self.calibration_coordinates_px = calibration_coordinates_px

    def on_soft_reset(self):
        log.info("Soft reset has been issued, turning off tracking and camera.")
        self.tracker.stop_tracking()
        self.camera.stop_camera()

    def on_enter_calibrated(self, event, state):
        """This event should be called only after the calibration_points_pixels have been received and updated

        Args:
            event (_type_): _description_
            state (_type_): _description_
        """
        self.dlt = find_transition_matrix(
            self.calibration_coordinates_px,
            CONFIG["motion_tracker"]["calibration_stickers"]["coordinates_local"],
        )
        log.info(f"Updating DLT matrix: {self.dlt}")

    # def on_exit_experiment(self, event, state):
    #     log.info(f"Exiting experiment state, saving {self.experiment_name}")
    #     # wait there is nothing I have to do, its the recording that actually saved files!

    def on_enter_tracking(self, event, state, start: PointInt = None):
        """This event should be called only after the calibration_points_pixels have been received and updated

        Args:
            event (_type_): _description_
            state (_type_): _description_
        """
        log.info(f"Entering tracking state with start coordinates: {start}")
        self.tracker.start_tracking(start.x, start.y, self.dlt)

    def on_reset_tracking(self, event, state):
        log.info("Reset tracking has been issued, turning off tracking.")
        self.tracker.stop_tracking()

    def on_enter_experiment(self, event, state, experiment_name: str = None):
        if experiment_name is not None:
            self.experiment_name = experiment_name
        log.info(f"Entering Experiment state with experiment name: {self.experiment_name}")
        recording_dir = self.get_recording_save_dir()
        recording_dir.mkdir(parents=False, exist_ok=True)
        self.trial_num = len(list(recording_dir.iterdir()))
        log.info(f"Saving files inside folder {recording_dir}, will save next recording with trail_num {self.trial_num}")

    def on_enter_recording(self, event, state):
        log.info(f"Entering Recording state with experiment name: {self.experiment_name}")
        self.tracker.start_recording()

    def on_exit_recording(self, event, state):
        log.info(f"Entering Recording state with experiment name: {self.experiment_name}")
        data = self.tracker.stop_recording()
        self.save_csv(data, self.get_recording_file_path())

    def save_csv(self, data:List[ObjectState], fpath:Path):
        log.info(f"Saving Trial data in {fpath}")
        fieldnames = flatten(data[0].dict()).keys()
        with open(fpath, "w", newline='') as fp:
            writer = csv.DictWriter(fp, fieldnames=fieldnames)
            writer.writeheader()
            for state in data:
                writer.writerow(flatten(state.dict()))
    

    @property
    def is_camera_on(self):
        return self.current_state.id in self.camera_on_states

    @property
    def is_tracking_on(self):
        return self.current_state.id in self.tracking_on_states

    @property
    def is_recording_on(self):
        return self.current_state.id == self.recording.id

    @property
    def in_experiment(self):
        return self.current_state.id == self.experiment.id
    
    def get_recording_save_dir(self):
        recording_path = self.recording_main_directory / self.experiment_name.lower().replace(' ', '_')
        return recording_path
    
    def get_recording_file_path(self):
        recording_fpath = self.get_recording_save_dir() / f"trial_{self.trial_num:03d}.csv"
        return recording_fpath

    def get_frame(self):
        if self.current_state.id in self.tracking_on_states:
            log.debug("Sending Tracking Frame")
            return self.tracker.get_frame()
        else:
            log.debug("Sending Camera Frame")
            return self.camera.get_frame()

    def callback_camera_thread_closed(self):
        log.info("Inside State Machine: camera thread was closed")
        if self.current_state is not self.startup:
            log.error("Camera must have crashed! ")
            self.soft_reset()

    def callback_tracking_thread_closed(self):
        log.info("Inside State Machine: tracking thread was closed")
        if self.current_state is not self.startup:
            log.error("Tracking must have crashed! ")
            self.reset_tracking()


