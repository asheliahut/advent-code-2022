// read the input from puzzleInput.txt
// advent of code 2022 day 4 part 2

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(
    path.join(__dirname, "CampCleanupOutputPart2.txt"),
    output
  );
};

const main = async () => {
  const input = await readInput();
  let total = 0;
  let output = "";
  // loop over input line by line
  input.split("\n").forEach((line) => {
    // split the line by a comma and get each half into a variable
    const [left, right] = line.split(",");
    // change a string of a range of numbers using a - into an array of numbers
    const leftRange = left.split("-").map((num) => parseInt(num));
    const rightRange = right.split("-").map((num) => parseInt(num));
    // create a range between leftRange[0] and leftRange[1]
    const leftRangeArray = Array.from(
      { length: leftRange[1] - leftRange[0] + 1 },
      (_, i) => i + leftRange[0]
    );
    const rightRangeArray = Array.from(
      { length: rightRange[1] - rightRange[0] + 1 },
      (_, i) => i + rightRange[0]
    );
    // check if leftRangeArray has any elements in common with rightRangeArray

    if (rightRangeArray.some((num) => leftRangeArray.includes(num))) {
      total++;
      return;
    } else if (leftRangeArray.some((num) => rightRangeArray.includes(num))) {
      total++;
      return;
    }
  });

  output = `Total: ${total}`;
  console.log(output);
  await writeOutput(output);
};

main();
