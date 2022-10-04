export default function calculateFactorial(numbers) {
  return numbers.reduce((accumulator, current) => accumulator * current, 1n);
}
