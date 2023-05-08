import { Point, Points } from "./types";
const API_BASE_URL = "/api";

const API_START_CALIBRATION_URL = API_BASE_URL + "/command/start_calibration";
const API_RECIEVE_CALIBRATION_POINTS_URL =
  API_BASE_URL + "/command/receive_calibration_points";
const API_RECIEVE_OBJECT_POINTS_URL =
  API_BASE_URL + "/command/receive_object_points";
const API_OPEN_EXPERIMENT = API_BASE_URL + "/command/open_experiment";
const API_START_RECORDING = API_BASE_URL + "/command/start_recording";
const API_STOP_RECORDING = API_BASE_URL + "/command/stop_recording";
const API_SOFT_RESET = API_BASE_URL + "/command/soft_reset";

const API_SOFT_RESET_URL = API_BASE_URL + "command/soft_reset";

export async function start_calibration() {
  const response = await fetch(API_START_CALIBRATION_URL, { method: "POST" });
  console.log(response);
}

export async function receive_calibration_points(data: Points) {
  const response = await fetch(API_RECIEVE_CALIBRATION_POINTS_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  console.log(response);
}

export async function receive_object_points(data: Point) {
  const response = await fetch(API_RECIEVE_OBJECT_POINTS_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  console.log(response);
}

export async function open_experiment(data: string) {
  const response = await fetch(API_RECIEVE_OBJECT_POINTS_URL, {
    method: "POST",
    body: data,
    headers: {"Content-Type": "application/json"}
  });
  console.log(response);
}

export async function start_recording() {
  const response = await fetch(API_START_RECORDING, { method: "POST" });
  console.log(response);
}

export async function stop_recording() {
  const response = await fetch(API_STOP_RECORDING, { method: "POST" });
  console.log(response);
}

export async function soft_reset() {
  const response = await fetch(API_SOFT_RESET, { method: "POST" });
  console.log(response);
}
