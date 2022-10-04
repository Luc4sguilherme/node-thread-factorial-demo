import { parentPort, workerData } from "worker_threads";

import calculateFactorial from "./calculateFactorial.js";

const numbers = workerData;

const result = calculateFactorial(numbers);

parentPort.postMessage(result);
