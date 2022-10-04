import ProgressBar from "cli-progress";
import inquirer from "inquirer";
import moment from "moment";
import os from "os";
import path from "path";
import { Worker } from "worker_threads";

import calculateFactorial from "./calculateFactorial.js";

const workerPath = path.resolve("src", "worker.js");

const CPU_COUNT = os.cpus().length;

const progressBar = new ProgressBar.Bar({
  format: "Calculating factorial [{bar}] {percentage}% ",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
  clearOnComplete: true,
  emptyOnZero: true,
});

const { inputNumber } = await inquirer.prompt([
  {
    type: "input",
    name: "inputNumber",
    message: "Calculate factorial for:",
    default: 10,
  },
]);

const numbers = [];

for (let i = 1n; i <= inputNumber; i++) {
  numbers.push(i);
}

const segmentSize = Math.ceil(numbers.length / CPU_COUNT);
const segments = [];

for (let segmentIndex = 0; segmentIndex < CPU_COUNT; segmentIndex++) {
  const start = segmentIndex * segmentSize;
  const end = start + segmentSize;
  const segment = numbers.slice(start, end);
  segments.push(segment);
}

progressBar.start(segments.length, 0);

const promises = segments.map(
  (segment) =>
    new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: segment,
      });
      worker.on("message", (message) => {
        progressBar.increment();
        resolve(message);
      });
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      });
    })
);

const startedTime = Date.now();

const factorial = await Promise.all(promises).then(calculateFactorial);

progressBar.stop();

const duration = moment().diff(startedTime, "seconds", true);

console.log(factorial)

console.info(`\nCalculated in ${duration} seconds!`);
