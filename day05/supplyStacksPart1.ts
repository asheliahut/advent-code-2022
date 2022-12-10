// read the input from puzzleInput.txt
// advent of code 2022 day 5 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(
    path.join(__dirname, "supplyStackOutputPart1.txt"),
    output
  );
};

// create a stack class
class Stack {
  private data: string[] = [];
  private top: number = 0;

  push(element: string) {
    this.data[this.top] = element;
    this.top = this.top + 1;
  }

  length() {
    return this.top;
  }

  peek() {
    return this.data[this.top - 1];
  }

  isEmpty() {
    return this.top === 0;
  }

  pop() {
    if (this.isEmpty() === false) {
      this.top = this.top - 1;
      return this.data.pop();
    }
  }

  print() {
    let top = this.top - 1;
    while (top >= 0) {
      top--;
    }
  }

  reverse() {
    this._reverse(this.top - 1);
  }

  _reverse(index: number) {
    if (index !== 0) {
      this._reverse(index - 1);
    }
  }
}

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let topCrates: string = "";
  let movesBeginIndex: number = 0;
  let stackBottomIndex: number = 0;
  const stacks: Stack[] = [];
  let output: string = "";
  // parse the following into a data structure
  //     [D]
  // [N] [C]
  // [Z] [M] [P]
  //  1   2   3

  // create a stack for each number
  // loop through the input splitting on new lines
  // if the line is blank then get the previous line and split on spaces
  // then create a stack for each number
  // then loop through the input again
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "") {
      movesBeginIndex = i + 1;
      stackBottomIndex = i - 2;
      const numbers = lines[i - 1].split(" ");
      // loop over numbers and create a stack for each one
      // filter numbers to remove empty strings
      numbers
        .filter((n) => n !== "")
        .forEach((number) => {
          const stack = new Stack();
          stacks.push(stack);
        });
    }
  }

  // loop through the input again
  // if a line starts with a blank space or the first character present in a line is not [ then stop looping
  // parse the line with a letter surrounded by brackets in each column
  for (let i = stackBottomIndex; i >= 0; i--) {
    if (!lines[i].trim().startsWith("[")) {
      break;
    }
    // loop through each 3 characters in the line and parse the letter surrounded by brackets into a stack based on the amount of 3 characters in the line
    let columnCount = 0;
    for (let j = 0; j < lines[i].length; j += 4) {
      const letter = lines[i].substring(j + 1, j + 2);
      // check if letter is an empty string
      if (letter !== " ") {
        stacks[columnCount].push(letter);
      }
      columnCount++;
    }
  }

  // console.log(stacks);
  // console.log(stacks.length);

  // move 1 from 2 to 1
  for (let i = movesBeginIndex; i < lines.length; i++) {
    const move = lines[i];
    const moveParts = move.split(" ");
    const numberToMove = parseInt(moveParts[1]);
    const fromStack = parseInt(moveParts[3]) - 1; // subtract 1 because the stacks are 0 indexed
    const toStack = parseInt(moveParts[5]) - 1; // subtract 1 because the stacks are 0 indexed
    // move the numberToMove amount of elements from the fromStack to the toStack in stacks
    for (let j = 0; j < numberToMove; j++) {
      const element = stacks[fromStack].pop();
      stacks[toStack].push(element!);
    }
  }

  // loop through stacks and get the top element into the topCrates string
  stacks.forEach((stack) => {
    topCrates += stack.peek();
  });

  output = `Top Crates: ${topCrates}`;
  console.log(output);
  await writeOutput(output);
};

main();
