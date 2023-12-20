# Physics Motion Tracking Lab

```python
MotionTrackerLab
├─ scripts # contains all scripts for launching programs
├─ motiontracker # main library for motion tracking
├─ labweb # contains files for the webserver
│  ├─ frontend # javascript code (React) for clients
│  └─ backend # python code for webserver
├─ labconfig # python code for all configuration
├─ logs # log text files will be saved here
├─ data # any saved motion tracking data is saved here
├─ tests # contains all test files 
└─ assets # pictures for documentation website
```

## Install

1. `pip install -e .[dev]` - For Development
2. `npm install`

## Production Run

This will run the webserver

1. `npm run build`
2. `uvicorn labweb:app`

## Development

These instruction are for developers working on the project.

### Development Mode

Open two terminals

1. `uvicorn labweb:app`
2. `npm run start`

Open the url: `http://127.0.0.1:8000`

API Docs: `http://127.0.0.1:8000/api/docs#/`

Add this if you want to work with video files *before* you run `uvicorn labweb:app`: `export LAB_CONFIG_FILE=tests/fixtures/config/simple_config.yaml`. This will not use a different configuration file that loads video files.  You can change the state of the video file with the api command `/command/cycle_camera`.

### Scripts

**Demo**

0. `export LAB_CONFIG_FILE=tests/fixtures/config/simple_config.yaml` - Optional, To load demo video file
1. `python -m scripts.run_demo`


### Tests

To simply run the tests: `pytest -v`

To see all captured output (debugging): `pytest -rPx -v`

## Notes

https://ajhyndman.medium.com/hot-reloading-with-react-and-flask-b5dae60d9898
