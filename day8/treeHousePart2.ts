// read the input from puzzleInput.txt
// advent of code 2022 day 8 part 2

import { readFileSync, writeFileSync } from "fs";
import * as path from 'path';

const readInput = async () => {
  // return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "treeHousePart2.txt"), output);
};

interface Tree {
  number: number;
  seen: boolean;
}

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let output: string = "";

  // collect the lines of number input in a matrix
  const matrix: Tree[][] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trees = line.split("").map((n) => {
      return {
        number: parseInt(n),
        seen: false
      };
    });
    matrix.push(trees);
  }

  // traverse the matrix and assume the trees are of the height of each number
  // now determine how many trees inwards to the matrix are visable from outside looking inwards towards the edges of the matrix
  // the trees outside the grid are the trees that are not visable from outside the grid


  // preset variables
  let scenicScore = 0;

  // loop through the matrix
  for (let y = 1; y < matrix.length - 1; y++) {
    let currentScenicScore = 0;
    for (let x = 1; x < matrix[0].length - 1; x++) {
      const leftScenicScore: number = getScenicScoreFromLeft(x, y, matrix);
      const topScenicScore: number = getScenicScoreFromTop(x, y, matrix);
      const rightScenicScore: number = getScenicScoreFromRight(x, y, matrix);
      const bottomScenicScore: number = getScenicScoreFromBottom(x, y, matrix);
      currentScenicScore = leftScenicScore * topScenicScore * rightScenicScore * bottomScenicScore;

      if (currentScenicScore > scenicScore) {
        scenicScore = currentScenicScore;
      }
    }
  }

  output = `Highest Scenic Score: ${scenicScore}`;
  console.log(output);
  await writeOutput(output);
};

function getScenicScoreFromLeft(x: number, y: number, matrix: Tree[][]): number {
  // start at the top left corner and traverse to the top right corner
  // count the trees that are visable from the left
  let curLargestTreeNumberFromLeft = matrix[y][x].number;
  let scenicScore = 0;
  let xCursor: number = x - 1;
    
  while (xCursor >= 0) {
    const tree = matrix[y][xCursor];

    if (tree.number < curLargestTreeNumberFromLeft) {
      scenicScore++;
    } else {
      scenicScore++;
      break;
    }
    
    xCursor--;
  }

  return scenicScore;
}

function getScenicScoreFromTop(x: number, y: number, matrix: Tree[][]): number {
  let curLargestTreeNumberFromTop = matrix[y][x].number;
  let scenicScore = 0;
  let yCursor: number = y - 1;

  while (yCursor >= 0) {
    const tree = matrix[yCursor][x];

    if (tree.number < curLargestTreeNumberFromTop) {
      scenicScore++;
    } else {
      scenicScore++;
      break;
    }
    
    yCursor--;
  }

  return scenicScore;
}

function getScenicScoreFromRight(x: number, y: number, matrix: Tree[][]): number {
  let curLargestTreeNumberFromRight = matrix[y][x].number;
  let scenicScore = 0;
  let xCursor: number = x + 1;

  while (xCursor < matrix[0].length) {
    const tree = matrix[y][xCursor];

    if (tree.number < curLargestTreeNumberFromRight) {
      scenicScore++;
    } else {
      scenicScore++;
      break;
    }
    
    xCursor++;
  }

  return scenicScore;
}

function getScenicScoreFromBottom(x: number, y: number, matrix: Tree[][]): number {
  let curLargestTreeNumberFromBottom = matrix[y][x].number;
  let scenicScore = 0;
  let yCursor: number = y + 1;

  while (yCursor < matrix.length) {
    const tree = matrix[yCursor][x];

    if (tree.number < curLargestTreeNumberFromBottom) {
      scenicScore++;
    } else {
      scenicScore++;
      break;
    }
    
    yCursor++;
  }

  return scenicScore;
}

main();
