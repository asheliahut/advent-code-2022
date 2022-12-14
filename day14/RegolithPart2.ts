// read the input from puzzleInput.txt
// advent of code 2022 day 14 part 2

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  // return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "regolithPart2.txt"), output);
};

const maxArraySize = 999999;

interface IPoint {
  0: string;
  1: string;
  2: string;
  3: string;
}

const numberToSymbol: IPoint = {
  0: ".",
  1: "#",
  2: "+",
  3: "o",
};

function parsedInput(lines: string[]) {
  const grid: number[][][] = [];
  for (const line of lines) {
    grid.push(
      line.split(" -> ").map((point) => {
        const [x, y] = point.split(",").map((num) => parseInt(num));

        return [x, y];
      })
    );
  }
  return grid;
}

function formCave(rocks: number[][][], floor: number) {
  const grid: number[][] = [];
  for (let i = 0; i < floor; i++) {
    grid.push(new Array(maxArraySize).fill(0));
  }
  // fill the floor with rocks
  grid.push(new Array(maxArraySize).fill(1));
  // set the spawn point for sand
  grid[0][500] = 2;
  for (const lineOfRocks of rocks) {
    // add rocks to grid
    for (let i = 0; i < lineOfRocks.length; i++) {
      if (i === lineOfRocks.length - 1) {
        break;
      }
      const [x1, y1] = lineOfRocks[i];
      const [x2, y2] = lineOfRocks[i + 1];

      if (x1 === x2 && y1 === y2) {
        grid[y1][x1] = 1;
      } else if (x1 === x2) {
        // vertical
        if (y1 < y2) {
          for (let j = y1; j <= y2; j++) {
            grid[j][x1] = 1;
          }
        } else {
          for (let j = y2; j <= y1; j++) {
            grid[j][x1] = 1;
          }
        }
      } else if (y1 === y2) {
        // horizontal
        if (x1 < x2) {
          for (let j = x1; j <= x2; j++) {
            grid[y1][j] = 1;
          }
        } else {
          for (let j = x2; j <= x1; j++) {
            grid[y1][j] = 1;
          }
        }
      } else {
        throw new Error("Rock Formation is not horizontal or vertical");
      }
    }
  }
  return grid;
}

function letSandFlow(grid: number[][], x: number, y: number): boolean {
  let result: boolean = false;
  console.log(`x: ${x}, y: ${y}`);

  if (
    x === 500 &&
    y === 0 &&
    [1, 3].includes(grid[y + 1][x]) &&
    [1, 3].includes(grid[y + 1][x - 1]) &&
    [1, 3].includes(grid[y + 1][x + 1])
  ) {
    return false;
  }

  if (grid[y + 1][x] === 0) {
    //console.log("flowing down");
    result = letSandFlow(grid, x, y + 1);
  } else if ([1, 3].includes(grid[y + 1][x])) {
    if (grid[y + 1][x - 1] === 0) {
      //console.log("flowing left diagonal");
      result = letSandFlow(grid, x - 1, y + 1);
    } else if (grid[y + 1][x + 1] === 0) {
      //console.log("flowing right diagonal");
      result = letSandFlow(grid, x + 1, y + 1);
    } else {
      //console.log("resting");
      grid[y][x] = 3;
      result = true;
    }
  } else {
    //console.log("resting");
    grid[y][x] = 3;
    result = true;
  }

  return result;
}

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let output: string = "";

  const rocks: number[][][] = parsedInput(lines);
  const maxHeight = Math.max(
    ...rocks.map((rock) => Math.max(...rock.map((point) => point[1])))
  );
  const floor = maxHeight + 2;
  const cave = formCave(rocks, floor);
  let numSandResting: number = 0;

  console.log(cave[9][500]);

  while (letSandFlow(cave, 500, 0)) {
    // console.log(cave[8][500]);
    numSandResting++;
  }
  // add one more to make up for final resting sand
  numSandResting++;
  output = `Number of Sand Resting: ${numSandResting}`;
  console.log(output);
  await writeOutput(output);
};

main();
