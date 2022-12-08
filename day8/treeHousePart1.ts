// read the input from puzzleInput.txt
// advent of code 2022 day 8 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from 'path';

const readInput = async () => {
  // return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "treeHousePart1.txt"), output);
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
  let treesOutsideGrid = 0;

  // start by counting the edges to mark as seen
  for (let i = 0; i < matrix[0].length; i++) {
    if (!matrix[0][i].seen) {
      treesOutsideGrid++;
      matrix[0][i].seen = true;
    }
  }
  for (let i = 0; i < matrix[0].length; i++) {
    if (!matrix[matrix.length - 1][i].seen) {
      treesOutsideGrid++;
      matrix[matrix.length - 1][i].seen = true;
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    if (!matrix[i][0].seen) {
      treesOutsideGrid++;
      matrix[i][0].seen = true;
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    if (!matrix[i][matrix.length - 1].seen) {
      treesOutsideGrid++;
      matrix[i][matrix.length - 1].seen = true;
    }
  }



  // start at the top left corner and traverse to the top right corner
  // count the trees that are visable from the left
  let x = 1;
  let y = 1;
  
  while (y < matrix.length - 1) {
    let curLargestTreeNumberFromLeft = matrix[y][0].number;
    while (x < matrix[0].length - 1) {
      const tree = matrix[y][x];
      if (tree.number > curLargestTreeNumberFromLeft) {
        curLargestTreeNumberFromLeft = tree.number;

        if (tree.seen === false) {
          treesOutsideGrid++;
          tree.seen = true;
        }
      }
      x++;
    }
    x = 1;
    y++;
  }

  // start at the top right corner and traverse to the bottom right corner
  // count the trees that are visable from the top
  x = matrix[0].length - 2;
  y = 1;
  
  while (x >= 1) {
    let curLargestTreeNumberFromTop = matrix[0][x].number;
    while (y < matrix.length - 1) {
      const tree = matrix[y][x];
      
      if (tree.number > curLargestTreeNumberFromTop) {
        curLargestTreeNumberFromTop = tree.number;

        if (tree.seen === false) {
          treesOutsideGrid++;
          tree.seen = true;
        }
      }
      y++;
    }
    y = 1;
    x--;
  }
  

  // start at the bottom right corner and traverse to the bottom left corner
  // count the trees that are visable from the bottom
  x = matrix[0].length - 2;
  y = matrix.length - 2;
  while (y >= 1) {
    let curLargestTreeNumberFromRight = matrix[y][matrix[0].length - 1].number;
    while (x >= 1) {
      const tree = matrix[y][x];
      
      if (tree.number > curLargestTreeNumberFromRight) {
        curLargestTreeNumberFromRight = tree.number;

        if (tree.seen === false) {
          treesOutsideGrid++;
          tree.seen = true;
        }
      }
      x--;
    }
    x = matrix[0].length - 2;
    y--;
  }

  // start at the top left corner and traverse to the bottom left corner
  // count the trees that are visable from the bottom
  x = 1;
  y = matrix.length - 2
  while (x < matrix[0].length - 1) {
    let curLargestTreeNumberFromBottom = matrix[matrix.length - 1][x].number;
    while (y >= 1) {
      const tree = matrix[y][x];
      if (tree.number > curLargestTreeNumberFromBottom) {
        curLargestTreeNumberFromBottom = tree.number;

        if (tree.seen === false) {
          treesOutsideGrid++;
          tree.seen = true;
        }
      }
      y--;
    }
    y = matrix.length - 2;
    x++;
  }

  output = `Trees Outside Grid: ${treesOutsideGrid}`;
  console.log(output);
  await writeOutput(output);
};

// write a function that takes a matrix and returns the number of trees outside the grid
// the trees outside the grid are the trees that are not visable from outside the grid
// a matrix is composed of a 2d array of numbers which represent trees as their height
// a tree is visible from outside the grid as lon as it is taller than the trees from the edge inward



main();
