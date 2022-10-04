import inquirer from "inquirer";
import moment from "moment";

import calculateFactorial from "./calculateFactorial.js";

const { inputNumber } = await inquirer.prompt([
  {
    type: "input",
    name: "inputNumber",
    message: "Calculate factorial for:",
    default: 10,
  },
]);

const clearLastLine = () => {
  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine(1);
};

const numbers = [];

for (let i = 1n; i <= inputNumber; i++) {
  numbers.push(i);
}

const startedTime = Date.now();

console.log("Calculating...");

const factorial = calculateFactorial(numbers);

clearLastLine();

const duration = moment().diff(startedTime, "seconds", true);

console.log(factorial)

console.info(`\nCalculated in ${duration} seconds!`);
