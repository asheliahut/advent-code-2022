// read the input from puzzleInput.txt
// advent of code 2022 day 3 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from 'path';

const readInput = async () => {
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "RucksackOutputPart2.txt"), output);
};

// create lookup object for points where
// a-z = 1-26 and A-Z = 27-52
const createLookup = () => {
  const lookup: {string: number} | any = {};
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
  let counter = 1;
  let output = "";
  let lines: string[] = [];
  // loop over input line by line
  input.split("\n").forEach((line) => {
    lines.push(line);
    // add all characters from line to the lineSet
    if (counter === 3) {
      // check for duplicate characters in lines
      const line1Set: Set<string> = new Set();
      const line2Set: Set<string> = new Set();
      const line3Set: Set<string> = new Set();
      // add lines to the sets
      lines[0].split("").forEach((char) => line1Set.add(char));
      lines[1].split("").forEach((char) => line2Set.add(char));
      lines[2].split("").forEach((char) => line3Set.add(char));
      // check for duplicates
      const duplicates = new Set([...line1Set].filter((x) => line2Set.has(x)));
      const duplicates2 = new Set([...duplicates].filter((x) => line3Set.has(x)));
      duplicates2.forEach((char: string) => (total += lookup[char]));

      // reset counter and lines
      counter = 1;
      lines = [];
      return;
    }
    //console.log(counter);
    counter++;
  });

  output = `Total: ${total}`;
  console.log(output);
  await writeOutput(output);
};

main();
