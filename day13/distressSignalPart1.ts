// read the input from puzzleInput.txt
// advent of code 2022 day 13 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  // return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "distressSignalPart1.txt"), output);
};

// parse the input into 2 lists of numbers breaking on the blank line
// the input is in the form of "[[1],[2,3,4]]"
function parseInput(lines: string[]): number[][] {
  let result: number[][] = [];
  let temp: any = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "") {
      result.push(temp);
      temp = [];
      continue;
    } else {
      temp.push(JSON.parse(lines[i]));
    }
  }
  result.push(temp);
  return result;
}

// write a comparison function to determine which index is less than, equal, or greater than the other
// if the value at the index is less than the other, return -1
// if the value at the index is equal to the other, return 0
// if the value at the index is greater than the other, return 1
// if comparing a number to an array, convert the number to an array of 1 element
function comparePair(a: any, b: any): number {
  let result: number = 0;
  if (Array.isArray(a) && !Array.isArray(b)) {
    return comparePair(a, [b]);
  } else if (!Array.isArray(a) && Array.isArray(b)) {
    return comparePair([a], b);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length < b.length) {
      for (let i = 0; i < a.length; i++) {
        if (a[i] < b[i]) {
          if (Array.isArray(a[i]) && !Array.isArray(b[i])) {
            return comparePair(a[i], [b[i]]);
          } else if (!Array.isArray(a[i]) && Array.isArray(b[i])) {
            return comparePair([a[i]], b[i]);
          } else {
            result = 1;
          }
        } else if (a[i] > b[i]) {
          if (Array.isArray(a[i]) && !Array.isArray(b[i])) {
            return comparePair(a[i], [b[i]]);
          } else if (!Array.isArray(a[i]) && Array.isArray(b[i])) {
            return comparePair([a[i]], b[i]);
          } else {
            result = -1;
          }
          break;
        } else {
          result = 0;
        }

        if (b[i + 1] !== undefined && a[i+1] === undefined) {
          return 1;
        }
      }
    } else if (a.length === b.length) {
      for(let i = 0; i < a.length; i++) {
        if (a[i] < b[i]) {
          result = 1;
        } else if (a[i] > b[i]) {
          result = -1;
          break;
        } else {
          result = 0;
        }
      }
    } else {
      return -1;
    }
  } else {
    if (a < b) {
      result = 1;
    } else if (a === b) {
      result = 0;
    } else {
      result = -1;
    }
  }

  return result;
}

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let output: string = "";
  let sumOfIndidicies: number = 0;

  const parsedInput = parseInput(lines);

  console.log(parsedInput);

  // loop through parsedInput
  for (let i = 0; i < parsedInput.length; i++) {
    const currentArray = parsedInput[i];
    const areArraysEqual = comparePair(currentArray[0], currentArray[1]) >= 0;
    

    if (areArraysEqual) {
      console.log(`areArraysEqual: ${areArraysEqual}, currentIndex: ${i + 1}`);
      sumOfIndidicies += i + 1;
    }
  }

  output = `Sum of indicies: ${sumOfIndidicies}`;
  console.log(output);
  await writeOutput(output);
};

main();
