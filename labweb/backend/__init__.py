from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from .log import log
from labconfig import CONFIG
from .api import api_app, shutdown_api


# Create the mapp
app = FastAPI(title="Main Application")

@app.on_event("shutdown")
def shutdown():
    shutdown_api()

# Serve all static files under the static directory
STATIC_DIR = CONFIG["top_level_directory"] / CONFIG["labweb"]["static_files_directory"]
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Serve root html file
@app.get("/")
def read_index():
    return FileResponse(STATIC_DIR/ "index.html")

# Mount the api router
app.mount("/api", api_app)


