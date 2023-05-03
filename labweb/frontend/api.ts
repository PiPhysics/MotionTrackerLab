
import {Point, CalibrationCoordinatesPixels} from "./types"
const API_BASE_URL = "/api"

const API_START_CALIBRATION_URL = API_BASE_URL + "/command/start_calibration"
const API_RECIEVE_CALIBRATION_POINTS_URL = API_BASE_URL + "/command/receive_calibration_points"
const API_RECIEVE_OBJECT_POINTS_URL = API_BASE_URL + "/command/receive_object_points"
const API_SOFT_RESET_URL = API_BASE_URL + "command/soft_reset"

export async function start_calibration()
{
    const response = await fetch(API_START_CALIBRATION_URL, { method: "POST"});
    console.log(response)
}


export async function receive_calibration_points(data: Point)
{
    const response = await fetch(API_RECIEVE_CALIBRATION_POINTS_URL, { method: "POST", body: JSON.stringify(data)});
    console.log(response)
}

export async function receive_object_points()
{
    const response = await fetch(API_RECIEVE_OBJECT_POINTS_URL, { method: "POST"})
    console.log(response)
}