
const API_BASE_URL = "/api"

const API_START_CALIBRATION_URL = API_BASE_URL + "/command/start_calibration"
const API_SOFT_RESET_URL = API_BASE_URL + "command/soft_reset"

export async function start_calibration()
{
    const response = await fetch(API_START_CALIBRATION_URL, { method: "POST"})
    console.log(response)
}

