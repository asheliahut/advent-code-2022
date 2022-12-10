// read the input from puzzleInput.txt
// advent of code 2022 day 3 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "RucksackOutputPart1.txt"), output);
};

// create lookup object for points where
// a-z = 1-26 and A-Z = 27-52
const createLookup = () => {
  const lookup: { string: number } | any = {};
  for (let i = 1; i <= 26; i++) {
    lookup[String.fromCharCode(i + 96)] = i;
  }
  for (let i = 1; i <= 26; i++) {
    lookup[String.fromCharCode(i + 64)] = i + 26;
  }
  return lookup;
};

const main = async () => {
  const input = await readInput();
  const lookup = createLookup();
  let total = 0;
  let output = "";
  // loop over input line by line
  input.split("\n").forEach((line) => {
    // split line into halves and check for duplicates in the halves
    const half1 = line.slice(0, line.length / 2);
    const half2 = line.slice(line.length / 2);
    const half1Set: Set<string> = new Set();
    const half2Set: Set<string> = new Set();
    // add halves to the sets
    half1.split("").forEach((char) => half1Set.add(char));
    half2.split("").forEach((char) => half2Set.add(char));
    // check for duplicates
    const duplicates = new Set([...half1Set].filter((x) => half2Set.has(x)));
    // add value of duplicates from lookup object to total
    duplicates.forEach((char: string) => (total += lookup[char]));
  });

  output = `Total: ${total}`;
  console.log(output);
  await writeOutput(output);
};

main();
