// read the input from puzzleInput.txt
// advent of code 2022 day 9 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  // return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "ropeBridgePart1.txt"), output);
};

type RopeHead = {
  x: number;
  y: number;
};

type RopeTail = {
  x: number;
  y: number;
  seenXY: Set<string>;
};

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let output: string = "";
  let tail: RopeTail = { x: 0, y: 0, seenXY: new Set() };
  // preset the 0,0 coordinate to be seen
  tail.seenXY.add(JSON.stringify({ x: 0, y: 0 }));
  const head: RopeHead = { x: 0, y: 0 };
  // let grid: ropeHead[][]|ropeTail[][]|null[][] = [[tail,head]];
  // console.log(grid);

  // loop through each line and follow the directions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].split(" ");
    const direction = line[0];
    const distance = parseInt(line[1]);
    // console.log(direction, distance);

    // move the head
    switch (direction) {
      case "R":
        for (let j = 0; j < distance; j++) {
          head.x++;
          // check if the tail is no longer adjacent to the head
          if (!isTailAdjacentToHead(head, tail)) {
            tail = moveTail(head, tail);
          }
        }
        break;
      case "U":
        for (let j = 0; j < distance; j++) {
          head.y++;
          if (!isTailAdjacentToHead(head, tail)) {
            tail = moveTail(head, tail);
          }
        }
        break;
      case "L":
        for (let j = 0; j < distance; j++) {
          head.x--;
          if (!isTailAdjacentToHead(head, tail)) {
            tail = moveTail(head, tail);
          }
        }
        break;
      case "D":
        for (let j = 0; j < distance; j++) {
          head.y--;
          if (!isTailAdjacentToHead(head, tail)) {
            tail = moveTail(head, tail);
          }
        }
        break;
    }
  }

  const numTimesTailVisits = tail.seenXY.size;
  console.log(tail.seenXY);

  output = `Number of times tail visits: ${numTimesTailVisits}`;
  console.log(output);
  await writeOutput(output);
};

function isTailAdjacentToHead(head: RopeHead, tail: RopeTail): boolean {
  if (head.x === tail.x && head.y === tail.y) {
    return true;
  }
  if (head.x === tail.x && head.y === tail.y + 1) {
    return true;
  }
  if (head.x === tail.x && head.y === tail.y - 1) {
    return true;
  }
  if (head.x === tail.x + 1 && head.y === tail.y) {
    return true;
  }
  if (head.x === tail.x - 1 && head.y === tail.y) {
    return true;
  }
  if (head.x === tail.x + 1 && head.y === tail.y + 1) {
    return true;
  }
  if (head.x === tail.x + 1 && head.y === tail.y - 1) {
    return true;
  }
  if (head.x === tail.x - 1 && head.y === tail.y + 1) {
    return true;
  }
  if (head.x === tail.x - 1 && head.y === tail.y - 1) {
    return true;
  }
  return false;
}

function moveTail(head: RopeHead, tail: RopeTail): RopeTail {
  const newTail: RopeTail = { x: tail.x, y: tail.y, seenXY: tail.seenXY };
  // if the tail is no longer adjacent to the head, move the tail to become adjacent to the head

  // check for diagonal cases
  if (newTail.x < head.x && newTail.y < head.y) {
    newTail.x++;
    newTail.y++;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  if (newTail.x > head.x && newTail.y > head.y) {
    newTail.x--;
    newTail.y--;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  if (newTail.x < head.x && newTail.y > head.y) {
    newTail.x++;
    newTail.y--;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  if (newTail.x > head.x && newTail.y < head.y) {
    newTail.x--;
    newTail.y++;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  // check for horizontal/vertical cases
  if (newTail.x < head.x) {
    newTail.x++;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }
  if (newTail.x > head.x) {
    newTail.x--;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }
  if (newTail.y < head.y) {
    newTail.y++;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }
  if (newTail.y > head.y) {
    newTail.y--;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  return newTail;
}

main();
