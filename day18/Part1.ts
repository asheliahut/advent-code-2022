// read the input from puzzleInput.txt
// advent of code 2022 day 18 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  // return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "Part1.txt"), output);
};

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let output: string = "";

  output = `Output Message: ${output}`;
  console.log(output);
  await writeOutput(output);
};

main();
